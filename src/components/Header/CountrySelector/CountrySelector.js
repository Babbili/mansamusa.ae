import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'
import CountryPopUp from '../../CountryPopUp/CountryPopUp'

import styles from './CountrySelector.module.scss'


const CountrySelector = () => {

  const context = useContext(AppContext)
  const { lang, country, countries, handleCountry } = context
  const [currentCountry, setCurrentCountry] = useState({
    title: {
      en: 'UAE',
      tr: 'Turkish',
      ar: 'الإمارات العربية المتحدة',
      ru: 'UAE'
    },
    flag : 'https://firebasestorage.googleapis.com/v0/b/mansamusa-4f8be.appspot.com/o/images%2Fuae_flag.jpg?alt=media&token=e025f8ae-4cce-4652-8498-fd4e038406d1'
  })
  const [isCountryPopUp, setIsCountryPopUp] = useState(false)

  useEffect(() => {
    if (typeof country !== 'object') return
    setCurrentCountry(country)
  }, [country])

  useEffect(() => {

    const escFunction = (event) => {
      if (event.keyCode === 27) {
        setIsCountryPopUp(!isCountryPopUp)
      }
    }
    document.addEventListener('keydown', escFunction, false)
    return () => document.removeEventListener('keydown', escFunction, false)

  }, [isCountryPopUp])

  const handleClosePopUp = e => {
    if (document.getElementById('closeBox') === e.target) {
      setIsCountryPopUp(!isCountryPopUp)
    }
  }


  return (

    
    <div className={styles.CountrySelector}>

      {
        isCountryPopUp ?
          <CountryPopUp
            close={handleClosePopUp}
            country={country}
            countries={countries}
            handleCountry={handleCountry}
          /> : null
      }

      <div
        className={styles.flag}
        style={{
          backgroundImage: `url(${currentCountry.flag})`
        }}
        onClick={() => setIsCountryPopUp(!isCountryPopUp)}
      />
      {/* { console.log(`countries are ${countries}`, `handleCountry is ${handleCountry}`, `country is ${country}`, `lang is ${lang}`) } */}
      <div
        className={styles.item}
        onClick={() => setIsCountryPopUp(!isCountryPopUp)}
      >
        { currentCountry.title[lang] }
      </div>
      {/* { console.log(`context is ${context}`, `appContext is ${AppContext}`) } */}
    </div>

  )

}

export default CountrySelector
