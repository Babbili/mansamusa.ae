import React, { useContext } from 'react'
import AppContext from '../../AppContext'
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
              </div>
              <div style={{width: '10px'}} />
            </> :
            icon !== undefined ?
              <>
                <div className={styles.icon} style={{color: color}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={color}><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
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
