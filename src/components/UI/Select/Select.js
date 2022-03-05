import React, { useState, useRef, useEffect } from 'react'
import styles from './Select.module.scss'


const Select = ({ lang, index, value, name, title, options, deactivate, handleChange, error, text }) => {

  const [isFocus, setIsFocus] = useState(false)
  const selectInputLabel = useRef()

  useEffect(()=> {
    selectInputLabel.current.style.visibility = 'hidden'
  }, [])

  return(

    <div className={`${styles.Select} ${error ? styles.error : ''}`} onClick={() => selectInputLabel.current.style.visibility = 'hidden'} >

      <span className={`${styles.inputGroupAddon} ${isFocus ? styles.focus : ''}`}>

        <div className={styles.arrowWrapper}>
          <div className={styles.arrow}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path></svg>
          </div>
        </div>

        <label className={`${styles.inputLabel} ${typeof value === 'object' || error ? styles.shrink : ''}`} ref={selectInputLabel} >
          { error ? text : title }
        </label>

        <select
          required
          name={name}
          value={
            typeof value === 'object' ?
              JSON.stringify(value, Object.keys(value).sort()) : value
          }
          className={`${styles.textField} ${error ? styles.error : ''}`}
          onChange={handleChange}
          disabled={deactivate !== undefined && Object.values(deactivate).length > 0 ? 'disabled' : ''}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        >
          {
            title !== undefined ?
              <option value="" disabled>{ title }</option> : null
          }
          {
            options.length > 0 ?
              options.map(option => {

                return(

                  <option
                    id={option.id}
                    key={option.id}
                    tabIndex={index}
                    value={
                      option.title !== undefined ?
                        typeof option.title === 'object' ?
                          JSON.stringify(option.title, Object.keys(option.title).sort()) : option.title :
                        typeof option.value === 'object' ?
                          JSON.stringify(option.value, Object.keys(option.value).sort()) : option.value
                    }
                    onClick={() => selectInputLabel.current.style.visibility = 'hidden'}
                  >
                    {
                      option.title !== undefined ?
                        typeof option.title === 'object' ?
                          option.title[lang] : option.title :
                        typeof option.value === 'object' ?
                          option.value[lang] : option.value
                    }
                  </option>

                )

              }) : null
          }
        </select>
        {
          // text !== undefined ?
          //   <div
          //     className={`${styles.text} ${error ? styles.errorText : ''}`}
          //   >
          //     { text }
          //   </div> : null
        }
      </span>
    </div>

  )

}

export default Select
