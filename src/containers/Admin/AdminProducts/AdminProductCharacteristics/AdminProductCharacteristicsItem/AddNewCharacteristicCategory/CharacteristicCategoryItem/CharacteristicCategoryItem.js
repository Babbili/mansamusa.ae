import React, { useContext } from 'react'
import { firestore } from '../../../../../../../firebase/config'
import AppContext from '../../../../../../../components/AppContext'
import styles from './CharacteristicCategoryItem.module.scss'


const CharacteristicCategoryItem = ({ item, index, parentId, categories }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const removeOption = () => {

    let cats = categories.filter((f, i) => i !== index)

    firestore
    .collection('productCharacteristics')
    .doc(parentId)
    .update({
      inCategory: cats
    })
    .then(() => {})

  }

  return(

    <div className={`${styles.CharacteristicCategoryItem}`}>
      <div style={{width: '10px'}} />
      <span>
        { typeof item === 'object' ? item[lang] : item }
      </span>
      <span className={styles.icon} onClick={() => removeOption()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>
      </span>
    </div>

  )

}

export default CharacteristicCategoryItem
