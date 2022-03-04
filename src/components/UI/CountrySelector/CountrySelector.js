import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../firebase/config'
import AppContext from '../../AppContext'
import { useTranslation } from 'react-i18next'
import Select from '../Select/Select'

import styles from './CountrySelector.module.scss'


const CountrySelector = ({ state, handleChangeSelector }) => {

  const context = useContext(AppContext)
  const { lang } = context
  const { t } = useTranslation()

  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])

  useEffect(() => {
    return firestore.collection('countriesList')
    .onSnapshot(snapshot => {
      let countries = []
      snapshot.forEach(doc => {
        countries = [...countries, {id: doc.id, ...doc.data()}]
      })
      setCountries(countries)
    })
  }, [])

  useEffect(() => {
    if (Object.values(state.country).length > 0) {
      return firestore.collection('countriesList')
      .where(`title.en`, '==', state.country.en)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          firestore.collection('countriesList')
          .doc(doc.id).collection('regions')
          .onSnapshot(snapshot => {
            let regions = []
            snapshot.forEach(doc => {
              regions = [...regions, {id: doc.id, ...doc.data()}]
            })
            setRegions(regions)
          })
        })
      })
    }
  }, [state.country, lang])

  // console.log('countries', countries)
  // console.log('regions', regions)
  // console.log('state.country', state.country)

  return(


    countries.length > 0 ?
    <>

      <div className={styles.Select}>
        <span className={styles.inputGroupAddon}>

          <Select
            lang={lang}
            name={'country'}
            title={ t('selectCountry.label') }
            options={countries}
            value={state.country}
            handleChange={handleChangeSelector}
          />

        </span>
      </div>

      {
        typeof state.country !== 'string' ?
          <div className={styles.Select}>
            <span className={styles.inputGroupAddon}>

              <Select
                lang={lang}
                name={'region'}
                title={ t('selectRegion.label') }
                options={regions}
                value={state.region}
                handleChange={handleChangeSelector}
              />

            </span>
          </div> : null
      }

    </> : null

  )

}

export default CountrySelector
