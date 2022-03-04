import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../AppContext'
import { useTranslation } from 'react-i18next'
import CheckBox from '../../../UI/CheckBox/CheckBox'
import Separator from '../../../UI/Separator/Separator'
import ImagePicker from '../../../ImagePicker/ImagePicker';


const CreateStoreDocument = ({ uid, setState, index, state, newStore, handleTradeLicense, handleNationalId, handleCheck, handleStepValidation }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(3)

  useEffect(() => {
    if (newStore) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }, [newStore])

  useEffect(() => {

    if (
      (state.tradeLicense.length > 0 && state.nationalId.length > 0) ||
      (state.tradeLicense.length === 0 && state.noTradeLicense && state.nationalId.length > 0)
    ) {
      if (index === currentIndex) {
        handleStepValidation(currentIndex, true)
      }
    } else {
      if (index === currentIndex) {
        handleStepValidation(currentIndex, false)
      }
    }
  }, [state, index, currentIndex, handleStepValidation])

  return(

    <div className='row' style={{display: currentIndex === index ? 'flex' : 'none'}}>

      <div className='col-12'>
        <h3
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          { t('documentVerification.label') }
        </h3>
      </div>

      <div
        className='col-12'
        style={{
          fontWeight: 700,
          marginBottom: 5,
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('uploadTradeLicense.label') }
      </div>

      <div className='col-12'>

        <ImagePicker
          uid={uid}
          state={state}
          name={'tradeLicense'}
          isMultiple={false}
          setState={setState}
        />

      </div>

      <div className='col-12'>
        <CheckBox
          name={'noTradeLicense'}
          text={ t('dontHaveTradeLicense.label') }
          onClick={handleCheck}
        />
      </div>

      <div className='col-12'>
        <Separator color={'#ddd'}/>
      </div>

      <div
        className='col-12'
        style={{
          fontWeight: 700,
          marginBottom: 5,
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('uploadNationalID.label') }
      </div>

      <div className='col-12'>

        <ImagePicker
          uid={uid}
          state={state}
          name={'nationalId'}
          isMultiple={false}
          setState={setState}
        />

      </div>

    </div>

  )

}

export default CreateStoreDocument
