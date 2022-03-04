import React, { useContext } from 'react'
import { firestore } from '../../../../../../../firebase/config'
import AppContext from '../../../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './CharacteristicOptionItem.module.scss'


const CharacteristicOptionItem = ({ item, parentId, current, setNewOption, handleEditOption }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const removeOption = () => {
    firestore.collection('productCharacteristics')
    .doc(parentId).collection('options')
    .doc(item.id).delete()
    .then(() => {
      setNewOption({
        title: {en: '', ar: ''}
      })
    })
  }

  return(

    <div className={`${styles.CharacteristicOptionItem} ${current.id === item.id ? styles.active : ''}`}>
      <div style={{width: '10px'}} />
      <span onClick={() => handleEditOption(item)}>
        { typeof item.title === 'object' ? item.title[lang] : item.title }
      </span>
      <span className={styles.icon} onClick={() => removeOption()}>
        <FontAwesomeIcon icon="times-circle" fixedWidth />
      </span>
    </div>

  )

}

export default CharacteristicOptionItem
