import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../firebase/config'
import AppContext from '../../../components/AppContext'
import AdminCountriesRegionsItem from './AdminCountriesRegionsItem/AdminCountriesRegionsItem'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import AddNewCountry from './AddNewCountry/AddNewCountry'
// import { useTranslation } from 'react-i18next'

import styles from './AdminCountriesRegions.module.scss'


const AdminCountriesRegions = props => {

  const context = useContext(AppContext)
  let { lang } = context
  // let { t } = useTranslation()

  const [countries, setCountries] = useState([])
  const [newItem, setNewItem] = useState(null)

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

  const handleNewCountry = () => {
    setNewItem({
      title: {en: '', ar: ''},
      isCountry: true
    })
  }

  const handleChange = (event) => {
    const { value, name } = event.target
    setNewItem({
      ...newItem,
      title: {
        ...newItem.title,
        [name]: value
      }
    })
  }

  const handleAddCountry = () => {
    firestore.collection('countriesList')
    .add({
      title: newItem.title
    })
    .then(() => {
      setNewItem(null)
    })
  }

  const handleUpdateCountry = countryId => {
    firestore.collection('countriesList').doc(countryId)
    .update({
      title: newItem.title
    })
    .then(() => {
      setNewItem(null)
    })
  }

  const handleEditCountry = item => {
    setNewItem(item)
  }

  const handleCancel = () => {
    setNewItem(null)
  }


  return(

    <div className={styles.AdminCountriesRegions}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Countries and Regions
      </div>

      {
        countries.length > 0 ?
          <div className='container-fluid'>

            <div className={`${styles.dashboard} row`}>

              {
                countries.map((country, index) => (
                  <AdminCountriesRegionsItem
                    key={index}
                    country={country}
                    handleEditCountry={handleEditCountry} // +
                  />
                ))
              }

            </div>

            {
              newItem !== null ?
                <AddNewCountry
                  item={newItem}
                  handleCancel={handleCancel}
                  handleChange={handleChange}
                  handleAddCountry={handleAddCountry}
                  handleUpdateCountry={handleUpdateCountry}
                /> : null
            }

            <div className='row'>
              <div className='col-lg-4 col-12'>
                <SignUpButton
                  type={'custom'}
                  title={'Add New Country'}
                  onClick={handleNewCountry}
                  disabled={false}
                />
              </div>
            </div>

          </div> : <BasicSpinner />
      }

    </div>

  )

}

export default AdminCountriesRegions
