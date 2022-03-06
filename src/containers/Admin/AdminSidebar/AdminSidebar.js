import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Dashboard
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/customers`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 10c1.151 0 2-.848 2-2s-.849-2-2-2c-1.15 0-2 .848-2 2s.85 2 2 2zm0 1c-2.209 0-4 1.612-4 3.6v.386h8V14.6c0-1.988-1.791-3.6-4-3.6z"></path><path d="M19 2H5c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h4l3 3 3-3h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-5 15-2 2-2-2H5V4h14l.002 13H14z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Customers
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/suppliers`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M272 192V320H304C311 320 317.7 321.5 323.7 324.2L443.8 192H415.5C415.8 186.7 416 181.4 416 176C416 112.1 393.8 54.84 358.9 16.69C450 49.27 493.4 122.6 507.8 173.6C510.5 183.1 502.1 192 493.1 192H487.1L346.8 346.3C350.1 352.8 352 360.2 352 368V464C352 490.5 330.5 512 304 512H207.1C181.5 512 159.1 490.5 159.1 464V368C159.1 360.2 161.9 352.8 165.2 346.3L24.92 192H18.89C9 192 1.483 183.1 4.181 173.6C18.64 122.6 61.97 49.27 153.1 16.69C118.2 54.84 96 112.1 96 176C96 181.4 96.16 186.7 96.47 192H68.17L188.3 324.2C194.3 321.5 200.1 320 207.1 320H239.1V192H128.5C128.2 186.7 127.1 181.4 127.1 176C127.1 125 143.9 80.01 168.2 48.43C192.5 16.89 223.8 0 255.1 0C288.2 0 319.5 16.89 343.8 48.43C368.1 80.01 384 125 384 176C384 181.4 383.8 186.7 383.5 192H272z"/></svg>
            <div style={{minWidth: '20px'}} />
            Suppliers
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/stores`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 5c0-1.654-1.346-3-3-3H5C3.346 2 2 3.346 2 5v2.831c0 1.053.382 2.01 1 2.746V19c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8.424c.618-.735 1-1.692 1-2.746V5zm-2 0v2.831c0 1.14-.849 2.112-1.891 2.167L18 10c-1.103 0-2-.897-2-2V4h3c.552 0 1 .449 1 1zM10 4h4v4c0 1.103-.897 2-2 2s-2-.897-2-2V4zM4 5c0-.551.448-1 1-1h3v4c0 1.103-.897 2-2 2l-.109-.003C4.849 9.943 4 8.971 4 7.831V5zm6 14v-3h4v3h-4zm6 0v-3c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H5v-7.131c.254.067.517.111.787.125A3.988 3.988 0 0 0 9 10.643c.733.832 1.807 1.357 3 1.357s2.267-.525 3-1.357a3.988 3.988 0 0 0 3.213 1.351c.271-.014.533-.058.787-.125V19h-3z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Stores
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/subscriptions`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="640" height="512" viewBox="0 0 640 512"><path d="M488 191.1h-152l.0001 51.86c.0001 37.66-27.08 72-64.55 75.77c-43.09 4.333-79.45-29.42-79.45-71.63V126.4l-24.51 14.73C123.2 167.8 96.04 215.7 96.04 267.5L16.04 313.8c-15.25 8.751-20.63 28.38-11.75 43.63l80 138.6c8.875 15.25 28.5 20.5 43.75 11.75l103.4-59.75h136.6c35.25 0 64-28.75 64-64c26.51 0 48-21.49 48-48V288h8c13.25 0 24-10.75 24-24l.0001-48C512 202.7 501.3 191.1 488 191.1zM635.7 154.5l-79.95-138.6c-8.875-15.25-28.5-20.5-43.75-11.75l-103.4 59.75h-62.57c-37.85 0-74.93 10.61-107.1 30.63C229.7 100.4 224 110.6 224 121.6l-.0004 126.4c0 22.13 17.88 40 40 40c22.13 0 40-17.88 40-40V159.1h184c30.93 0 56 25.07 56 56v28.5l80-46.25C639.3 189.4 644.5 169.8 635.7 154.5z"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.316 4.055C19.556 3.478 15 1.985 15 2a3 3 0 1 1-6 0c0-.015-4.556 1.478-6.317 2.055A.992.992 0 0 0 2 5.003v3.716a1 1 0 0 0 1.242.97L6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l2.758.689A1 1 0 0 0 22 8.719V5.003a.992.992 0 0 0-.684-.948z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Products
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21.316 4.055C19.556 3.478 15 1.985 15 2a3 3 0 1 1-6 0c0-.015-4.556 1.478-6.317 2.055A.992.992 0 0 0 2 5.003v3.716a1 1 0 0 0 1.242.97L6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l2.758.689A1 1 0 0 0 22 8.719V5.003a.992.992 0 0 0-.684-.948z"></path></svg>
                <div style={{minWidth: '20px'}} />
                View Products
              </NavLink>
            </li>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
                <div style={{minWidth: '20px'}} />
                Product Categories
              </NavLink>
            </li>
          </ul>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4 20h2V10a1 1 0 0 1 1-1h12V7a1 1 0 0 0-1-1h-3.051c-.252-2.244-2.139-4-4.449-4S6.303 3.756 6.051 6H3a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2zm6.5-16c1.207 0 2.218.86 2.45 2h-4.9c.232-1.14 1.243-2 2.45-2z"></path><path d="M21 11H9a1 1 0 0 0-1 1v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a1 1 0 0 0-1-1zm-6 7c-2.757 0-5-2.243-5-5h2c0 1.654 1.346 3 3 3s3-1.346 3-3h2c0 2.757-2.243 5-5 5z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Orders
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/countries-and-regions`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m14.303 6-3-2H6V2H4v20h2v-8h4.697l3 2H20V6z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Countries & Regions
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/currencies`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 11c-2 0-2-.63-2-1s.7-1 2-1 1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3 2 0 2 .68 2 1s-.62 1-2 1c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92 0-1.12-.52-3-4-3z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Currencies
          </NavLink>
        </li>
        <Separator color={'#dee2e6'} />

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/reports`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 21H3a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zm7 0h-3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1z"></path></svg>
            <div style={{minWidth: '20px'}} />
            Sales Reports
          </NavLink>
        </li>

        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-carts`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
            <div style={{minWidth: '20px'}} />
            { t('abandonedCarts.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? setIsClicked(!isClicked) : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-wishlists`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('abandonedWishlists.label') }
          </NavLink>
        </li>
      </ul>
    </div>

  )

}

export default AdminSidebar
