import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './Input.module.scss'


const Input = ({ index, handleChange, label, text, type, error, value, currency, ...restProps }) => {

  const context = useContext(AppContext)
  let { lang } = context
  const [typeChange, setTypeChange] = useState(false)
  const [icon, setIcon] = useState('eye')
  const [currentType, setCurrentType] = useState(type)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (typeChange) {
      setIcon('eye-slash')
    } else {
      setIcon('eye')
    }
  }, [typeChange])

  useEffect(() => {
    setCurrentType(type)
    if (type === 'date') {
      setCurrentType('text')
    } else {
      setCurrentType(type)
    }
  }, [type])

  const handleType = () => {
    setTypeChange(!typeChange)
  }


  return(

    <div className={`${styles.inputGroup} ${error ? styles.error : ''}`}>

      <label className={`${styles.inputLabel} ${value.length > 0 || isFocused || error ? styles.shrink : ''}`}>
        { error ? text : label }
      </label>

      <input
        id={index}
        className={`${styles.input} ${error ? styles.error : ''}`}
        onChange={handleChange}
        // placeholder={label}
        type={typeChange ? 'text' : currentType}
        value={value}
        onFocus={() => {
          setIsFocused(true)
          if (type === 'date') {
            setCurrentType('date')
          }
        }}
        onBlur={() => setIsFocused(false)}
        {...restProps}
      />

      {
        currency !== undefined ?
          <div
            className={`${styles.currency} ${restProps.disabled ? styles.disabled : ''}`}
            style={{
              right: lang !== 'en' ? 'unset' : '10px',
              left: lang !== 'en' ? '10px' : 'unset'
            }}
          >
            { currency }
          </div> : null
      }

      {
        type === 'password' ?
          <div
            className={styles.eye} onClick={handleType}
            style={{
              right: lang !== 'en' ? 'unset' : '10px',
              left: lang !== 'en' ? '10px' : 'unset'
            }}
          >

            <FontAwesomeIcon icon={icon} fixedWidth />
          </div> : null
      }

      {
        // text !== undefined ?
        //   <div
        //     className={`${styles.text} ${error ? styles.errorText : ''}`}
        //     style={{
        //       textAlign: lang === 'ar' ? 'right' : 'left'
        //     }}
        //   >
        //     { text }
        //   </div> : null
      }


    </div>

  )

}

export default Input
