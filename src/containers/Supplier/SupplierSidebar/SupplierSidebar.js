import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './SupplierSidebar.module.scss'
import { useTranslation } from 'react-i18next'


const SupplierSidebar = ({ isToggle, setIsToggle, ...props }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  let {isMobile, isClicked, setIsClicked} = props

  let { url } = useRouteMatch()
  const [currentUrl, setCurrentUrl] = useState('')
  const [toggle, setToggle] = useState({})

  const handleToggle = id => {
    setToggle(prevState => ({
        ...prevState, [id]: !prevState[id]
      })
    )
  }

  useEffect(() => {

    if (isMobile) {
      setCurrentUrl(props.url)
    } else {
      setCurrentUrl(url)
    }

  }, [url, props.url, isMobile])

  function Clicked() {
    setIsClicked(!isClicked)
  }

  return(

    <div
      className={`${styles.SupplierSidebar} ${isMobile ? styles.mobile : ''}`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <ul>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/profile`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="home" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('profile.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/stores`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="store" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myStores.label') }
          </NavLink>
        </li>
        <li>
          <Link
            to={'#'}
            className={toggle['1'] ? styles.toggled : ''}
            onClick={() => handleToggle('1')}
          >
            <FontAwesomeIcon icon="box-open" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myProducts.label') }
            <FontAwesomeIcon icon="angle-right" fixedWidth />
          </Link>
          <ul
            style={{
              maxHeight: toggle['1'] ? '600px' : '0',
              opacity: toggle['1'] ? '1' : '0',
              transition: 'all 0.3s ease 0s'
            }}
          >
            <li onClick={() => isMobile ? Clicked() : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/view-products`,
                  params: {
                    title: t('myProducts.label')
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                { t('viewProducts.label') }
              </NavLink>
            </li>
            <li onClick={() => isMobile ? Clicked() : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/add-new`,
                  params: {
                    title: t('addProduct.label')
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                { t('addProduct.label') }
              </NavLink>
            </li>
            <li onClick={() => isMobile ? Clicked() : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/add-multiple`,
                  params: {
                    title: t('addMultipleProducts.label')
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                { t('addMultipleProducts.label') }
              </NavLink>
            </li>
          </ul>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : console.log('not isMobile')} >
            <FontAwesomeIcon icon="shopping-bag" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myOrders.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/balance`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="dollar-sign" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myBalance.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/plan`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="handshake" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myPlan.label') }
          </NavLink>
        </li>
        {/*<li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>*/}
        {/*  <NavLink activeClassName={styles.active} to={`${currentUrl}/invite`}>*/}
        {/*    <FontAwesomeIcon icon="envelope" fixedWidth />*/}
        {/*    <div style={{minWidth: '20px'}} />*/}
        {/*    { t('inviteFriends.label') }*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/reports`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="chart-line" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('mySalesReport.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-carts`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="shopping-cart" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('abandonedCarts.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-wishlists`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
            <FontAwesomeIcon icon="heart" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('abandonedWishlists.label') }
          </NavLink>
        </li>
      </ul>
    </div>
    
  )

}

export default SupplierSidebar
