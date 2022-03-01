import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './SignUpButton.module.scss'
import ButtonSpinner from '../ButtonSpinner/ButtonSpinner'


const SignUpButton = ({ title, type, onClick, icon, color, isSmall, isQuantity, isActive, loading, formType, disabled, isWide }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <button
      className={`
        ${styles.SignUpButton}
        ${styles[type]}
        ${isSmall ? styles.small : ''}
        ${isQuantity ? styles.quantity : ''}
        ${isActive ? styles.active : ''}
        ${isWide ? styles.wide: ''}
      `}
      type={formType}
      onClick={onClick}
      style={{
        padding: type === 'goback' ? '13px 0' : isSmall ? '10px 20px' : '13px',
        pointerEvents: loading ? 'none' : 'all'
      }}
      disabled={disabled}
    >
      {
        type === 'google' ?
          <>
            <div className={styles.icon}>
              <FontAwesomeIcon icon={['fab', 'google']} fixedWidth />
            </div>
            <div style={{width: '10px'}} />
          </> :
          type === 'goback' ?
            <>
              <div
                className={styles.icon}
                style={{
                  transform: lang !== 'en' ? 'rotate(180deg)' : '',
                  margin: '0'
                }}
              >
                <FontAwesomeIcon icon='chevron-left' fixedWidth />
              </div>
              <div style={{width: '10px'}} />
            </> :
            icon !== undefined ?
              <>
                <div className={styles.icon} style={{color: color}}>
                  <FontAwesomeIcon icon={icon} fixedWidth />
                </div>
                <div style={{width: '10px'}} />
              </> : null
      }

      {
        loading ?
          <ButtonSpinner /> :
          <div className={styles.title} style={{color: color}}>
            { title }
          </div>
      }

    </button>

  )

}

export default SignUpButton
