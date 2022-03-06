import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {firestore, signOut} from '../../../../firebase/config'

import styles from './SupplierName.module.scss'


const SupplierName = props => {

  const context = useContext(AppContext)
  const { currentUser } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    avatar: [],
    loaded: false
  })

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('profile')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          let url = doc.data().avatar !== undefined && doc.data().avatar.length > 0 ? doc.data().avatar[0].url : ''
          setState(prevState => {
            return {
              ...prevState,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              avatar: url,
              loaded: true
            }
          })
        })
      })

    }

  }, [currentUser])


  return(

    <div className={styles.SupplierName}>
      <div
        className={styles.initials}
        style={{
          opacity: state.loaded ? 1 : 0,
          backgroundImage: state.avatar.length > 0 ? `url(${state.avatar})` : '',
          backgroundSize: state.avatar.length > 0 ? 'cover' : ''
        }}
      >
        {
          state.avatar.length === 0 ?
            state.firstName.slice(0,1) + state.lastName.slice(0,1) :
            null
        }

        <ul className={`${styles.menu} ${styles.active}`}>
          <li>
            <Link to={'/supplier/profile'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg> { t('profile.label') }
            </Link>
          </li>
          <li
            onClick={() => {
              signOut()
              props.history.push('/')
            }}
          >
            <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg> { t('logOut.label') }
            </span>
          </li>
        </ul>

      </div>
      <div style={{width: '10px'}} />
      <div
        className={styles.name}
        style={{
          maxWidth: state.loaded ? '500px' : '0',
          opacity: state.loaded ? 1 : 0
        }}
      >
        { state.firstName } { state.lastName }
      </div>
    </div>

  )

}

export default SupplierName
