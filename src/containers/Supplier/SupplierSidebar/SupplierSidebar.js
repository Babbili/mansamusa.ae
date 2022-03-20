import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M3 13h1v7c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-7h1a1 1 0 0 0 .707-1.707l-9-9a.999.999 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 13zm7 7v-5h4v5h-4zm2-15.586 6 6V15l.001 5H16v-5c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v5H6v-9.586l6-6z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('profile.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/stores`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M22 5c0-1.654-1.346-3-3-3H5C3.346 2 2 3.346 2 5v2.831c0 1.053.382 2.01 1 2.746V19c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8.424c.618-.735 1-1.692 1-2.746V5zm-2 0v2.831c0 1.14-.849 2.112-1.891 2.167L18 10c-1.103 0-2-.897-2-2V4h3c.552 0 1 .449 1 1zM10 4h4v4c0 1.103-.897 2-2 2s-2-.897-2-2V4zM4 5c0-.551.448-1 1-1h3v4c0 1.103-.897 2-2 2l-.109-.003C4.849 9.943 4 8.971 4 7.831V5zm6 14v-3h4v3h-4zm6 0v-3c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H5v-7.131c.254.067.517.111.787.125A3.988 3.988 0 0 0 9 10.643c.733.832 1.807 1.357 3 1.357s2.267-.525 3-1.357a3.988 3.988 0 0 0 3.213 1.351c.271-.014.533-.058.787-.125V19h-3z"></path></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M21.316 4.055C19.556 3.478 15 1.985 15 2a3 3 0 1 1-6 0c0-.015-4.556 1.478-6.317 2.055A.992.992 0 0 0 2 5.003v3.716a1 1 0 0 0 1.242.97L6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l2.758.689A1 1 0 0 0 22 8.719V5.003a.992.992 0 0 0-.684-.948z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('myProducts.label') }
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M21.316 4.055C19.556 3.478 15 1.985 15 2a3 3 0 1 1-6 0c0-.015-4.556 1.478-6.317 2.055A.992.992 0 0 0 2 5.003v3.716a1 1 0 0 0 1.242.97L6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l2.758.689A1 1 0 0 0 22 8.719V5.003a.992.992 0 0 0-.684-.948z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm1 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM8 16V4h12l.002 12H8z"></path><path d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8zm11-2h-2v3h-3v2h3v3h2v-3h3V9h-3z"></path></svg>
                <div style={{minWidth: '20px'}} />
                { t('addMultipleProducts.label') }
              </NavLink>
            </li>
          </ul>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/orders`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : console.log('not isMobile')} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M4 20h2V10a1 1 0 0 1 1-1h12V7a1 1 0 0 0-1-1h-3.051c-.252-2.244-2.139-4-4.449-4S6.303 3.756 6.051 6H3a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2zm6.5-16c1.207 0 2.218.86 2.45 2h-4.9c.232-1.14 1.243-2 2.45-2z"></path><path d="M21 11H9a1 1 0 0 0-1 1v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a1 1 0 0 0-1-1zm-6 7c-2.757 0-5-2.243-5-5h2c0 1.654 1.346 3 3 3s3-1.346 3-3h2c0 2.757-2.243 5-5 5z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('myOrders.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/balance`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 11c-2 0-2-.63-2-1s.7-1 2-1 1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3 2 0 2 .68 2 1s-.62 1-2 1c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92 0-1.12-.52-3-4-3z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('myBalance.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/plan`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M11.445 21.832a1 1 0 0 0 1.11 0l9-6A.998.998 0 0 0 21.8 14.4l-9-12c-.377-.504-1.223-.504-1.6 0l-9 12a1 1 0 0 0 .245 1.432l9 6zm8.12-7.078L12 19.798V4.667l7.565 10.087z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('myPlan.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/reports`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M3 3v17a1 1 0 0 0 1 1h17v-2H5V3H3z"></path><path d="M15.293 14.707a.999.999 0 0 0 1.414 0l5-5-1.414-1.414L16 12.586l-2.293-2.293a.999.999 0 0 0-1.414 0l-5 5 1.414 1.414L13 12.414l2.293 2.293z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('mySalesReport.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-carts`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M21 4H2v2h2.3l3.28 9a3 3 0 0 0 2.82 2H19v-2h-8.6a1 1 0 0 1-.94-.66L9 13h9.28a2 2 0 0 0 1.92-1.45L22 5.27A1 1 0 0 0 21.27 4 .84.84 0 0 0 21 4zm-2.75 7h-10L6.43 6h13.24z"></path><circle cx="10.5" cy="19.5" r="1.5"></circle><circle cx="16.5" cy="19.5" r="1.5"></circle></svg>
            <div style={{minWidth: '20px'}} />
            { t('abandonedCarts.label') }
          </NavLink>
        </li>
        <li onClick={() => isMobile ? Clicked() : ''}>
          <NavLink activeClassName={styles.active} to={`${currentUrl}/abandoned-wishlists`} onClick={() => window.innerWidth < 770 ? setIsToggle(!isToggle) : ''} >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>
            <div style={{minWidth: '20px'}} />
            { t('abandonedWishlists.label') }
          </NavLink>
        </li>
      </ul>
    </div>
    
  )

}

export default SupplierSidebar
