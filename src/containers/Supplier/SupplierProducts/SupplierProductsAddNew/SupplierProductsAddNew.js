import React, { useContext, useEffect, useState, useRef } from 'react'
import AppContext from '../../../../components/AppContext'
import { firestore } from '../../../../firebase/config'
import CategoriesSelector from './CategoriesSelector/CategoriesSelector'
import Input from '../../../../components/UI/Input/Input'
import CheckBox from '../../../../components/UI/CheckBox/CheckBox'
import TextEditor from '../../../../components/UI/TextEditor/TextEditor'
import TextArea from '../../../../components/UI/TextArea/TextArea'
import Separator from '../../../../components/UI/Separator/Separator'
import Radio from '../../../../components/UI/Radio/Radio'
import Select from '../../../../components/UI/Select/Select'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import ProductCharacteristics from './ProductCharacteristics/ProductCharacteristics'
import moment from 'moment'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { useTranslation } from 'react-i18next'
import { scrollToTop } from '../../../../utils/utils'

import styles from './SupplierProductsAddNew.module.scss'
import ImagePicker from '../../../../components/ImagePicker/ImagePicker'
import { moveFirebaseFile } from '../../../../components/ImagePicker/FileLoader/utils'


const SupplierProductsAddNew = ({ currentStore, ...props }) => {

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  let { t } = useTranslation()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [state, setState] = useState({
    store: '',
    storeName: '',
    createdAt: moment().unix(),
    productName: '',
    productNameAr: '',
    productNameRu: '',
    productNameTr: '',
    productPrice: '',
    productMpn: '',
    productHScode: '',
    productWidth: '',
    productHeight: '',
    productLength: '',
    productWeight: '',
    collectedAmount: '',
    isDiscount: false,
    isApproved: false,
    discount: '',
    discountPrice: '',
    productImages: [],
    productDescription: '',
    productDescriptionAr: '',
    productDescriptionRu: '',
    productDescriptionTr: '',
    productType: [
      {
        radioName: {
          en: 'Handmade',
          ar: 'صنع يدوي',
          ru: 'Ручная работа',
          tr: 'El yapımı'
        },
        selected: true
      },
      {
        radioName: {
          en: 'Factory made',
          ar: 'صنع مصنعي',
          ru: 'Промышленное производство',
          tr: 'Fabrika yapımı'
        },
        selected: false
      }
    ],
    productQuantity: '',
    status: '',
    statusOptions: [
      {
        id: 'active',
        title: {
          en: 'Active',
          ar: 'نشيط',
          ru: 'Действующий',
          tr: 'Aktif'
        }
      },
      {
        id: 'inactive',
        title: {
          en: 'Inactive',
          ar: 'غير نشط',
          ru: 'Недействующий',
          tr: 'etkin değil'
        }
      }
    ],
    categoryPicker: {
      category: 'Fashion',
      categoryOptions: [],
      categorySelectors: ['category'],
      path: '',
      productCategories: [],
      isComplete: false
    },
    characteristics: [],
    offers: []
  })
  const [isError, setIsError] = useState(false)
  const [link, setLink] = useState('')

  // const [productImages, setProductImages] = useState([])

  const productName = useRef(null)
  const productPrice = useRef(null)
  const productImagesRef = useRef(null)
  const productQuantity = useRef(null)
  const statusRef = useRef(null)
  const categoryPicker = useRef(null)
  const productOffers = useRef(null)

  useEffect(() => {

    firestore
    .collection('productTypes')
    .where('title.en', '==', currentStore.product.en)
    .onSnapshot(snapShot => {

      let options = []
      snapShot.forEach(doc => {
        options = [...options, {id: doc.id, ...doc.data()}]
      })

      setState((prevState) => {
        return {
          ...prevState,
          store: currentStore.id,
          storeName: currentStore.storeName,
          categoryPicker: {
            category: '',
            categoryOptions: options,
            categorySelectors: ['category'],
            path: '',
            productCategories: [],
            isComplete: false
          }
        }
      })

    })

    setTimeout(() => {
      setIsLoaded(true)
    }, 500)

  }, [currentStore])

  useEffect(() => {

    let { isComplete, productCategories } = state.categoryPicker

    if (isComplete) {

      let category = productCategories[productCategories.length - 1].en.toString()

      return firestore
      .collection('productCharacteristics')
      .where('inCategory', 'array-contains', category)
      .onSnapshot(snapShot => {

        let characteristics = []
        snapShot.forEach(doc => {

          firestore
          .collection(`productCharacteristics/${doc.id}/options`)
          .orderBy('title', 'asc')
          .onSnapshot(snapshot => {

            let options = []
            snapshot.forEach(doc => {
              options = [...options, {id: doc.id, ...doc.data()}]
            })

            characteristics = [...characteristics, {
              title: doc.data().title,
              options: options,
              isMultiple: doc.data().isMultiple,
              items: [
                {
                  id: '',
                  value: '',
                  quantity: '',
                  prefix: '',
                  prefixOptions: [
                    {
                      id: 'minus',
                      title: '-'
                    },
                    {
                      id: 'plus',
                      title: '+'
                    }
                  ],
                  price: ''
                }
              ]
            }]

            setState((prevState) => {
              return {
                ...prevState,
                characteristics
              }
            })

          })

        })

      })

    }

  }, [state.categoryPicker, state.offers])

  useEffect(() => {

    const getQuantity = array => array.map(el => {

      if (el.quantity === undefined) {
        Object.values(el).map(m => Array.isArray(m) ? getQuantity(m) : null)
      } else {
        setState(prevState => {
          return {
            ...prevState,
            productQuantity: prevState.productQuantity + Number(el.quantity)
          }
        })
      }

      return null

    })

    if (state.offers.length > 0) {
      setState(prevState => {
        return {
          ...prevState,
          productQuantity: 0
        }
      })
      getQuantity(state.offers)
    } else {
      setState(prevState => {
        return {
          ...prevState,
          productQuantity: ''
        }
      })
    }

  }, [state.offers])

  const handleChange = event => {

    const { value, name } = event.target

    if (name === 'productPrice') {
      let amount = Number(value - (value * 13 / 100)).toFixed(2)
      setState({
        ...state,
        productPrice: Number(value),
        collectedAmount: value.length > 0 ? amount : ''
      })
    } else if (name === 'discount') {
      let amount = Number(state.productPrice - (state.productPrice * value / 100)).toFixed(2)
      let oldPrice = Number(state.productPrice - (state.productPrice * 13 / 100)).toFixed(2)
      let oldDiscountPrice = Number(amount - (amount * 13 / 100)).toFixed(2)
      setState({
        ...state,
        discount: Number(value),
        discountPrice: value.length > 0 ? amount : '',
        collectedAmount: value.length > 0 ? oldDiscountPrice : oldPrice
      })
    } else if (name === 'status') {

      setState({
        ...state,
        [name]: typeof JSON.parse(value) === 'object' ? JSON.parse(value) : value
      })

    } else {
      setState({
        ...state,
        [name]: value
      })
    }
  }

  const handleCheck = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeSelect = event => {

    const { name } = event.target
    const id = event.target.children[event.target.selectedIndex].id
    const path = `${state.categoryPicker.path}/${id}/subCategories`

    const option = Object.values(state.categoryPicker)
    .filter(m => Array.isArray(m) && m.some(s => s.id === id)).flat(1)
    .filter(f => f.id === id).map(m => m.title)[0]

    firestore
    .collection(`productTypes${path}`)
    .onSnapshot(snapShot => {

      let subCollection = []
      let productCategories = state.categoryPicker.productCategories

      snapShot.forEach(doc => {
        subCollection = [...subCollection, {id: doc.id, ...doc.data()}]
      })

      setState({
        ...state,
        categoryPicker: {
          ...state.categoryPicker,
          [name]: option,
          [`${option.en}Options`]: subCollection,
          categorySelectors: subCollection.length > 0 ?
            [...state.categoryPicker.categorySelectors, option.en] :
            state.categoryPicker.categorySelectors,
          path: `${state.categoryPicker.path}/${id}/subCategories`,
          productCategories: [...productCategories, option],
          // productCategories: [...productCategories, option.en],
          productCats: {...state.categoryPicker.productCats, ...{[option.en]: true}},
          isComplete: subCollection.length === 0
        }
      })

    })

  }

  const handleClear = () => {
    setState({
      ...state,
      categoryPicker: {
        category: '',
        categoryOptions: state.categoryPicker.categoryOptions,
        categorySelectors: ['category'],
        path: '',
        productCategories: [],
        productCharacteristics: []
      }
    })
  }

  const handleEditorEnglish = (event) => {
    setState({
      ...state,
      productDescription : event.target.value
    })
  }

  const handleEditorArabic = (event) => {
    setState({
      ...state,
      productDescriptionAr: event.target.value
    })
  }

  const handleEditorRussian = (event) => {
    setState({
      ...state,
      productDescriptionRu: event.target.value
    })
  }

  const handleEditorTurkish = (event) => {
    setState({
      ...state,
      productDescriptionTr: event.target.value
    })
  }

  const handleChangeMpn = (event) => {
    setState({
      ...state,
      productMpn: event.target.value
    })
  }
  const handleChangeHScode = ( event ) => {
    setState({
      ...state,
      productHScode: event.target.value
    })
  }
  const handleChangeWeight = (event) => {
    setState({
      ...state,
      productWeight : event.target.value
    })
  }
  const handleChangeWidth = (event) => {
    setState({
      ...state,
      productWidth : event.target.value
    })
  }
  const handleChangeHeight = (event) => {
    setState({
      ...state,
      productHeight : event.target.value
    })
  }
  const handleChangeLength = (event) => {
    setState({
      ...state,
      productLength : event.target.value
    })
  }

  const handleInputChange = ({ target }) => {

    const productType = state.productType.map(type => {

      if (type.radioName[lang] !== target.name) {
        return {
          ...type,
          selected: false
        }
      } else {
        return {
          ...type,
          selected: true
        }
      }

    })

    setState({
      ...state,
      productType
    })
  }

  const handleOffer = (offer, index) => {

    if (index !== undefined) {
      let offers = state.offers.filter((f, i) => i !== index)
      setState({
        ...state,
        offers: [...offers, offer]
      })
    } else {
      setState({
        ...state,
        offers: [...state.offers, offer]
      })
    }

  }

  const handleRemoveOffer = index => {
    setState({
      ...state,
      offers: state.offers.filter((f, i) => i !== index)
    })
  }

  const handleSend = async () => {

    if (validate(state)) {

      setIsSubmit(!isSubmit)


      // prepare images

      let updatedFiles = []
      let updatedOffers = []

      for (const file of state.productImages) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${currentUser.uid}/productImages/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        updatedFiles = [...updatedFiles, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }

      if (state.offers.length > 0) {

        for (const offer of state.offers) {

          let images = []

          for (const image of offer.images) {

            let oldRef = `tmp/${image.source}`
            let newRef = `images/${currentUser.uid}/productImages/${image.source}`
            let url = await moveFirebaseFile(oldRef, newRef)
            images = [...images, {
              ...image,
              url,
              options: {
                type: 'local'
              }
            }]

          }

          updatedOffers = [...updatedOffers, {
            ...offer,
            images: images
          }]

        }

      }

      // prepare images


      firestore.collection('products')
      .add({
        ...state,
        offers: updatedOffers,
        productName: {
          en: state.productName,
          ar: state.productNameAr,
          ru: state.productNameRu,
          tr: state.productNameTr
        },
        productDescription: {
          en: state.productDescription,
          ar: state.productDescriptionAr,
          ru: state.productDescriptionRu,
          tr: state.productDescriptionTr
        },
        productMpn: state.productMpn,
        productHScode: state.productHScode,
        productImages: updatedFiles
      })
      .then(() => {
        setIsSubmit(!isSubmit)
        props.history.push({
          pathname: '/supplier/products/view-products',
          params: {
            title: 'My Products'
          }
        })
      })
      .catch((error) => {
        console.log('some err', error)
      })

    } else {
      setIsError(true)
      setTimeout(() => {
        setIsError(false)
      }, 1500)
    }

  }

  useEffect(() => {

    if (state.productName.length > 2) {

      if (state.productPrice > 0) {

        if (state.productImages.length > 0) {

          if (state.productQuantity > 0) {

            if (typeof state.status === 'object') {

              if (state.categoryPicker.isComplete) {

                if (state.characteristics.length > 0) {

                  if (state.offers.length > 0) {

                    setLink('')

                  } else {

                    setLink('#productOffers')

                  }

                } else {

                  setLink('')

                }

              } else {
                setLink('#categoryPicker')
              }

            } else {
              setLink('#status')
            }

          } else {

            if (state.characteristics.length > 0) {
              setLink('#productOffers')
            } else {
              setLink('#productQuantity')
            }

          }

        } else {
          setLink('#productImages')
        }

      } else {
        setLink('#productPrice')
      }

    } else {
      setLink('#productName')
    }

  }, [state])

  const validate = (state) => {

    if (state.productName.length > 2) {

      if (state.productPrice > 0) {

        if (state.productImages.length > 0) {

          if (state.productQuantity > 0) {

            if (typeof state.status === 'object') {

              if (state.categoryPicker.isComplete) {

                if (state.characteristics.length > 0) {

                  if (state.offers.length > 0) {
                    return true
                  } else {
                    scrollToTop(productOffers.current.offsetTop, 'smooth')
                    return false
                  }

                } else {

                  return true

                }

              } else {
                scrollToTop(categoryPicker.current.offsetTop, 'smooth')
                return false
              }

            } else {
              scrollToTop(statusRef.current.offsetTop, 'smooth')
              return false
            }

          } else {

            if (state.characteristics.length > 0) {
              scrollToTop(productOffers.current.offsetTop, 'smooth')
              return false
            } else {
              scrollToTop(productQuantity.current.offsetTop, 'smooth')
              return false
            }

          }

        } else {
          scrollToTop(productImagesRef.current.offsetTop, 'smooth')
          return false
        }

      } else {
        scrollToTop(productPrice.current.offsetTop, 'smooth')
        return false
      }

    } else {
      scrollToTop(productName.current.offsetTop, 'smooth')
      return false
    }

  }


  return(

    <div className={`${styles.SupplierProductsAddNew} container-fluid`}>

      {
        isLoaded ?
          isSubmit ?
            <div className='row min-vh-100'>
              <div className='col-12'>
                <BasicSpinner />
              </div>
            </div> :
            <div className='row min-vh-100'>
              <div className='col-lg-9 col-12 order-lg-0 order-1'>

                <div className='row mt-3'>
                  <div ref={productImagesRef} id='productImages' className='col-12 mb-3'>

                    <ImagePicker
                      state={state}
                      isMultiple={true}
                      setState={setState}
                      name={'productImages'}
                      uid={currentUser.uid}
                    />

                  </div>
                </div>

                <div className='row'>
                  <div ref={productName} id='productName' className='col-lg-6 col-12'>
                    <Input
                      name='productName'
                      type='text'
                      label={t('productNameEn.label')}
                      value={state.productName}
                      handleChange={handleChange}
                      error={isError && state.productName.length === 0 && link === '#productName'}
                      text={isError && state.productName.length === 0 && link === '#productName' ? t('thisIsaMandatoryField.label') : undefined}
                    />
                  </div>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name='productNameAr'
                      type='text'
                      label={t('productNameAr.label')}
                      value={state.productNameAr}
                      handleChange={handleChange}
                      dir="rtl"
                      lang="ar"
                    />
                  </div>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name='productNameRu'
                      type='text'
                      label={t('productNameRu.label')}
                      value={state.productNameRu}
                      handleChange={handleChange}
                      lang="ru"
                    />
                  </div>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name='productNameTr'
                      type='text'
                      label={t('productNameTr.label')}
                      value={state.productNameTr}
                      handleChange={handleChange}
                      lang="tr"
                    />
                  </div>
                </div>

                <div className={styles.mpn}>
                  <Input 
                  name='MPN'
                  type='string'
                  label={t('yourMpn.label')}
                  value={state.productMpn}
                  handleChange={handleChangeMpn}
                  />
                  <p>{t('mpn.label')}</p><p>{t('mpnUsed.label')}</p><p>{t('ifMpn.label')}</p><p>{t('mpnFormat.label')}</p>
                </div>

                <div className={styles.mpn}>
                  <Input 
                  name='HS code'
                  type='number'
                  label={t('HScode.label')}
                  value={state.productHScode}
                  handleChange={handleChangeHScode}
                  />
                  <p>{t('HScodeDescription.label')}</p>
                </div>

                <div className='row'>
                  <div ref={productPrice} id='productPrice' className='col-lg-6 col-12'>
                    <Input
                      name='productPrice'
                      type='number'
                      label={ t('productPrice.label') }
                      value={state.productPrice}
                      handleChange={handleChange}
                      currency={'AED'}
                      error={isError && state.productPrice.length === 0 && link === '#productPrice'}
                      text={isError && state.productPrice.length === 0 && link === '#productPrice' ? t('thisIsaMandatoryField.label') : undefined}
                    />
                  </div>
                  <div className='col-lg-6 col-12'>
                    <Input
                      name='collectedAmount'
                      type='number'
                      label={ t('collectedAmount.label') }
                      value={state.collectedAmount}
                      handleChange={handleChange}
                      currency={'AED'}
                      text={ t('taskCharges.label') }
                      disabled={true}
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <CheckBox
                      name={'isDiscount'}
                      text={ t('someDiscount.label') }
                      onClick={handleCheck}
                      isChecked={state.isDiscount}
                    />
                  </div>
                </div>

                {
                  state.isDiscount ?
                    <div className='row'>
                      <div className='col-lg-6 col-12'>
                        <Input
                          name='discount'
                          type='number'
                          label={ t('discount.label') }
                          value={state.discount}
                          handleChange={handleChange}
                          currency={'%'}
                        />
                      </div>
                      <div className='col-lg-6 col-12'>
                        <Input
                          name='discountPrice'
                          type='number'
                          label={ t('priceAfterDiscount.label') }
                          value={state.discountPrice}
                          handleChange={handleChange}
                          currency={'AED'}
                          disabled={true}
                        />
                      </div>
                    </div> : null
                }

                <h4>{t('shippingCalc.label')}</h4>
                <div className={styles.shipping}>
                  <Input 
                  name='Product weight'
                  type='number'
                  label={t('productWeight.label')}
                  value={state.productWeight}
                  handleChange={handleChangeWeight}
                  />
                  <Input 
                  name='Product Width'
                  type='number'
                  label={t('productWidth.label')}
                  value={state.productWidth}
                  handleChange={handleChangeWidth}
                  />
                  <Input 
                  name='Product Height'
                  type='number'
                  label={t('productHeight.label')}
                  value={state.productHeight}
                  handleChange={handleChangeHeight}
                  />
                  <Input 
                  name='Product Length'
                  type='number'
                  label={t('productLength.label')}
                  value={state.productLength}
                  handleChange={handleChangeLength}
                  />
                </div>

                <h4>{t('ProductDescription.label')}</h4>
                <div className='col-12'>
                  <TextArea
                    name={'prodDescription'}
                    value={state.productDescription}
                    handleChange={handleEditorEnglish}
                    placeholder={'Add description about your product in English'}
                    rows={4}
                    hideSwitch={true}
                  />
                </div>

                <div className='col-12'>
                  <TextArea
                    name={'prodDescriptionAr'}
                    value={state.productDescriptionAr}
                    handleChange={handleEditorArabic}
                    placeholder={'ضف وصف المنتج الخاص بك باللغة العربية هنا..'}
                    rows={4}
                    dir={'rtl'}
                    hideSwitch={true}
                  />
                </div>

                <div className='col-12'>
                  <TextArea
                    name={'prodDescriptionRu'}
                    value={state.productDescriptionRu}
                    handleChange={handleEditorRussian}
                    placeholder={'Добавьте описание товара на русском'}
                    rows={4}
                    hideSwitch={true}
                  />
                </div>
                <div className='col-12'>
                  <TextArea
                    name={'prodDescriptionTr'}
                    value={state.productDescriptionTr}
                    handleChange={handleEditorTurkish}
                    placeholder={'Ürününüz hakkında Türkçe açıklama ekleyin'}
                    rows={4}
                    hideSwitch={true}
                  />
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <Separator color={'#dddddd'} margin={false} />
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-12'>
                    <h4
                      style={{
                        textAlign: lang === 'ar' ? 'right' : 'left'
                      }}
                    >
                      { t('typeOfProduct.label') }
                    </h4>
                  </div>
                  <div className='col-12 d-flex'>
                    {
                      state.productType.map((type, index) => {
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
                </div>

                <div className='row'>
                  <div ref={productQuantity} id='productQuantity' className='col-lg-6 col-12'>
                    <Input
                      name='productQuantity'
                      type='number'
                      label={ t('productQuantity.label') }
                      value={state.productQuantity}
                      handleChange={handleChange}
                      error={isError && state.productQuantity.length === 0 && link === '#productQuantity'}
                      text={isError && state.productQuantity.length === 0 && link === '#productQuantity' ? t('thisIsaMandatoryField.label') : undefined}
                      disabled={state.characteristics.length > 0}
                    />
                  </div>
                  <div ref={statusRef} id='status' className='col-lg-6 col-12'>
                    <Select
                      lang={lang}
                      name='status'
                      options={state.statusOptions}
                      value={state.status}
                      handleChange={handleChange}
                      title={ t('selectStatus.label') }
                      error={isError && state.status.length === 0 && link === '#status'}
                      text={isError && state.status.length === 0 && link === '#status' ? t('thisIsaMandatoryField.label') : undefined}
                    />
                  </div>
                </div>

                {
                  state.categoryPicker.isComplete && state.characteristics.length > 0 ?
                    <>

                      <div className='row'>
                        <div className='col-12'>
                          <Separator color={'#dddddd'} margin={false} />
                        </div>
                      </div>

                      <div ref={productOffers} id='productOffers' className='row'>
                        <div id='characteristics' className='col-12'>
                          <h4
                            style={{
                              textAlign: lang === 'ar' ? 'right' : 'left'
                            }}
                          >
                            { t('moreProductCharacteristics.label') }
                          </h4>
                        </div>
                      </div>

                      <ProductCharacteristics
                        offers={state.offers}
                        images={state.productImages}
                        handleOffer={handleOffer}
                        handleRemoveOffer={handleRemoveOffer}
                        characteristics={state.characteristics}
                        error={isError && state.offers.length === 0 && link === '#productOffers'}
                        text={isError && state.offers.length === 0 && link === '#productOffers' ? t('atLeastOneProductCharacteristic.label') : undefined}
                      />

                    </> : null
                }

                <div className='row mt-3 mb-5 justify-content-center'>
                  <div className='col-6'>

                    {
                      link.length > 0 ?
                        <AnchorLink href={link}>
                          <SignUpButton
                            title={ t('submit.label') }
                            type={'custom'}
                            onClick={handleSend}
                            disabled={false}
                          />
                        </AnchorLink> :
                        <SignUpButton
                          title={ t('submit.label') }
                          type={'custom'}
                          onClick={handleSend}
                          disabled={false}
                        />
                    }

                  </div>
                </div>

              </div>
              <div ref={categoryPicker} id='categoryPicker' className='col-lg-3 col-12 mt-lg-0 mt-3 order-0 order-lg-1 border-right border-left'>
                <div
                  className='row justify-content-center mt-1'
                  style={{
                    position: 'sticky',
                    top: '0px'
                  }}
                >
                  <CategoriesSelector
                    lang={lang}
                    state={state}
                    handleClear={handleClear}
                    handleChange={handleChangeSelect}
                    error={isError && !state.categoryPicker.isComplete && link === '#categoryPicker'}
                    text={isError && !state.categoryPicker.isComplete && link === '#categoryPicker' ? t('thisIsaMandatoryField.label') : undefined}
                  />
                </div>
              </div>
            </div> :
          <div className='row min-vh-100'>
            <div className='col-12'>
              <BasicSpinner />
            </div>
          </div>
      }

    </div>

  )

}

export default SupplierProductsAddNew
