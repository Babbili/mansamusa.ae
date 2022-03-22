import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useTranslation } from 'react-i18next'
import Separator from "../../../components/UI/Separator/Separator"

import styles from './AdminSidebar.module.scss'


const AdminSidebar = ({ isToggle, setIsToggle, ...props }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  let { isMobile, isClicked, setIsClicked } = props

  let { url } = useRouteMatch()
  const [currentUrl, setCurrentUrl] = useState('')
  const [toggle, setToggle] = useState({})

  const handleToggle = id => {
    setToggle(prevState => ({
        ...prevState,
      [id]: !prevState[id]
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


  return(

    <div
      className={`${styles.AdminSidebar} ${isMobile ? styles.mobile : ''}`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <ul>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/dashboard`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="home" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Dashboard
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/customers`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="users" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Customers
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/suppliers`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="parachute-box" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Suppliers
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/stores`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="store" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Stores
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/subscriptions`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="handshake" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Subscriptions
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
            Products
            <FontAwesomeIcon icon="angle-right" fixedWidth />
          </Link>
          <ul
            style={{
              maxHeight: toggle['1'] ? '600px' : '0',
              opacity: toggle['1'] ? '1' : '0',
              transition: 'all 0.3s ease 0s'
            }}
          >
            <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/view-products`,
                  params: {
                    title: {
                      en: 'View products',
                      ar: 'مشاهدة المنتجات'
                    }
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                View Products
              </NavLink>
            </li>
            {/* <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/characteristics`,
                  params: {
                    title: {
                      en: 'Product characteristics',
                      ar: 'خصائص المنتج'
                    }
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="tasks" fixedWidth />
                <div style={{minWidth: '20px'}} />
                Product Characteristics
              </NavLink>
            </li> */}
            <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/products/categories`,
                  params: {
                    title: {
                      en: 'Product categories',
                      ar: 'فئات المنتجات'
                    }
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                Product Categories
              </NavLink>
            </li>
          </ul>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="shopping-bag" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Orders
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/countries-and-regions`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="flag" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Countries & Regions
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/currencies`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="dollar-sign" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Currencies
          </NavLink>
        </li>

        {/* <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/invitations`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="envelope" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Invitations
          </NavLink>
        </li> */}

        <li>
          <Link
            to={'#'}
            className={toggle['2'] ? styles.toggled : ''}
            onClick={() => handleToggle('2')}
          >
            <FontAwesomeIcon icon="cogs" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Settings
            <FontAwesomeIcon icon="angle-right" fixedWidth />
          </Link>
          <ul
            style={{
              maxHeight: toggle['2'] ? '600px' : '0',
              opacity: toggle['2'] ? '1' : '0',
              transition: 'all 0.3s ease 0s'
            }}
          >
            <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
              <NavLink
                activeClassName={styles.active}
                to={{
                  pathname: `${currentUrl}/settings/subscriptions`,
                  params: {
                    title: {
                      en: 'Subscriptions',
                      ar: 'الاشتراكات'
                    }
                  }
                }}
                onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}
              >
                <FontAwesomeIcon icon="box-open" fixedWidth />
                <div style={{minWidth: '20px'}} />
                Subscriptions
              </NavLink>
            </li>
          </ul>
        </li>

        <Separator color={'#dee2e6'} />

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/reports`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="chart-line" fixedWidth />
            <div style={{minWidth: '20px'}} />
            Sales Reports
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-carts`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="shopping-cart" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('abandonedCarts.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-wishlists`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="heart" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('abandonedWishlists.label') }
          </NavLink>
        </li>
      </ul>
    </div>

  )

}

export default AdminSidebar
