import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { firestore, signOut } from '../../../../firebase/config'

import styles from './AdminName.module.scss'


const AdminName = props => {

  const context = useContext(AppContext)
  const { currentUser } = context
  let { t } = useTranslation()

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    avatar: '',
    loaded: false
  })

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('profile')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          setState(prevState => {
            return {
              ...prevState,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              avatar: doc.data().avatar !== undefined && doc.data().avatar.length > 0 ? doc.data().avatar[0].url : '',
              loaded: true
            }
          })
        })
      })

    }

  }, [currentUser])


  return(

    <div className={styles.AdminName}>
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
            <Link to={'/admin/dashboard'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg> Admin Panel
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

export default AdminName
