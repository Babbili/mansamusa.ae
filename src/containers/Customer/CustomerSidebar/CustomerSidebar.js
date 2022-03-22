import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { NavLink, useRouteMatch } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './CustomerSidebar.module.scss'
import { useTranslation } from 'react-i18next'


const CustomerSidebar = ({ isToggle, setIsToggle, ...props }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  let { isMobile, isClicked, setIsClicked } = props

  let { url } = useRouteMatch()
  const [currentUrl, setCurrentUrl] = useState('')
  const [toggle, setToggle] = useState({})

  useEffect(() => {

    if (isMobile) {
      setCurrentUrl(props.url)
    } else {
      setCurrentUrl(url)
    }

  }, [url, props.url, isMobile])

  return(

    <div
      className={`${styles.CustomerSidebar} ${isMobile ? styles.mobile : ''}`}
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
          <NavLink activeClassName={styles.active} to={`${currentUrl}/profile`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="user" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('profile.label') }
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="shopping-bag" fixedWidth />
            <div style={{minWidth: '20px'}} />
            { t('myOrders.label') }
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/addresses`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
            <FontAwesomeIcon icon="map-marker-alt" fixedWidth />
            <div style={{minWidth: '20px'}} />
            My Addresses
          </NavLink>
        </li>

      </ul>
    </div>

  )

}

export default CustomerSidebar
