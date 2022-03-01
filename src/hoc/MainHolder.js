import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Separator from '../components/UI/Separator/Separator'
import UserAvatar from './UserAvatar/UserAvatar'
import AppContext from '../components/AppContext'
import { firestore } from '../firebase/config'
import { Link } from 'react-router-dom'
import urlSlug from 'url-slug'
import moment from 'moment'
import SupplierSidebar from '../containers/Supplier/SupplierSidebar/SupplierSidebar'
import AdminSidebar from '../containers/Admin/AdminSidebar/AdminSidebar'

import styles from './MainHolder.module.scss'
import CustomerSidebar from '../containers/Customer/CustomerSidebar/CustomerSidebar';


const MainHolder = props => {

  const context = useContext(AppContext)
  const { lang } = context
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [isClicked, setIsClicked] = useState(false)
  const [isSupplier, setIsSupplier] = useState(false)
  const [isCustomer, setIsCustomer] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const changeLanguage = (event) => {
    context.handleLanguage(event.target.id)
    i18n.changeLanguage(event.target.value)
    .then(r => {
    })
  }

  useEffect(() => {

    if (context.currentUser !== null) {
      setIsSupplier(context.currentUser.type === 'supplier')
      setIsCustomer(context.currentUser.type === 'customer')
      setIsAdmin(context.currentUser.type === 'admin')
    }

  }, [context.currentUser])

  useEffect(() => {

    return firestore.collection('productTypes')
    .where('isHome', '==', true)
    .onSnapshot(snapshot => {
      let categories = []
      snapshot.forEach(doc => {
        categories = [...categories, {...doc.data()}]
      })
      setCategories(categories)
    })

  }, [])

  useEffect(() => {
    let width = window.innerWidth
    setIsMobile(width <= 769)
  }, [])


  return(

    <div className={`${styles.MainHolder}`}>

      <div
        className={`${styles.menuButton} ${isClicked ? styles.active : ''} ${lang !== 'en' ? styles.rtl : ''}`}
        onClick={() => setIsClicked(!isClicked)}
      />
      <ul
        className={`${styles.nav} ${isClicked ? styles.active : ''} ${lang !== 'en' ? styles.rtl : ''}`}
        onChange={changeLanguage}
      >
        <div className={styles.wrapper}>

          <UserAvatar isClicked={isClicked} setIsClicked={setIsClicked} />

          <Separator color={'#f3c966'} margin={15} />

          {
            isSupplier ?
              <>
                <span>
                  { t('supplierAccount.label') }
                </span>
                <SupplierSidebar
                  isMobile={true}
                  url={'/supplier'}
                  isClicked={isClicked}
                  setIsClicked={setIsClicked}
                />
                <Separator color={'#f3c966'} />
              </>
              : null
          }

          {
            isAdmin ?
              <>
                <span>
                  Admin Panel
                </span>
                <AdminSidebar
                  isMobile={true}
                  url={'/admin'}
                  isClicked={isClicked}
                  setIsClicked={setIsClicked}
                />
                <Separator color={'#f3c966'} />
              </>
              : null
          }

          {
            isCustomer ?
              <>
                <span>
                  Customer Panel
                </span>
                <CustomerSidebar
                  isMobile={true}
                  url={'/customer'}
                  isClicked={isClicked}
                  setIsClicked={setIsClicked}
                />
                <Separator color={'#f3c966'} />
              </>
              : null
          }

          <span>
            { t('shopByCategory.label') }
          </span>

          {
            categories.map((category, index) => {

              const slug = urlSlug(category.title.en, () => category.title.en.split(' ').join('-').toLowerCase())

              return(

                <li
                  key={index}
                  onClick={() => setIsClicked(!isClicked)}
                >
                  <Link to={`/categories/${slug}`}>
                    { category.title[lang] }
                  </Link>
                </li>

              )
            })
          }

          {
            context.currentUser !== null ? null :
              <>
                <Separator color={'#f3c966'} />

                <span>
                { t('supplierSection.label') }
              </span>

                <li onClick={() => setIsClicked(!isClicked)}>
                  <Link to={'/login'}>
                    { t('signInVirtualShop.label') }
                  </Link>
                </li>

                <li onClick={() => setIsClicked(!isClicked)}>
                  <Link to={'/signup'}>
                    { t('signUpVirtualShop.label') }
                  </Link>
                </li>
              </>
          }

          <Separator color={'#f3c966'} />

          <span>
            { t('changeLanguage.label') }
          </span>

          <li>
            <input id='English' type="radio" value="en" name="language" defaultChecked={lang === 'en'} />
            <label htmlFor='English'>
              English
            </label>
          </li>

          <li>
            <input id='العربيّة' type="radio" value="ar" name="language" defaultChecked={lang === 'ar'} />
            <label htmlFor='العربيّة'>
              العربيّة
            </label>
          </li>

        </div>

      </ul>

      <div id='mainContent' className={`${styles.mainContent} ${isClicked ? styles.active : ''} ${lang !== 'en' ? styles.rtl : ''}`}>

        {
          isMobile ?
            <>
              <div
                style={{
                  position: 'fixed',
                  width: '100%',
                  height: '60px',
                  backgroundColor: '#fff',
                  borderBottom: '1px solid #eef1f5',
                  zIndex: 100
                }}
              />
              <div style={{height: 60}} />
            </>
            : null
        }

        { props.children }

      </div>

      <div className={styles.mobileFooter}>
        © { moment().format('YYYY') } { t('copyRight.label') }
      </div>

    </div>

  )

}

export default MainHolder
