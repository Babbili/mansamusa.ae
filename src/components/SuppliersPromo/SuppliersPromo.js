import React, { useContext } from 'react'
import AppContext from '../AppContext'
import SignUpButton from '../UI/SignUpButton/SignUpButton'

import styles from './SuppliersPromo.module.scss'
import rent from './../../assets/rentMansaMusa.png'


const SuppliersPromo = props => {

  const context = useContext(AppContext)

  return(

    <div className={styles.SuppliersPromo}>
      <div className={styles.wrapper}>
        <img src={rent} alt='Suppliers Pre-registration' />

        {
          context.currentUser !== null ?
            <div className={styles.textBlock}>
              <h3>
                Thank you for registering with us. We will get back to you shortly.
              </h3>
              <div style={{width: '210px'}}>
                <SignUpButton
                  type={'custom'}
                  title='Your Account'
                  onClick={() => {
                    props.history.push('/supplier')
                  }}
                  disabled={false}
                />
              </div>
            </div> :
            <div className={styles.textBlock}>
              <h3>Suppliers Pre-Registration</h3>
              <h2>Create Store Now</h2>
              <div style={{width: '110px'}}>
                <SignUpButton
                  type={'custom'}
                  title='Sign Up'
                  onClick={() => {
                    props.history.push({
                      pathname: '/signup',
                      state: {
                        isSupplierSignUp: true
                      }
                    })
                  }}
                  disabled={false}
                  isWide={true}
                />
              </div>
            </div>
        }

      </div>
    </div>

  )

}

export default SuppliersPromo
