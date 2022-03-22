import React, { useContext } from 'react'
import AppContext from '../../../AppContext'

import styles from './LanguageSelectorPopUp.module.scss'


const LanguageSelectorPopUp = ({ isHover, changeLanguage }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <ul
      className={`${styles.LanguageSelectorPopUp}`}
      onChange={changeLanguage}
      style={{
        opacity: isHover ? 1 : 0,
        visibility: isHover ? 'visible' : 'hidden',
        top: isHover ? '46px' : '66px',
        right: lang !== 'ar' ? '0.3rem' : 'unset',
        left: lang !== 'ar' ? 'unset' : '0.3rem'
      }}
    >
      <div
        className={styles.before}
        style={{
          right: lang !== 'ar' ? '2rem' : 'uset',
          left: lang !== 'ar' ? 'unset' : '2rem',
        }}
      />
      <li>
        <input id='English' type="radio" value="en" name="language" defaultChecked={lang === 'en'} />
        <label htmlFor='English'>
          English
        </label>
      </li>
      {<li>
        <input id='Turkish' type="radio" value="tr" name="language" defaultChecked={lang === 'tr'} />
        <label htmlFor='Turkish'>
          Turkish
        </label>
      </li>}

      <li>
        <input id='العربيّة' type="radio" value="ar" name="language" defaultChecked={lang === 'ar'} />
        <label htmlFor='العربيّة'>
          العربيّة
        </label>
      </li>
      <li>
        <input id='Русский' type="radio" value="ru" name="language" defaultChecked={lang === 'ru'} />
        <label htmlFor='Русский'>
          Русский
        </label>
      </li>
      <div
        className={styles.after}
        style={{
          right: lang !== 'ar' ? '2rem' : 'unset',
          left: lang !== 'ar' ? 'unset' : '2rem',
        }}
      />
    </ul>

  )

}

export default LanguageSelectorPopUp
