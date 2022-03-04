import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 4.998c-1.836 0-3.356.389-4.617.971L3.707 2.293 2.293 3.707l3.315 3.316c-2.613 1.952-3.543 4.618-3.557 4.66l-.105.316.105.316C2.073 12.382 4.367 19 12 19c1.835 0 3.354-.389 4.615-.971l3.678 3.678 1.414-1.414-3.317-3.317c2.614-1.952 3.545-4.618 3.559-4.66l.105-.316-.105-.316c-.022-.068-2.316-6.686-9.949-6.686zM4.074 12c.103-.236.274-.586.521-.989l5.867 5.867C6.249 16.23 4.523 13.035 4.074 12zm9.247 4.907-7.48-7.481a8.138 8.138 0 0 1 1.188-.982l8.055 8.054a8.835 8.835 0 0 1-1.763.409zm3.648-1.352-1.541-1.541c.354-.596.572-1.28.572-2.015 0-.474-.099-.924-.255-1.349A.983.983 0 0 1 15 11a1 1 0 0 1-1-1c0-.439.288-.802.682-.936A3.97 3.97 0 0 0 12 7.999c-.735 0-1.419.218-2.015.572l-1.07-1.07A9.292 9.292 0 0 1 12 6.998c5.351 0 7.425 3.847 7.926 5a8.573 8.573 0 0 1-2.957 3.557z"></path></svg>
          </div> : null
      }

    </div>

  )

}

export default Input
