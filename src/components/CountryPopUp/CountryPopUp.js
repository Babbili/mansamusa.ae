import React, { useContext } from 'react'
import AppContext from '../AppContext'

import styles from './CountryPopUp.module.scss'


const CountryPopUp = ({ close, country, countries, handleCountry }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <div
      id='closeBox'
      className={styles.CountryPopUp}
      onClick={(e) => close(e)}
    >

      <div className={styles.wrapper}>

        <div className={styles.header}>

          <div className={styles.title}>
            Delivery Destination or Region
          </div>

          <div className={styles.description}>
            You are currently shipping to { country.title[lang] } and your order will be billed in { country.currency.code } { country.currency.symbol }.
          </div>

        </div>

        <div className={styles.countries}>

          {
            countries.map(c => (
              <div
                key={c.id}
                className={`${styles.country} ${c.id === country.id ? styles.active : ''}`}
                onClick={() => handleCountry(c)}
              >
                <div
                  className={styles.flag}
                  style={{
                    backgroundImage: `url(${c.flag})`
                  }}
                />
                <div className={styles.name}>
                  { c.title[lang] }
                </div>
                <div
                  className={styles.currency}
                  style={{
                    marginLeft: lang === 'en' ? 'auto' : '0',
                    marginRight: lang !== 'en' ? 'auto' : '0'
                  }}
                >
                  { c.currency.code } { c.currency.symbol }
                </div>
              </div>
            ))
          }

        </div>

      </div>

    </div>

  )

}

export default CountryPopUp