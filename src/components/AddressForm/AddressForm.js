import React, { useEffect, useState } from 'react'
import Input from '../UI/Input/Input'
import Select from '../UI/Select/Select'
import CheckBox from '../UI/CheckBox/CheckBox'
import { useTranslation } from 'react-i18next'
import { firestore } from '../../firebase/config'
import { validateEmail } from '../Auth/utils/utils'
import ButtonSpinner from '../UI/ButtonSpinner/ButtonSpinner'

import styles from './AddressForm.module.scss'
import SignUpButton from '../UI/SignUpButton/SignUpButton'


const AddressForm = ({ type, lang, link, state, isError, handleSave, handleChange, handleCheckbox, isBillingAddress, handleChangeSelect }) => {

  let { t } = useTranslation()

  const [countries, setCountries] = useState(null)
  const [cities, setCities] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  // set is edit
  useEffect(() => {

    if (isBillingAddress) {
      setIsEdit(false)
    } else {
      setIsEdit(true)
    }

  }, [isBillingAddress])

  useEffect(() => {

    return firestore
      .collection('countriesList')
      .onSnapshot(snap => {
        let countries = []
        snap.forEach(country => {
          countries = [...countries, { id: country.id, ...country.data() }]
        })
        setCountries(countries)
      })

  }, [])

  useEffect(() => {

    if (state === undefined) return
    if (state.country.length === 0 || countries === null ) return

    const countryId = countries.filter(f => f.title.en === state.country.en)[0].id

    return firestore
      .collection(`countriesList/${countryId}/regions`)
      .onSnapshot(snap => {
        let cities = []
        snap.forEach(city => {
          cities = [...cities, { id: city.id, ...city.data() }]
        })
        setCities(cities)
      })

  }, [countries, state])

  const handleEdit = async () => {
    await handleSave()
      .then(r => {
        if (!r) return
        setIsEdit(!isEdit)
      })
  }


  return(

    countries !== null ?
      !isEdit ?
        <div className='col-12'>
          <div className={styles.AddressForm}>
            
              <div>
                { state.firstName } { state.lastName }
              </div>
              <div>
                { state.address }<br/>
                { state.city[lang] }, { state.zipcode }
              </div>
              <div>
                { state.country[lang] }
              </div>
              <div>
                <SignUpButton title={'Edit'} isSmall={true} onClick={handleEdit} disabled={false} />
              </div>
            
          </div>
        </div> :
        <>

          {/*{First Name}*/}
          <div id='firstName' className='col-md-6 col-12 mb-3'>
            <Input
              type={'text'}
              name={'firstName'}
              label={'First Name *'}
              value={state.firstName}
              handleChange={handleChange}
              error={isError && state.firstName.length === 0 && link === '#firstName'}
              text={isError && state.firstName.length === 0 && link === '#firstName' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{Last Name}*/}
          <div id='lastName' className='col-md-6 col-12 mb-3'>
            <Input
              type={'text'}
              name={'lastName'}
              label={'Last Name *'}
              value={state.lastName}
              handleChange={handleChange}
              error={isError && state.lastName.length === 0 && link === '#lastName'}
              text={isError && state.lastName.length === 0 && link === '#lastName' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{Email}*/}
          {
            type === 'delivery' ?
              <div id='email' className='col-12 mb-3'>
                <Input
                  type={'text'}
                  name={'email'}
                  label={t('email.label')}
                  value={state.email}
                  handleChange={handleChange}
                  error={
                    (!validateEmail(state.email) && state.email.length > 0) ||
                    (isError && state.email.length === 0 && link === '#email')
                  }
                  text={
                    !validateEmail(state.email) && state.email.length > 0 ?
                      t('enterValidEmail.label') :
                      isError && state.email.length === 0 && link === '#email' ?
                        t('thisIsaMandatoryField.label') : undefined
                  }
                />
              </div> : null
          }

          {/*{Checkbox}*/}
          {
            type === 'delivery' ?
              <div className='col-12'>
                <CheckBox
                  name={'isSubscribe'}
                  onClick={handleCheckbox}
                  isChecked={state.isSubscribe}
                  text={t('ourlist.label')}
                />
              </div> : null
          }

          {/*{Country/Region}*/}
          <div id='country' className='col-12 mb-3'>
            <Select
              lang={lang}
              name={'country'}
              options={countries}
              value={state.country}
              title={t('country.label')}
              handleChange={handleChangeSelect}
              error={isError && state.country.length === 0 && link === '#country'}
              text={isError && state.country.length === 0 && link === '#country' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{Address}*/}
          <div id='address' className='col-12 mb-3'>
            <Input
              type={'text'}
              name={'address'}
              label={t('enterAddress.label')}
              value={state.address}
              handleChange={handleChange}
              error={isError && state.address.length === 0 && link === '#address'}
              text={isError && state.address.length === 0 && link === '#address' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{City}*/}
          <div id='city' className='col-md-6 col-12 mb-3'>
            <Select
              lang={lang}
              name={'city'}
              options={cities}
              value={state.city}
              title={t('city.label')}
              handleChange={handleChangeSelect}
              error={isError && state.city.length === 0 && link === '#city'}
              text={isError && state.city.length === 0 && link === '#city' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{State}*/}
          <div id='state' className='col-md-6 col-12 mb-3'>
            <Input
              type={'text'}
              name={'state'}
              label={t('state.label')}
              value={state.state}
              handleChange={handleChange}
            />
          </div>

          {/*{Zipcode}*/}
          <div id='zipcode' className='col-md-6 col-12 mb-3'>
            <Input
              type={'text'}
              name={'zipcode'}
              label={t('zipcode.label')}
              value={state.zipcode}
              handleChange={handleChange}
            />
          </div>

          {/*{Phone}*/}
          <div id='phone' className='col-md-6 col-12 mb-3'>
            <Input
              type={'text'}
              name={'phone'}
              label={t('phone.label')}
              value={state.phone}
              handleChange={handleChange}
              error={isError && state.phone.length === 0 && link === '#phone'}
              text={isError && state.phone.length === 0 && link === '#phone' ? t('thisIsaMandatoryField.label') : undefined}
            />
          </div>

          {/*{Checkbox / Is Billing}*/}
          {
            type === 'delivery' ?
              <div className='col-12'>
                <CheckBox
                  onClick={handleCheckbox}
                  name={'isBillingAddress'}
                  text={t('badd.label')}
                  isChecked={state.isBillingAddress}
                />
              </div> : null
          }

          {
            // type === 'delivery' ? null :
            //   <div className='col-md-4 col-12'>
            //     <SignUpButton title={'Save'} isSmall={true} onClick={handleEdit} />
            //   </div>
          }

        </> :
      <div className='col-12'>
        <ButtonSpinner />
      </div>

  )

}

export default AddressForm