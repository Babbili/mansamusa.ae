import React, { useContext, useState } from 'react'
import { firestore } from '../../../../../firebase/config'
import AppContext from '../../../../../components/AppContext'
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  onClick={() => handleEdit(char)}><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
                <div style={{width: 5}} />
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => handleRemoveOption(char.id)}><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>

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
