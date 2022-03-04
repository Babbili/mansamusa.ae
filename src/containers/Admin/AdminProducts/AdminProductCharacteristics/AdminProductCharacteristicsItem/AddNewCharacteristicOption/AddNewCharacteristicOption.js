import React, { useEffect, useState } from 'react'
import { firestore } from '../../../../../../firebase/config'
import Input from '../../../../../../components/UI/Input/Input'
import SignUpButton from '../../../../../../components/UI/SignUpButton/SignUpButton'
import CharacteristicOptionItem from './CharacteristicOptionItem/CharacteristicOptionItem'
import Separator from '../../../../../../components/UI/Separator/Separator'

import styles from './AddNewCharacteristicOption.module.scss'


const AddNewCharacteristicOption = ({ item, handleCancel }) => {

  const [options, setOptions] = useState([])
  const [newOption, setNewOption] = useState({
    title: {en: '', ar: ''}
  })

  useEffect(() => {

    return firestore.collection('productCharacteristics')
    .doc(item.id).collection('options')
    .onSnapshot(snapshot => {
      let options = []
      snapshot.forEach(doc => {
        options = [...options, {id: doc.id, ...doc.data()}]
      })
      setOptions(options)
    })

  }, [item])

  const handleAddOption = () => {

    let addOption = firestore.collection('productCharacteristics')
    .doc(item.id).collection('options')

    if (newOption.title.ar.length === 0) {
      addOption.add({
        title: newOption.title.en
      })
      .then(() => {
        setNewOption({
          title: {en: '', ar: ''}
        })
      })
    } else {
      addOption.add({
        ...newOption
      })
      .then(() => {
        setNewOption({
          title: {en: '', ar: ''}
        })
      })
    }

  }

  const handleChange = (event) => {
    const { value, name } = event.target

    let param = name.split('.')[0]
    let lang = name.split('.')[1]

    setNewOption({
      ...newOption,
      [param]: {
        ...newOption[param],
        [lang]: value
      }
    })
  }

  const handleEditOption = option => {

    if (option.id === newOption.id) {

      setNewOption({
        title: {en: '', ar: ''}
      })

    } else {

      if (typeof option.title === 'object') {

        setNewOption({
          id: option.id,
          title: {
            en: option.title.en,
            ar: option.title.ar
          },
          edit: true
        })

      } else {

        setNewOption({
          id: option.id,
          title: {
            en: option.title,
            ar: ''
          },
          edit: true
        })

      }

    }

  }

  const handleUpdateOption = () => {

    let updateOption = firestore.collection('productCharacteristics')
    .doc(item.id).collection('options')
    .doc(newOption.id)

    if (newOption.title.ar.length === 0) {
      updateOption.set({
        title: newOption.title.en
      })
      .then(() => {
        setNewOption({
          title: {en: '', ar: ''}
        })
      })
    } else {
      updateOption.set({
        ...newOption
      })
      .then(() => {
        setNewOption({
          title: {en: '', ar: ''}
        })
      })
    }

  }


  return(

    <div className={styles.AddNewCharacteristicOption}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>The list of the options</h3>
            <div className={styles.subTitle}>
              {
                options.length > 0 ?
                  'The list of all available options. Click on any option to edit or cross\n' +
                  'icon to remove the option from the list.' :
                  'No options yet. Please, add it below.'
              }
            </div>
          </div>
        </div>

        {
          options.length > 0 ?
            <div className='row'>
              <div className={`${styles.optionsList} col-12`}>
                {
                  options.map((option, index) => (
                    <CharacteristicOptionItem
                      key={index}
                      item={option}
                      parentId={item.id}
                      current={newOption}
                      setNewOption={setNewOption}
                      handleEditOption={handleEditOption}
                    />
                  ))
                }
              </div>
            </div> : null
        }

        <Separator color={'#ccc'} />

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h5>
              {
                newOption.edit ?
                  'Update an option' : 'Add a new option'
              }
            </h5>
            <div className={styles.subTitle}>
              It is possible to add only option in English if it has no right translation
              in other languages.
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-6 col-12'>
            <Input
              name={'title.en'}
              type={'text'}
              value={newOption.title.en}
              label={'Option Name in English'}
              handleChange={handleChange}
            />
          </div>
          <div className='col-lg-6 col-12'>
            <Input
              name={'title.ar'}
              type={'text'}
              value={newOption.title.ar}
              label={'Option Name in Arabic'}
              handleChange={handleChange}
              dir={'rtl'}
            />
          </div>
        </div>

        <div className='row justify-content-center mt-4'>

          <div className={`${newOption.title.en.length > 0 ? 'col-lg-6' : 'col-12'}`}>
            <SignUpButton
              type={'custom'}
              title={'Cancel'}
              onClick={handleCancel}
              disabled={false}
            />
          </div>

          {
            newOption.title.en.length > 0 ?
              <div className='col-lg-6 col-12'>
                {
                  <SignUpButton
                    type={'custom'}
                    title={newOption.edit ? 'Update' : 'Add'}
                    onClick={() => {
                      newOption.edit ?
                        handleUpdateOption() :
                        handleAddOption()
                    }}
                    disabled={false}
                  />
                }
              </div> : null
          }

        </div>

      </div>

    </div>

  )

}

export default AddNewCharacteristicOption
