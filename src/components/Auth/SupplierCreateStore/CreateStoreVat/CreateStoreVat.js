import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../AppContext'
import { useTranslation } from 'react-i18next'
import Input from '../../../UI/Input/Input'
import CheckBox from '../../../UI/CheckBox/CheckBox'
import ImagePicker from '../../../ImagePicker/ImagePicker';


const CreateStoreVat = ({ uid, setState, index, state, newStore, handleChange, handleCheck, handleStepValidation, handleTaxRegCertificate }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(5)

  useEffect(() => {
    if (newStore) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }, [newStore])

  useEffect(() => {

    if (
      (state.taxRegNumber.length > 0 && state.taxRegCertificate.length > 0) ||
      state.noVatReg
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
          { t('VATDetails.label') }
        </h3>
      </div>

      <div className='col-12'>
        <Input
          name='taxRegNumber'
          type='text'
          label={ t('taxRegistrationNumber.label') }
          value={state.taxRegNumber}
          handleChange={handleChange}
          disabled={state.noVatReg ? 'disabled' : ''}
        />
      </div>

      <div className='col-12' style={{fontWeight: 700, marginBottom: 5}}>
        { t('uploadTaxRegistration.label') }
      </div>

      <div className='col-12'>

        <ImagePicker
          uid={uid}
          state={state}
          name={'taxRegCertificate'}
          isMultiple={false}
          setState={setState}
        />

      </div>

      <div className='col-12'>
        <CheckBox
          name={'noVatReg'}
          text={ t('dontHaveVATRegistration.label') }
          onClick={handleCheck}
        />
      </div>

      <div
        className='col-12'
        style={{
          fontWeight: 500,
          margin: '0 5px 5px 7px',
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('acknowledgeAndAgree.label') }
      </div>

      <div className='col-12'>
        <CheckBox
          name={'agree'}
          text={ t('agree.label') }
          onClick={handleCheck}
        />
      </div>

    </div>

  )

}

export default CreateStoreVat
