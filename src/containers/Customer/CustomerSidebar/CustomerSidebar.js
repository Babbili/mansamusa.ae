import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { NavLink, useRouteMatch } from 'react-router-dom'
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Dashboard
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/profile`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('profile.label') }
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 22h14c1.103 0 2-.897 2-2V9a1 1 0 0 0-1-1h-3V7c0-2.757-2.243-5-5-5S7 4.243 7 7v1H4a1 1 0 0 0-1 1v11c0 1.103.897 2 2 2zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v1H9V7zm-4 3h2v2h2v-2h6v2h2v-2h2l.002 10H5V10z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('myOrders.label') }
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/addresses`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"></path><path d="M11.42 21.814a.998.998 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819zM12 4c3.309 0 6 2.691 6 6.005.021 4.438-4.388 8.423-6 9.73-1.611-1.308-6.021-5.294-6-9.735 0-3.309 2.691-6 6-6z"></path></svg>
            <div style={{minWidth: '20px'}} />
            My Addresses
          </NavLink>
        </li>

      </ul>
    </div>

  )

}

export default CustomerSidebar
