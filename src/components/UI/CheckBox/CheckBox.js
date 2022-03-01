import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { Link } from 'react-router-dom'

import styles from './CheckBox.module.scss'
import { scrollToTop } from '../../../utils/utils'

const CheckBox = ({ error, text, name, onClick, isChecked, isSupplier }) => {

  const context = useContext(AppContext)
  let { lang } = context


  return(

    <div className={styles.CheckBox}>
      <div className={styles.wrapper}>
        <input
          type='checkbox'
          className={styles.checkBox}
          id={name}
          name={name}
          onChange={() => onClick(name, !isChecked)}
          checked={isChecked}
        />
        <div style={{width: '15px'}} />
        <label
          htmlFor={name}
          className={styles.label}
          // onClick={() => scrollToTop(0, 'smooth')}
        >
          {
            text === 'I agree to the Terms & Conditions & Privacy Policy' ?
              <div>I agree to the <Link to={isSupplier ? '/page/terms-&-conditions-for-traders' : '/page/terms-&-conditions'}>Terms & Conditions</Link> and <Link to="/page/privacy-&-cookie-policy">Privacy Policy</Link></div> :
              text === 'أوافق على الشروط والأحكام وسياسة الخصوصية' ?
                <div> أوافق على <Link to={isSupplier ? '/page/terms-&-conditions-for-traders' : '/page/terms-&-conditions'}>الشروط والأحكام</Link> و <Link to="/page/privacy-&-cookie-policy">سياسة الخصوصية</Link></div> :
                text

          }
        </label>
      </div>
      {
        error ?
          <div
            className={styles.error}
            style={{
              textAlign: lang === 'ar' ? 'right' : 'left',
              marginLeft: lang !== 'en' ? 'unset' : '28px',
              marginRight: lang !== 'en' ? '28px' : 'unset'
            }}
          >
            { error }
          </div> : null
      }
    </div>

  )

}

export default CheckBox
