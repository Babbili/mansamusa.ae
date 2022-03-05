import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import AppContext from '../../../../components/AppContext'
import AdminRegionItem from './AdminRegionItem/AdminRegionItem'
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => handleEditCountry(country)}><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
             
            <div style={{width: 5}} />
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => handleRemoveCountry(country.id)}><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>
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
          Add New Region <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM8 16V4h12l.002 12H8z"></path><path d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8zm11-2h-2v3h-3v2h3v3h2v-3h3V9h-3z"></path></svg>
        </div>

      </div>
    </div>

  )

}

export default AdminCountriesRegionsItem
