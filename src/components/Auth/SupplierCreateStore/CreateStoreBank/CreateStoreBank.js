import React, { useContext, useEffect, useState } from 'react'
import firebase from '../../../../firebase/config'
import AppContext from '../../../AppContext'
import { useTranslation } from 'react-i18next'
import Input from '../../../UI/Input/Input'
import Select from '../../../UI/Select/Select'
import ImagePicker from '../../../ImagePicker/ImagePicker';


const CreateStoreBank = ({ uid, setState, index, state, newStore, handleChange, handleDocument, handleStepValidation }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(4)

  useEffect(() => {
    if (newStore) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }, [newStore])

  const [currencies, setCurrencies] = useState([
    {
      id : '1',
      title: 'GBP £'
    },
    {
      id : '2',
      title: 'RUB ₽'
    },
    {
      id : '3',
      title: 'AED'
    },
    {
      id : '4',
      title: 'EUR €'
    },
    {
      id : '5',
      title: 'USD $'
    }
  ])

  useEffect(() => {

    handleStepValidation(currentIndex, true)

    // if (
    //   state.beneficiaryName.length > 0 && state.bankName.length > 0 &&
    //   state.branchName.length > 0 && state.accountNumber.length > 0 &&
    //   state.iban.length > 0 && state.currency.length > 0 &&
    //   state.document.length > 0
    // ) {
    //   if (index === currentIndex) {
    //     handleStepValidation(currentIndex, true)
    //   }
    // } else {
    //   if (index === currentIndex) {
    //     handleStepValidation(currentIndex, false)
    //   }
    // }
  }, [index, currentIndex, handleStepValidation])

  // useEffect(() => {

  //   return firebase.firestore().collection('currencies')
  //   .onSnapshot(snapshot => {
  //     let types = []
  //     snapshot.forEach(doc => {
  //       types.push({id: doc.id, ...doc.data()})
  //     })
      
  //     setCurrencies(types)
  //   })
    
  // }, [])

  // console.log('state', state)

  return(

    <div className='row' style={{display: currentIndex === index ? 'flex' : 'none'}}>

      <div className='col-12'>
        <h3
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          { t('bankDetails.label') }
        </h3>
      </div>

      <div className='col-12'>
        <Input
          name='beneficiaryName'
          type='text'
          label={ t('beneficiaryName.label') }
          value={state.beneficiaryName}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Input
          name='bankName'
          type='text'
          label={ t('bankName.label') }
          value={state.bankName}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Input
          name='branchName'
          type='text'
          label={ t('branchName.label') }
          value={state.branchName}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Input
          name='accountNumber'
          type='text'
          label={ t('accountNumber.label') }
          value={state.accountNumber}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Input
          name='iban'
          type='text'
          label={ t('IBANNumber.label') }
          value={state.iban}
          handleChange={handleChange}
        />
      </div>

      
      <div className='col-12'>
        <Select
          lang={lang}
          name={'currency'}
          title={ t('currency.label') }
          options={currencies}
          value={state.currency}
          handleChange={handleChange}
        />
      </div>

      <div
        className='col-12'
        style={{
          fontWeight: 700,
          marginBottom: 5,
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('uploadEitherCertified.label') }
      </div>

      <div className='col-12'>

        <ImagePicker
          uid={uid}
          state={state}
          name={'document'}
          isMultiple={false}
          setState={setState}
        />

      </div>

    </div>

  )

}

export default CreateStoreBank
