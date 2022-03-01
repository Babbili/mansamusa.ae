import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
              <FontAwesomeIcon icon="user" fixedWidth /> { t('profile.label') }
            </Link>
          </li>
          <li
            onClick={() => {
              signOut()
              props.history.push('/')
            }}
          >
            <span>
              <FontAwesomeIcon icon="key" fixedWidth /> { t('logOut.label') }
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
