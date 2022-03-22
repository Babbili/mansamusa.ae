import React, { useContext } from 'react'
import { firestore } from '../../../../../../../firebase/config'
import AppContext from '../../../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
        <FontAwesomeIcon icon="times-circle" fixedWidth />
      </span>
    </div>

  )

}

export default CharacteristicCategoryItem
