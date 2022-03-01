import React, { useContext, useState } from 'react'
import { firestore } from '../../../../../firebase/config'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddNewCharacteristicOption from './AddNewCharacteristicOption/AddNewCharacteristicOption'
import AddNewCharacteristicCategory from './AddNewCharacteristicCategory/AddNewCharacteristicCategory'

import styles from './AdminProductCharacteristicsItem.module.scss'
import Separator from "../../../../../components/UI/Separator/Separator";


const AdminProductCharacteristicsItem = ({ char, index, handleEdit }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const [state, setState] = useState({
    showOptions: false,
    showCategories: false
  })

  const handleRemoveOption = id => {
    firestore.collection('productCharacteristics')
    .doc(id).delete().then(() => {})
  }

  const handleViewOptions = () => {
    setState({
      ...state,
      showOptions: !state.showOptions
    })
  }

  const handleViewCategories = () => {
    setState({
      ...state,
      showCategories: !state.showCategories
    })
  }


  return(

    <div
      className={`${styles.AdminProductCharacteristicsItem} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >

      <div className={styles.wrapper}>

        <div className={styles.itemTitle}>

          <div className={styles.titleWrapper}>
            <div className={styles.left}>
              <h3>
                { char.title[lang] }
              </h3>
              <div className={styles.description}>
                { char.description[lang] }
              </div>
            </div>
            <div className={styles.right}>
              <span>
                <FontAwesomeIcon
                  icon="edit"
                  fixedWidth
                  onClick={() => handleEdit(char)}
                />
                <div style={{width: 5}} />

                <FontAwesomeIcon
                  icon="times-circle"
                  fixedWidth
                  onClick={() => handleRemoveOption(char.id)}
                />

              </span>
            </div>
          </div>

          <Separator color={'#ccc'} />

          <div className={styles.buttonsWrapper}>

            <div
              className={styles.options}
              onClick={() => handleViewOptions()}
            >
              Options
            </div>

            <div style={{width: '20px'}} />

            <div
              className={styles.categories}
              onClick={() => handleViewCategories()}
            >
              Categories
            </div>

          </div>

          {
            state.showOptions ?
              <AddNewCharacteristicOption
                item={char}
                handleCancel={handleViewOptions}
              /> : null
          }

          {
            state.showCategories ?
              <AddNewCharacteristicCategory
                item={char}
                handleCancel={handleViewCategories}
              /> : null
          }

        </div>

      </div>

    </div>

  )

}

export default AdminProductCharacteristicsItem
