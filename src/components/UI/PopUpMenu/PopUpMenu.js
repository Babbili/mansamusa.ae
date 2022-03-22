import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './PopUpMenu.module.scss'


const PopUpMenu = ({ type, profile, signOut, currentUser }) => {

  let { t } = useTranslation()


  return(

    currentUser ?
      type === 'admin' ?
        <ul className={`${styles.PopUpMenu}`}>
          <li>
            <Link to={profile}>

              <FontAwesomeIcon icon="user" fixedWidth />Admin Panel
            </Link>
          </li>
          <li onClick={() => signOut()}>
            <span>
              <FontAwesomeIcon icon="key" fixedWidth />{ t('logOut.label') }
            </span>
          </li>
        </ul> :
        type === 'supplier' ?
          <ul className={`${styles.PopUpMenu}`}>
            <li>
              <Link to={profile}>
                <FontAwesomeIcon icon="user" fixedWidth />{ t('profile.label') }
              </Link>
            </li>
            <li onClick={() => signOut()}>
            <span>
              <FontAwesomeIcon icon="key" fixedWidth />{ t('logOut.label') }
            </span>
            </li>
          </ul> :
          type === 'customer' ?
            <ul className={`${styles.PopUpMenu}`}>
              <li>
                <Link to={profile}>
                  <FontAwesomeIcon icon="user" fixedWidth />{ t('profile.label') }
                </Link>
              </li>
              <li onClick={() => signOut()}>
            <span>
              <FontAwesomeIcon icon="key" fixedWidth />{ t('logOut.label') }
            </span>
              </li>
            </ul> :
            <ul className={`${styles.PopUpMenu}`}>
              <li>
                <Link to={'/login'}>
                  <FontAwesomeIcon icon="key" fixedWidth />{ t('logIn.label') }
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: '/signup',
                    state: {
                     isUserSignUp: true
                    }
                  }}
                >
                  <FontAwesomeIcon icon="user-plus" fixedWidth />{ t('signUp.label') }
                </Link>
              </li>
            </ul> :
            <ul className={`${styles.PopUpMenu}`}>
              <li>
                <Link to={'/login'}>
                  <FontAwesomeIcon icon="key" fixedWidth />{ t('logIn.label') }
                </Link>
              </li>
              <li>
                <Link
                  to={{
                    pathname: '/signup',
                    state: {
                      isUserSignUp: true
                    }
                  }}
                >
                  <FontAwesomeIcon icon="user-plus" fixedWidth />{ t('signUp.label') }
                </Link>
              </li>
            </ul>

  )

}

export default PopUpMenu
