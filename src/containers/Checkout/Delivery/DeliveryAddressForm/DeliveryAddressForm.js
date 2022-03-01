import React from 'react'
import Radio from '../../../../components/UI/Radio/Radio'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Input from '../../../../components/UI/Input/Input'
import { useTranslation } from 'react-i18next'

import styles from '../Delivery.module.scss'


const DeliveryAddressForm = ({ lang, state, address, setAddress, isError, link, handleAddress, handleChange, handleInputChange }) => {

  let { t } = useTranslation()

  return(

    <>

      <div className='col-12 mb-3'>
        <div className={styles.description}>
          {t('buildingType.label')}
        </div>
      </div>

      <div className='col-12 d-lg-flex d-block mb-3'>
        {
          state.typeId.map((type, index) => {
            return(
              <Radio
                key={index}
                index={index}
                title={type.radioName[lang]}
                selected={type.selected}
                handleInputChange={handleInputChange}
              />
            )
          })
        }
      </div>

      <div id='address' className='col-12'>
        <GooglePlacesAutocomplete
          
          selectProps={{
            placeholder: `${t('enterAddress.label')}`,
            value: address,
            onChange: handleAddress !== undefined ? handleAddress : setAddress,
            styles: {
              placeholder: (provided) => ({
                ...provided,
                color: '#999',
                height: '50px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center'
              }),
              input: (provided) => ({
                ...provided,
                color: '#000',
                height: '50px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400'
              }),
              option: (provided) => ({
                ...provided,
                color: '#000',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400'
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#000',
                height: '50px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                fontWeight: '400'
              }),
              container: (provided) => ({
                ...provided,
                marginBottom: '15px',
                borderColor: 'red'
              }),
              control: (provided) => ({
                ...provided,
                borderColor: isError && state.customerAddress.length === 0 && link === '#address' ? 'red' : '#cccccc'
              })
            }
          }}
          autocompletionRequest={{
            bounds: [
              { lat: 50, lng: 50 },
              { lat: 100, lng: 100 }
            ],
            componentRestrictions: {
              country: ['ae', 'ru'],
            }
          }}
        />
        {
          isError && state.customerAddress.length === 0 && link === '#address' ?
            <div className={styles.phoneError} style={{textAlign: 'left'}}>
              { t('thisIsaMandatoryField.label') }
            </div> : null
        }
      </div>

      <div id='building' className='col-lg-4 col-12'>
        <Input
          name='building'
          type='text'
          label={t('buildingN.label')}
          value={state.building}
          handleChange={handleChange}
          error={isError && state.building.length === 0 && link === '#building'}
          text={isError && state.building.length === 0 && link === '#building' ? t('thisIsaMandatoryField.label') : undefined}
        />
      </div>

      <div id='floor' className='col-lg-4 col-12'>
        <Input
          name='floor'
          type='text'
          label={t('floorN.label')}
          value={state.floor}
          handleChange={handleChange}
          error={isError && state.floor.length === 0 && link === '#floor'}
          text={isError && state.floor.length === 0 && link === '#floor' ? t('thisIsaMandatoryField.label') : undefined}
        />
      </div>

      <div id='unit' className='col-lg-4 col-12'>
        <Input
          name='unit'
          type='text'
          label={t('unitN.label')}
          value={state.unit}
          handleChange={handleChange}
          error={isError && state.unit.length === 0 && link === '#unit'}
          text={isError && state.unit.length === 0 && link === '#unit' ? t('thisIsaMandatoryField.label') : undefined}
        />
      </div>

    </>

  )

}

export default DeliveryAddressForm
