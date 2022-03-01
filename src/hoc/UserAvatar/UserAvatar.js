import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../components/AppContext'
import { useTranslation } from 'react-i18next'
import { signOut } from '../../firebase/config'
import { Link } from 'react-router-dom'

import styles from './UserAvatar.module.scss'


const UserAvatar = ({ isClicked, setIsClicked }) => {

  const context = useContext(AppContext)
  const { t } = useTranslation()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    if (context.currentUser !== null) {
      setUserName(context.currentUser.displayName)
    }
  }, [context.currentUser])

  return(

    <div className={styles.UserAvatar}>

      <div className={styles.avatar} />

      <div style={{width: 15}} />

      <div className={styles.textBlock}>
        <div
          className={styles.name}
          onClick={() => setIsClicked(!isClicked)}
        >
          <Link to={'/supplier/profile'}>
            { context.currentUser ? userName : t('account.label') }
          </Link>
        </div>

        {
          context.currentUser ?
            <div
              className={styles.logOut}
              onClick={() => {
                setIsClicked(!isClicked)
                signOut()
              }}
            >
              { t('logOut.label') }
            </div> :
            <div
              className={styles.logOut}
              onClick={() => setIsClicked(!isClicked)}
            >
              <Link to={'/login'}>
                { t('logIn.label') }
              </Link>
            </div>
        }

      </div>

    </div>

  )

}

export default UserAvatar
