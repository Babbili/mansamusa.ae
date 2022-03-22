import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../AppContext'
import Input from '../../../UI/Input/Input'
import Select from '../../../UI/Select/Select'
import TextArea from '../../../UI/TextArea/TextArea'
import DeliveryAddressForm from '../../../../containers/Checkout/Delivery/DeliveryAddressForm/DeliveryAddressForm'
import ImagePicker from '../../../ImagePicker/ImagePicker';


const CreateStoreStore = ({ uid, error, params, index, state, newStore, editStore, address, setAddress, setState, handleAddress, handleChange, handleStoreLogo, handleChangeSelector, handleInputChange, handleStepValidation }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isStoreNameError, setIsStoreNameError] = useState(false)
  useEffect(() => {
    if (newStore) {
      setCurrentIndex(prevState => prevState - 1)
    }
  }, [newStore])

  const [products, setProducts] = useState([])

  useEffect(() => {
    if (
      state.storeName.length > 0 && state.companyName.length > 0 &&
      state.companyPhone.length > 0 && typeof state.product !== 'string' &&
      state.customerAddress.length > 0 && !isStoreNameError &&
      state.floor.length > 0 && state.building.length > 0 && state.unit.length > 0
    ) {
      if (index === currentIndex) {
        handleStepValidation(currentIndex, true)
      }
    } else {
      if (index === currentIndex) {
        handleStepValidation(currentIndex, false)
      }
    }
  }, [state, index, currentIndex, isStoreNameError, handleStepValidation])

  useEffect(() => {

    return firestore.collection('productTypes')
    .where('isHidden', '==', false)
    .onSnapshot(snapshot => {
      let types = []
      snapshot.forEach(doc => {
        types.push({id: doc.id, ...doc.data()})
      })
      setProducts(types)
    })

  }, [])

  useEffect(() => {

    setIsStoreNameError(false)

    return firestore.collectionGroup('stores')
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        if (doc.data().storeName === state.storeName && !editStore) {
          setIsStoreNameError(true)
        }
      })
    })

  }, [editStore, state.storeName])
  
  const [hideSwitch, setHideSwitch] = useState(true)

  return(

    <div className='row' style={{display: currentIndex === index ? 'flex' : 'none'}}>

      <div className='col-12'>
        <h3
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          { t('sellerDetails.label') }
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
        { t('uploadStoreLogo.label') }
      </div>

      <div className='col-12'>

        <ImagePicker
          uid={uid}
          state={state}
          name={'storeLogo'}
          isMultiple={false}
          setState={setState}
        />

      </div>

      <div
        className='col-12 mb-3'
        style={{
          fontWeight: 700,
          marginBottom: 5,
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        {t('storeDescription.label')}
      </div>

      <div className='col-12'>
        <TextArea
          name={'storeDescriptionEn'}
          defaultValue={state.storeDescriptionEn}
          handleChange={handleChange}
          placeholder={'Provide information about your store which will be available on store page'}
          rows={4}
          hideSwitch={hideSwitch}
        />
      </div>

      <div className='col-12'>
        <TextArea
          name={'storeDescriptionAr'}
          defaultValue={state.storeDescriptionAr}
          handleChange={handleChange}
          placeholder={'قدم معلومات عن متجرك والتي ستكون متاحة في صفحة المتجر'}
          rows={4}
          dir={'rtl'}
          hideSwitch={hideSwitch}
        />
      </div>

      <div className='col-12'>
        <TextArea
          name={'storeDescriptionRu'}
          defaultValue={state.storeDescriptionRu}

          handleChange={handleChange}
          placeholder={'Предоставьте информацию о вашем магазине, которая будет доступна на странице магазина'}
          rows={4}
          hideSwitch={hideSwitch}
        />
      </div>

      <div className='col-12'>
        <TextArea
          name={'storeDescriptionTr'}
          defaultValue={state.storeDescriptionTr}
          handleChange={handleChange}
          placeholder={'TR Desc'}
          rows={4}
          hideSwitch={hideSwitch}
        />
      </div>


      {
        newStore ? null :
          <div className='col-12'>
            <Input
              name='email'
              type='text'
              label={ t('email.label') }
              value={state.email}
              handleChange={handleChange}
              disabled
            />
          </div>
      }

      <div className='col-12'>
        <Input
          name='storeName'
          type='text'
          label={ t('whatIsYourStoreName.label') }
          value={state.storeName}
          handleChange={handleChange}
          disabled={params.id ? 'disabled' : ''}
          error={isStoreNameError}
          text={isStoreNameError ? 'Store with given name is already exists. Choose another store name.' : ''}
        />
      </div>

      <div className='col-12'>
        <Input
          name='companyName'
          type='text'
          label={ t('companyLegalName.label') }
          value={state.companyName}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Input
          name='companyPhone'
          type='text'
          label={ t('companyPhoneNumber.label') }
          value={state.companyPhone}
          handleChange={handleChange}
        />
      </div>

      <div className='col-12'>
        <Select
          lang={lang}
          name={'product'}
          options={products}
          value={state.product}
          handleChange={handleChangeSelector}
          title={ t('whatKindOfProductsYouSell.label') }
        />
      </div>

      <div
        className='col-12 mb-3'
        style={{
          fontWeight: 700,
          marginBottom: 5,
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('enterYourFullAddress.label') }
      </div>

      <DeliveryAddressForm
        lang={lang}
        state={state}
        address={address}
        setAddress={setAddress}
        handleChange={handleChange}
        handleAddress={handleAddress}
        handleInputChange={handleInputChange}
      />
      
    </div>

  )

}

export default CreateStoreStore
