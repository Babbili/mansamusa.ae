import React, { useEffect, useState, useRef } from 'react'
import styles from './TextArea.module.scss'


const TextArea = ({ name, value, rows, placeholder, handleChange, hideSwitch, ...restProps }) => {

  const languages = ['en', 'ar', 'ru']
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [currentDir, setCurrentDir] = useState('ltr')
  const switchLang = useRef()

  useEffect(() => {
    hideSwitch == true ? (switchLang.current.style.display = 'none') : (switchLang.current.style.display = 'block')
  },[])

  useEffect(() => {

    if (currentLanguage === 'ar') {
      setCurrentDir('rtl')
    } else {
      setCurrentDir('ltr')
    }

  }, [currentLanguage])

  return(

    <div className={styles.TextArea}>

      <div className={styles.switch} ref={switchLang}>
        {
          languages.map(l => (
            <div
              key={l}
              className={styles.item}
              style={{
                backgroundColor: l === currentLanguage ? '#a88020' : '#eeeeee',
                color: l === currentLanguage ? '#ffffff' : '#a88020',
              }}
              onClick={() => setCurrentLanguage(l)}
            >
              { l.toUpperCase() }
            </div>
          ))
        }
      </div>

      <textarea
        name={name}
        className={styles.txtArea}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => handleChange(e, currentLanguage)}
        value={{value}[currentLanguage]}
        dir={currentDir}
        {...restProps}
      />

    </div>

  )

}

export default TextArea
