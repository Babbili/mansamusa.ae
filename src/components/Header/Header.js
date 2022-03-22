import React, { useCallback, useContext, useEffect, useState, useRef } from 'react'
import AppContext from '../AppContext'
import { firestore } from '../../firebase/config'
import { Link, NavLink } from 'react-router-dom'
import { toSlug } from '../utils/toSlug'
import LanguageSelector from './LanguageSelector/LanguageSelector'
import logo from '../../assets/logo.png'
import TopSearch from './TopSearch/TopSearch'
import { signOut } from '../../firebase/config.js'
import { useTranslation } from 'react-i18next'
import styles from './Header.module.scss'


const Header = props => {

  const context = useContext(AppContext)
  const { wishlist } = context
  const { t } = useTranslation()
  const [userName, setUserName] = useState('')
  const [userType, setUserType] = useState('')
  const [hide, setHide] = useState('hide')
  const [hovered, setHovered] = useState(false)

  let { cart } = context

  let quantity = cart.length > 0 ? cart.reduce((a, b) => a + b.quantity, 0) : 0

  useEffect(() => {
    if (context.currentUser !== null) {
      setUserName(context.currentUser.displayName)
      setUserType(context.currentUser.type)
    }
  }, [context.currentUser])


  let { lang } = context
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const dropDown = useRef()
  const dropDownUser = useRef()

  useEffect(() => {

    return firestore.collection('productTypes')
    .onSnapshot(snapshot => {
      let categories = []
      snapshot.forEach(doc => {
        categories = [...categories, {id: doc.id, title: doc.data().title}]
      })
      setCategories(categories)
    })

  }, [])

  const getSubCategories = useCallback((initialQuery, categories, index) => {

    const getSubs = (initialQuery, categories, index) => {

      let currentIndex = index === categories.length - 1 ? categories.length - 1 : index

      initialQuery.where('title', '==', categories[currentIndex].title)
      .get().then(querySnapshot => {

        currentIndex = currentIndex + 1

        querySnapshot.forEach(doc => {
          doc.ref.collection('subCategories')
          .get().then(querySnapshot => {
            let docs = {
              title: doc.data().title,
              subCategories: []
            }
            querySnapshot.forEach(doc => {
              docs = {
                ...docs,
                subCategories: [...docs.subCategories, {id: doc.id, ...doc.data()}]
              }
            })
            setSubCategories(prevState => {
              return [...prevState, docs]
            })
          })
          .then(() => {
            if (currentIndex <= categories.length - 1) {
              getSubs(initialQuery, categories, currentIndex)
            }
          })
        })
      })

    }

    return getSubs(initialQuery, categories, index)

  }, [])

  

  useEffect(() => {

    let initialQuery = firestore.collection('productTypes')
    let index = 0

    return categories.length > 0 ?
      getSubCategories(initialQuery, categories, index) : null

  }, [categories, getSubCategories])


  
  const svgXP = useRef()
  const svgOP = useRef()
  function toggleMenu() {
    dropDown.current.classList.toggle('hide')
    svgOP.current.classList.toggle('hide')
    svgXP.current.classList.toggle('hide')
  }
  function hideUserMenu() {
    if(dropDownUser && dropDownUser.current) {
    dropDownUser.current.classList.add('hide')
    } else {
       console.log('noDropDU', dropDownUser)
    }
  }
  function unhideUserMenu() {
    if(dropDownUser) {
    dropDownUser.current.classList.remove('hide')
    } else { 
      console.log('noDropDU')
    }
  }

  const [active, setActive] = useState(false)
  const [keyActive, setKeyActive] = useState(false)
 
  return (
    <>
    <header className={styles.topHeader+` bd__container`} id="header">
      <img src={logo} onClick={() => window.location='/'} />

      <div className={styles.header}>
      <nav className={styles.header__nav}>
        <div className={styles.nav__menu}>
          <ul className={styles.nav__menu__items}>

            <li className={styles.nav__item__shop} 
            onClick={() => toggleMenu()}
             >
              <p>{t('shopByCategory.label')}</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)"><path ref={svgOP} d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 14.414-5.707-5.707 1.414-1.414L12 13.586l4.293-4.293 1.414 1.414L12 16.414z"></path><path className="hide" fill="#d75439" ref={svgXP} d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
              
            </li>

            <li className={styles.nav__item} id={styles.nav__item__home} >
              <NavLink className={styles.nav__link} activeClassName={styles.nav__link__active} exact to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path></svg>
                <p>{t('home.label')}</p>
              </NavLink>
            </li>

            <li className={styles.nav__item} id={styles.nav__item__cat}>
              <NavLink className={styles.nav__link} activeClassName={styles.nav__link__active} exact to="/categories" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
                <p className={styles.nav__link__label}>{t('categories.label')}</p>
              </NavLink>
            </li>

            <li className={styles.nav__item} id={styles.nav__item__user__desk}>
              <a className={styles.nav__link} 
              onMouseEnter={() => unhideUserMenu()}
              onMouseLeave={() => { setTimeout(() => { hideUserMenu()}, 2000) }} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--title-color)"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                <p className={styles.nav__link__label}>{ t('account.label') }</p>
              </a>
              <div className="hide" ref={dropDownUser}
              onMouseEnter={() => unhideUserMenu()}
              onMouseLeave={() => hideUserMenu()}>
              {
                context.currentUser &&
                
                userType === 'admin' ?
                  <ul className={`${styles.PopUpMenu}`}>
                    <li >
                      <Link to={`/${userType}`} className={`svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>Admin Panel
                      </Link>
                    </li>
                    <li onClick={() => signOut()}>
                      <span className={`svg${keyActive}`} onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                      </span>
                    </li>
                  </ul> :
                  userType === 'supplier' ?
                    <ul className={`${styles.PopUpMenu}`}>
                      <li>
                        <Link to={`/${userType}`} className={`svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>{ t('profile.label') }
                        </Link>
                      </li>
                      <li onClick={() => signOut()}>
                      <span className={`svg${keyActive}`} onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                      </span>
                      </li>
                    </ul> :
                    userType === 'customer' ?
                      <ul className={`${styles.PopUpMenu}`}>
                        <li>
                          <Link to={`/${userType}`} className={`svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>{ t('profile.label') }
                          </Link>
                        </li>
                        <li onClick={() => signOut()}>
                      <span className={`svg${keyActive}`} onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                      </span>
                        </li>
                      </ul> :
                      <ul className={`${styles.PopUpMenu}`}>
                        <li>
                          <Link to={'/login'} className={`svg${keyActive}`} onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logIn.label') }
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={`svg${active}`}
                            onMouseEnter={()=> setActive(true) }
                            onMouseLeave={()=> setActive(false)}
                            to={{
                              pathname: '/signup',
                              state: {
                               isUserSignUp: true
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"></path></svg>{ t('signUp.label') }
                          </Link>
                        </li>
                      </ul>
                      
              }
              </div>
            </li>

            <li className={styles.nav__item} id={styles.nav__item__user__mob}>
              <NavLink className={styles.nav__link} activeClassName={styles.nav__link__active} exact to="/user" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                <p className={styles.nav__link__label}>{ context.currentUser ? userName : t('account.label') }</p>
              </NavLink>
            </li>

            <li className={styles.nav__item}>
              <NavLink className={styles.nav__link} activeClassName={styles.nav__link__active} exact to='/wishlist' onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}  style={{position: 'relative'}} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
                { wishlist.length > 0 ? 
                <span style={{position: 'absolute', top: '1px', left: '1px' ,borderRadius: '50%' , background: '#d75439', color: '#fff', fontSize: '11px', width: 'var(--normal-font-size)', display: 'block', height: 'var(--normal-font-size)',  textAlign:'center' }}>{wishlist.length}</span> : '' }
                <p className={styles.nav__link__label}>{ t('wishlist.label') }</p>
              </NavLink>
            </li>

            <li className={styles.nav__item}>
              <NavLink className={styles.nav__link} activeClassName={styles.nav__link__active} exact to="/cart" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{position: 'relative'}} >
                <svg className={styles.nav__link__svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--title-color)"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
                { quantity > 0 ? 
                <span style={{position: 'absolute', top: '1px', left: '1px' ,borderRadius: '50%' , background: '#d75439', color: '#fff', fontSize: '11px', width: 'var(--normal-font-size)', display: 'block', height: 'var(--normal-font-size)', textAlign:'center' }}>{quantity}</span>: '' }
                <p className={styles.nav__link__label}>{ t('cart.label') }</p>
              </NavLink>
            </li>

          </ul>
        </div>
      </nav>
      </div>

      <div className={styles.topHeader__selectors}>
        <LanguageSelector />
      </div>
    </header>
    

    <div className={`${styles.dropdown__menu} ${hide}`}
    ref={dropDown}
    >
      {
        subCategories.length > 0 ?
          subCategories.map((subCategory, index) => (
            <div
              key={index}
              className={styles.dropdown__menu__container}
              style={{
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}
            >
              <h5 >
                <Link to={`/categories${toSlug(subCategory.title[lang])}/`} onClick={()=> toggleMenu()} >
                  { subCategory.title[lang] }
                </Link>
              </h5>
              <ul>
                {
                  subCategory.subCategories.map((subCat, index) => (
                    <li key={index} >
                      <Link to={`/categories${toSlug(subCategory.title[lang])}${toSlug(subCat.title[lang])}`} onClick={()=> toggleMenu()} >
                        { subCat.title[lang] }
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          )) : null
      }
    </div>

    <TopSearch />
    </>
  )



}

export default Header
