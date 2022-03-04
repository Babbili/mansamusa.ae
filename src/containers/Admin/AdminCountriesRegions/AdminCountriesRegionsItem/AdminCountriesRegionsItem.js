import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import AppContext from '../../../../components/AppContext'
import AdminRegionItem from './AdminRegionItem/AdminRegionItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddNewRegion from "../AddNewRegion/AddNewRegion";

import styles from './AdminCountriesRegionsItem.module.scss'


const AdminCountriesRegionsItem = ({ country, handleEditCountry }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const [regions, setRegions] = useState([])
  const [newRegion, setNewRegion] = useState(null)

  useEffect(() => {
    return firestore.collection('countriesList')
    .doc(country.id).collection('regions')
    .onSnapshot(snapshot => {
      let regions = []
      snapshot.forEach(doc => {
        regions = [...regions, {id: doc.id, ...doc.data()}]
      })
      setRegions(regions)
    })
  }, [country.id])

  const handleChange = (event) => {
    const { value, name } = event.target
    setNewRegion({
      ...newRegion,
      title: {
        ...newRegion.title,
        [name]: value
      }
    })
  }

  const handleNewRegion = () => {
    setNewRegion({
      title: {en: '', ar: ''}
    })
  }

  const handleAddRegion = countryId => {
    firestore.collection('countriesList')
    .doc(countryId).collection('regions')
    .add({
      title: newRegion.title
    })
    .then(() => {
      setNewRegion(null)
    })
  }

  const handleUpdateRegion = (countryId, regionId) => {
    firestore.collection('countriesList')
    .doc(countryId).collection('regions')
    .doc(regionId)
    .update({
      title: newRegion.title
    })
    .then(() => {
      setNewRegion(null)
    })
  }

  const handleEditRegion = item => {
    setNewRegion(item)
  }

  const handleRemoveCountry = id => {
    firestore.collection('countriesList')
    .doc(id).delete().then(() => {})
  }

  const handleCancel = () => {
    setNewRegion(null)
  }


  return(

    <div
      className={`${styles.AdminCountriesRegionsItem} col-lg-4 col-12 mb-4`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <div className={styles.wrapper}>

        <div className={styles.itemTitle}>
          { country.title[lang] }
          <span>
            <FontAwesomeIcon
              icon="edit"
              fixedWidth
              onClick={() => handleEditCountry(country)}
            />
            <div style={{width: 5}} />
            <FontAwesomeIcon
              icon="times-circle"
              fixedWidth
              onClick={() => handleRemoveCountry(country.id)}
            />
          </span>
        </div>

        <div className={styles.description}>
          {
            regions.length > 0 ?
              'List of Regions:' : 'No Regions Yet'
          }
        </div>

        {
          regions.length > 0 ?
            <div className={styles.total}>
              {
                regions.map((item, index) => (
                  <AdminRegionItem
                    key={index}
                    item={item}
                    countryId={country.id}
                    handleEditRegion={handleEditRegion}
                  />
                ))
              }
            </div> : null
        }

        {
          newRegion !== null ?
            <AddNewRegion
              item={newRegion}
              country={country}
              handleChange={handleChange}
              handleCancel={handleCancel}
              handleAddRegion={handleAddRegion}
              handleUpdateRegion={handleUpdateRegion}
            /> : null
        }

        <div
          className={styles.addNewRegion}
          onClick={() => handleNewRegion()}
        >
          Add New Region <FontAwesomeIcon icon="plus-circle" fixedWidth />
        </div>

      </div>
    </div>

  )

}

export default AdminCountriesRegionsItem
