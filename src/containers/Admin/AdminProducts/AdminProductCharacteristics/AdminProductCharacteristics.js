import React, { useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
// import AppContext from '../../../../components/AppContext'
import AdminProductCharacteristicsItem from './AdminProductCharacteristicsItem/AdminProductCharacteristicsItem'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import AddNewCharacteristic from './AddNewCharacteristic/AddNewCharacteristic'
// import { useTranslation } from 'react-i18next'

import styles from './AdminProductCharacteristics.module.scss'


const AdminProductCharacteristics = props => {

  // const context = useContext(AppContext)
  // let { lang } = context
  // let { t } = useTranslation()

  const [chars, setChars] = useState([])
  const [newItem, setNewItem] = useState(null)

  useEffect(() => {

    return firestore.collection('productCharacteristics')
    .onSnapshot(snapShot => {
      let chars = []
      snapShot.forEach(doc => {
        chars = [...chars, {id: doc.id, ...doc.data()}]
      })
      setChars(chars)
    })

  }, [])

  useEffect(() => {
    firestore.collection('productCharacteristics')
    .onSnapshot(snapShot => {
      snapShot.forEach(doc => console.log('doc.data', doc.data()))
    })
  })

  const handleNew = () => {
    setNewItem({
      title: {en: '', ar: ''},
      description: {en: '', ar: ''},
      isMultiple: false
    })
  }

  const handleChange = (event) => {
    const { value, name } = event.target

    let param = name.split('.')[0]
    let lang = name.split('.')[1]

    setNewItem({
      ...newItem,
      [param]: {
        ...newItem[param],
        [lang]: value
      }
    })
  }

  const handleCheck = (name, value) => {
    setNewItem({
      ...newItem,
      [name]: value
    })
  }

  const handleAdd = () => {
    firestore.collection('productCharacteristics')
    .add({
      ...newItem
    })
    .then(() => {
      setNewItem(null)
    })
  }

  const handleUpdate = id => {
    firestore.collection('productCharacteristics').doc(id)
    .update({
      ...newItem
    })
    .then(() => {
      setNewItem(null)
    })
  }

  const handleEdit = item => {
    setNewItem(item)
  }

  const handleCancel = () => {
    setNewItem(null)
  }


  return(

    <div className={styles.AdminProductCharacteristics}>

      {
        chars.length > 0 ?
          <div className='container-fluid'>

            <div className={`${styles.dashboard} row`}>

              {
                chars.map((char, index) => (
                  <AdminProductCharacteristicsItem
                    key={index}
                    char={char}
                    index={index}
                    handleEdit={handleEdit}
                  />
                ))
              }

            </div>

            {
              newItem !== null ?
                <AddNewCharacteristic
                  item={newItem}
                  handleAdd={handleAdd}
                  handleCheck={handleCheck}
                  handleCancel={handleCancel}
                  handleUpdate={handleUpdate}
                  handleChange={handleChange}
                /> : null
            }

            <div className='row'>
              <div className='col-lg-4 col-12'>
                <SignUpButton
                  type={'custom'}
                  title={'Add New'}
                  onClick={handleNew}
                  disabled={false}
                />
              </div>
            </div>

          </div> : <></>
      }

    </div>

  )

}

export default AdminProductCharacteristics
