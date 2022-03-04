import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../AppContext'
import CountrySelector from '../../../UI/CountrySelector/CountrySelector'


const CreateStoreCountry = ({ index, state, newStore, handleChangeSelector, handleStepValidation }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(1)

  useEffect(() => {
    if (newStore) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }, [newStore])

  useEffect(() => {

    if (typeof state.country !== 'string' && typeof state.region !== 'string') {
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
          { t('whereIsYourBusinessBased.label') }
        </h3>
      </div>

      <div className='col-12'>

        <CountrySelector
          state={state}
          handleChangeSelector={handleChangeSelector}
        />
        
      </div>

    </div>

  )

}

export default CreateStoreCountry
