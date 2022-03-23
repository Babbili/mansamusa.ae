import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../AppContext'
import firebase from '../../../firebase/config'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import CreateStoreTabs from './CreateStoreTabs/CreateStoreTabs'
import CreateStoreLogIn from './CreateStoreLogIn/CreateStoreLogIn'
import CreateStoreFooter from './CreateStoreFooter/CreateStoreFooter'
import CreateStoreCountry from './CreateStoreCountry/CreateStoreCountry'
import CreateStoreStore from './CreateStoreStore/CreateStoreStore'
import CreateStoreDocument from './CreateStoreDocument/CreateStoreDocument'
import CreateStoreBank from './CreateStoreBank/CreateStoreBank'
import CreateStoreVat from './CreateStoreVat/CreateStoreVat'
import Spinner from '../../UI/Spinner/Spinner'
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import { scrollToTop } from '../../../utils/utils'

import styles from './SupplierCreateStore.module.scss'
import { moveFirebaseFile } from '../../ImagePicker/FileLoader/utils'
import { supplierWelcomeEmail } from '../../../emails/utils'


const SupplierCreateStore = props => {

  let params = useParams()
  let { t } = useTranslation()

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  const { uid } = currentUser
  const [index, setIndex] = useState(0)
  const [send, setSend] = useState(false)
  const [state, setState] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    rePassword: '',
    storeLogo: [],
    storeName: '',
    companyName: '',
    companyPhone: '',
    companyEmail: '',
    product: '',
    companyAddress: '',
    tradeLicense: [],
    noTradeLicense: false,
    nationalId: [],
    beneficiaryName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    iban: '',
    currency: '',
    document: [],
    taxRegNumber: '',
    taxRegCertificate: [],
    noVatReg: false,
    agree: false,
    country: '',
    region: '',
    typeId: [
      {
        radioName: {
          en: 'Building',
          ar: 'بناء',
          ru: 'Здание'
        },
        selected: true,
        value: 2
      },
      {
        radioName: {
          en: 'Tower',
          ar: 'برج',
          ru: 'башня'
        },
        selected: false,
        value: 1
      },
      {
        radioName: {
          en: 'Commercial',
          ar: 'تجاري',
          ru: 'торговый'
        },
        selected: false,
        value: 3
      }
    ],
    lat: '',
    lng: '',
    customerAddress: '',
    customerAddressTypeId: 2,
    customerAddressNote: '',
    building: '',
    floor: '',
    unit: '',
    area: '',
    city: '',
    storeDescriptionEn: '',
    storeDescriptionAr: '',
    storeDescriptionRu: ''
  })
  const [error, setError] = useState(false)
  const [stepValidation, setStepValidation] = useState([])
  const [address, setAddress] = useState(null)

  const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const prevAddress = usePrevious(address)

  useEffect(() => {

    const localAddress = JSON.parse(localStorage.getItem('address'))

    if (address !== null && !localAddress) {
      return geocodeByAddress(address.label)
      .then(results => {
        // let country = results[0].address_components.map(a => {
        //   if (a.types.includes('country')) {
        //     return a.long_name
        //   }
        //   return null
        // }).filter(f => f !== null).toString()
        let city = results[0].address_components.map(a => {
          if (a.types.includes('locality')) {
            return a.long_name
          }
          return null
        }).filter(f => f !== null).toString()
        let area = results[0].address_components.map(a => {
          if (a.types.includes('sublocality')) {
            return a.long_name
          }
          return null
        }).filter(f => f !== null).toString()
        getLatLng(results[0])
        .then(({lat, lng}) => {
          setState(prevState => {
            return {
              ...prevState,
              lat,
              lng,
              area,
              city,
              // country
            }
          })
        })
      })
    }

  }, [address, prevAddress])

  useEffect(() => {
    if (address !== null) {
      setState(prevState => {
        return {
          ...prevState,
          customerAddress: address.label
        }
      })
    }
  }, [address])

  const errorList = [
    t('fillOutAllTheRequiredFields.label'),
    t('chooseCountryAndRegionOfYourBusiness.label'),
    t('provideAllTheDetails.label'),
    t('uploadNationalIDErr.label'),
    'Provide all the bank details.',
    t('provideVATRegistrationNumberErr.label'),
    t('dontForgetToAgree.label')
  ]

  useEffect(() => {

    const storeCreate = JSON.parse(localStorage.getItem('storeCreate'))
    const address = JSON.parse(localStorage.getItem('address'))

    if (address) {
      setAddress(address)
    }

    if (storeCreate) {
      storeCreate.agree = false
      storeCreate.noTradeLicense = false
      storeCreate.noVatReg = false
      setState({
        ...storeCreate
      })
    }

  }, [])

  useEffect(() => {

    if (context.currentUser !== null && params.id && state.storeName.length === 0) {

      return firebase.firestore().collection('users')
      .doc(context.currentUser.uid)
      .collection('stores').doc(params.id)
      .onSnapshot(snapShot => {

        setState(prevState => {
          return {
            ...prevState,
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            rePassword: '',
            storeLogo: snapShot.data().store.storeLogo,
            storeName: snapShot.data().storeName,
            companyName: snapShot.data().companyName,
            companyPhone: snapShot.data().companyPhone,
            product: snapShot.data().product,
            companyAddress: snapShot.data().companyAddress,
            tradeLicense: snapShot.data().store.tradeLicense,
            noTradeLicense: snapShot.data().store.noTradeLicense,
            nationalId: snapShot.data().store.nationalId,
            beneficiaryName: snapShot.data().bank.beneficiaryName,
            bankName: snapShot.data().bank.bankName,
            branchName: snapShot.data().bank.branchName,
            accountNumber: snapShot.data().bank.accountNumber,
            iban: snapShot.data().bank.iban,
            currency: snapShot.data().bank.currency,
            document: snapShot.data().bank.document,
            taxRegNumber: snapShot.data().vat.taxRegNumber,
            taxRegCertificate: snapShot.data().vat.taxRegCertificate,
            noVatReg: snapShot.data().vat.noVatReg,
            agree: false,
            country: snapShot.data().store.country,
            region: snapShot.data().store.region,
            default: snapShot.data().default,
            lat: snapShot.data().address.lat,
            lng: snapShot.data().address.lng,
            customerAddress: snapShot.data().address.customerAddress,
            customerAddressTypeId: snapShot.data().address.customerAddressTypeId,
            customerAddressNote: snapShot.data().address.customerAddressNote,
            building: snapShot.data().address.building,
            floor: snapShot.data().address.floor,
            unit: snapShot.data().address.unit,
            area: snapShot.data().address.area,
            city: snapShot.data().address.city,
            storeDescriptionEn: snapShot.data().storeDescription.en,
            storeDescriptionAr: snapShot.data().storeDescription.ar,
            storeDescriptionRu: snapShot.data().storeDescription.ru
          }
        })

      })

    }

  }, [context.currentUser, params.id, state.storeName.length])

  // if store edit
  useEffect(() => {

    if (state.customerAddress.length > 0 && props.editStore) {
      setAddress({
        label: state.customerAddress,
        value: {
          description: state.customerAddress
        }
      })
    }

  }, [props.editStore, state.customerAddress])

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const handleChangeSelector = event => {
    const { value, name } = event.target
    // console.log('check', name, value, typeof JSON.parse(value) === 'object')
    setState({
      ...state,
      [name]: typeof JSON.parse(value) === 'object' ? JSON.parse(value) : value
    })
  }

  const handleCheck = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  const handleNext = () => {
    scrollToTop(0, 'smooth')

    localStorage.setItem('storeCreate', JSON.stringify(state))

    if (address !== null) {
      localStorage.setItem('address', JSON.stringify(address))
    }

    if (stepValidation[index]) {
      setIndex(prevIndex => prevIndex + 1)
    } else {
      setError(true)

      setTimeout(() => {
        setError(false)
      }, 50000)
    }
  }

  const handlePrev = () => {
    setIndex(prevIndex => prevIndex - 1)
    scrollToTop(0, 'smooth')
  }

  const handleStepValidation = useCallback((index, valid) => {

      setStepValidation(prevState => {
        let arr = [...prevState]
        arr[index] = valid
        return arr
      })

  }, [])

  const handleSubmit = async () => {

    setSend(true)

    const uid = context.currentUser.uid
    let valid = stepValidation.filter(f => f === false)

    let storeLogo = []
    let tradeLicense = []
    let nationalId = []
    let document = []
    let taxRegCertificate = []

    if (state.storeLogo.length > 0) {
      for (const file of state.storeLogo) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${uid}/storeLogo/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        storeLogo = [...storeLogo, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }
    }

    if (state.tradeLicense.length > 0) {
      for (const file of state.tradeLicense) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${uid}/tradeLicense/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        tradeLicense = [...tradeLicense, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }
    }

    if (state.nationalId.length > 0) {
      for (const file of state.nationalId) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${uid}/nationalId/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        nationalId = [...nationalId, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }
    }

    if (state.document.length > 0) {
      for (const file of state.document) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${uid}/document/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        document = [...document, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }
    }

    if (state.taxRegCertificate.length > 0) {
      for (const file of state.taxRegCertificate) {

        let oldRef = `tmp/${file.source}`
        let newRef = `images/${uid}/taxRegCertificate/${file.source}`
        let url = await moveFirebaseFile(oldRef, newRef)
        taxRegCertificate = [...taxRegCertificate, {
          ...file,
          url,
          options: {
            type: 'local'
          }
        }]

      }
    }


    if (props.newStore) {

      if (params.id !== undefined) {

        if (state.agree && valid.length === 0) {
          firebase.firestore().collection('users')
          .doc(uid).collection('stores')
          .doc(state.storeName.replace(/\s/g, '').toLowerCase())
          .update({
            id: state.storeName.replace(/\s/g, '').toLowerCase(),
            storeName: state.storeName,
            companyName: state.companyName,
            companyPhone: state.companyPhone,
            companyEmail: state.email,
            product: state.product,
            address: {
              lat: state.lat,
              lng: state.lng,
              customerAddress: state.customerAddress,
              customerAddressTypeId: state.customerAddressTypeId,
              customerAddressNote: state.customerAddressNote,
              area: state.area,
              building: state.building,
              floor: state.floor,
              unit: state.unit,
              city: state.region,
              country: state.country
            },
            store: {
              tradeLicense: tradeLicense,
              noTradeLicense: state.noTradeLicense,
              nationalId: nationalId,
              country: state.country,
              region: state.region,
              storeLogo: storeLogo
            },
            bank: {
              beneficiaryName: state.beneficiaryName,
              bankName: state.bankName,
              branchName: state.branchName,
              accountNumber: state.accountNumber,
              iban: state.iban,
              currency: state.currency,
              document: document
            },
            vat: {
              taxRegNumber: state.taxRegNumber,
              taxRegCertificate: taxRegCertificate,
              noVatReg: state.noVatReg
            },
            default: state.default,
            dashboard: [
              {
                title: 'Products',
                description: 'Total number of products',
                value: 0
              },
              {
                title: 'Approved',
                description: 'Number of approved products',
                value: 0
              },
              {
                title: 'Pending',
                description: 'Number of pending products',
                value: 0
              },
              {
                title: 'Price',
                description: 'Av. price of products',
                value: 0
              },
              {
                title: 'Sold',
                description: 'Number of sold products',
                value: 0
              },
              {
                title: 'ARPU',
                description: 'Average revenue per customer',
                value: 0
              }
            ],
            storeDescription: {
              en: state.storeDescriptionEn,
              ar: state.storeDescriptionAr,
              ru: state.storeDescriptionRu
            }
          })
          .then(() => {
            localStorage.removeItem('storeCreate')
            localStorage.removeItem('storeLogo')
            localStorage.removeItem('tradeLicense')
            localStorage.removeItem('nationalId')
            localStorage.removeItem('document')
            localStorage.removeItem('taxRegCertificate')
            localStorage.removeItem('address')
            props.history.push('/supplier/stores')
          })
        } else {
          setError(true)
          setSend(false)
          setTimeout(() => {
            setError(false)
          }, 90000)
        }

      } else {

        if (state.agree && valid.length === 0) {
          firebase.firestore().collection('users')
          .doc(uid).collection('stores')
          .doc(state.storeName.replace(/\s/g, '').toLowerCase())
          .set({
            id: state.storeName.replace(/\s/g, '').toLowerCase(),
            isTrial: false,
            isSubscribed: false,
            createdAt: Math.round(new Date() * 0.001),
            storeName: state.storeName,
            companyName: state.companyName,
            companyPhone: state.companyPhone,
            companyEmail: state.email,
            product: state.product,
            address: {
              lat: state.lat,
              lng: state.lng,
              customerAddress: state.customerAddress,
              customerAddressTypeId: state.customerAddressTypeId,
              customerAddressNote: state.customerAddressNote,
              area: state.area,
              building: state.building,
              floor: state.floor,
              unit: state.unit,
              city: state.region,
              country: state.country
            },
            store: {
              tradeLicense: tradeLicense,
              noTradeLicense: state.noTradeLicense,
              nationalId: nationalId,
              country: state.country,
              region: state.region,
              storeLogo: storeLogo
            },
            bank: {
              beneficiaryName: state.beneficiaryName,
              bankName: state.bankName,
              branchName: state.branchName,
              accountNumber: state.accountNumber,
              iban: state.iban,
              currency: state.currency,
              document: document
            },
            vat: {
              taxRegNumber: state.taxRegNumber,
              taxRegCertificate: taxRegCertificate,
              noVatReg: state.noVatReg
            },
            approved: false,
            default: false,
            dashboard: [
              {
                title: 'Products',
                description: 'Total number of products',
                value: 0
              },
              {
                title: 'Approved',
                description: 'Number of approved products',
                value: 0
              },
              {
                title: 'Pending',
                description: 'Number of pending products',
                value: 0
              },
              {
                title: 'Price',
                description: 'Av. price of products',
                value: 0
              },
              {
                title: 'Sold',
                description: 'Number of sold products',
                value: 0
              },
              {
                title: 'ARPU',
                description: 'Average revenue per customer',
                value: 0
              }
            ],
            storeDescription: {
              en: state.storeDescriptionEn,
              ar: state.storeDescriptionAr,
              ru: state.storeDescriptionRu
            }
          })
          .then(() => {
            localStorage.removeItem('storeCreate')
            localStorage.removeItem('storeLogo')
            localStorage.removeItem('tradeLicense')
            localStorage.removeItem('nationalId')
            localStorage.removeItem('document')
            localStorage.removeItem('taxRegCertificate')
            localStorage.removeItem('address')
            props.history.push('/supplier/stores')
          })
        } else {
          setError(true)
          setSend(false)
          setTimeout(() => {
            setError(false)
          }, 90000)
        }

      }

    } else {

      if (state.agree && valid.length === 0) {

        const user = firebase.auth().currentUser

        const usersRef = firebase.firestore().collection('users')

        const credential = firebase.auth.EmailAuthProvider.credential(
          state.email,
          state.password
        )

        user.linkWithCredential(credential)
        .then(r => {

          usersRef.doc(uid).update({
            displayName: `${state.firstName} ${state.lastName}`,
            email: state.email,
            completed: true,
            type: 'supplier'
          })
          .then(() => {

            usersRef.doc(uid).collection('stores')
            .doc(state.storeName.replace(/\s/g, '').toLowerCase())
            .set({
              id: state.storeName.replace(/\s/g, '').toLowerCase(),
              isTrial: false,
              isSubscribed: false,
              createdAt: Math.round(new Date() * 0.001),
              storeName: state.storeName,
              companyName: state.companyName,
              companyPhone: state.companyPhone,
              companyEmail: state.email,
              companyRepresentative: '',
              product: state.product,
              address: {
                lat: state.lat,
                lng: state.lng,
                customerAddress: state.customerAddress,
                customerAddressTypeId: state.customerAddressTypeId,
                customerAddressNote: state.customerAddressNote,
                area: state.area,
                building: state.building,
                floor: state.floor,
                unit: state.unit,
                city: state.region,
                country: state.country
              },
              store: {
                tradeLicense: tradeLicense,
                noTradeLicense: state.noTradeLicense,
                nationalId: nationalId,
                country: state.country,
                region: state.region,
                storeLogo: storeLogo
              },
              bank: {
                beneficiaryName: state.beneficiaryName,
                bankName: state.bankName,
                branchName: state.branchName,
                accountNumber: state.accountNumber,
                iban: state.iban,
                currency: state.currency,
                document: document
              },
              vat: {
                taxRegNumber: state.taxRegNumber,
                taxRegCertificate: taxRegCertificate,
                noVatReg: state.noVatReg
              },
              approved: false,
              default: true,
              storeDescription: {
                en: state.storeDescriptionEn,
                ar: state.storeDescriptionAr,
                ru: state.storeDescriptionRu
              }
            })
            .then(() => {

              usersRef.doc(uid).collection('profile')
              .add({
                firstName: state.firstName,
                lastName: state.lastName,
                email: state.email,
              })
              .then(() => {

                user.updateProfile({
                  displayName: `${state.firstName} ${state.lastName}`
                })
                .then(() => {

                  // send supplier welcome email
                  state.country.en =! undefined ?
                  supplierWelcomeEmail(state.email, state.firstName, state.lastName, state.country.en)
                  : null
                  .then(() => {

                    // localStorage.removeItem('supplierAuth')
                    localStorage.removeItem('storeCreate')
                    localStorage.removeItem('storeLogo')
                    localStorage.removeItem('tradeLicense')
                    localStorage.removeItem('nationalId')
                    localStorage.removeItem('document')
                    localStorage.removeItem('taxRegCertificate')
                    localStorage.removeItem('address')
                    setSend(false)
                    props.history.push('/supplier')

                  })

                })
                .catch((error) => {
                  setSend(false)
                  // console.log('error name update', error)
                })

              })

            })
            .catch(error => {
              setSend(false)
              // console.log('store data error', error)
            })

          })
          .catch(error => {
            setSend(false)
            // console.log('personal data error', error)
          })

        })
        .catch(error => {

          // is session is expired re-auth
          // else email is already exist
          console.log('auth error', error)
          setSend(false)
          props.history.push('/re-auth')
        })

      } else {
        setError(true)
        setSend(false)
        setTimeout(() => {
          setError(false)
        }, 90000)
      }

    }
  }

  const handleInputChange = ({ target }) => {

    const typeId = state.typeId.map(type => {
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
    const customerAddressTypeId = state.typeId.map(type => {
      if (type.radioName[lang] === target.name) {
        return type.value
      }
      return null
    }).filter(f => f !== null)[0]

    setState({
      ...state,
      typeId,
      customerAddressTypeId
    })
  }

  const handleAddress = address => {

    const localAddress = JSON.parse(localStorage.getItem('address'))

    if (localAddress) {
      localStorage.removeItem('address')
      setAddress(address)
    } else {
      setAddress(address)
    }

  }


  return(

    send ?
      <Spinner newStore={props.newStore} /> :
      <div
        className={styles.SupplierCreateStore}
        style={{
          width: props.newStore ? '100%' : 'auto'
        }}
      >

        <div
          className={styles.wrapper}
          style={{
            boxShadow: props.newStore ? 'none' : null
            // maxWidth: props.newStore ? '100%' : '650px'
          }}
        >

          <div className={styles.header}>
            <div className={styles.title}>
              {
                params.id !== undefined && props.newStore ?
                  t('updateStoreInformation.label') :
                  params.id === undefined && props.newStore ?
                    t('createNewStore.label') :
                    t('createStore.label')
              }
            </div>
            {
              props.newStore ? null :
                <div className={styles.subTitle}>
                  { t('signupStepThree.label') }
                </div>
            }
          </div>

          <CreateStoreTabs
            index={index}
            newStore={props.newStore}
          />

          <div className={`${styles.body} container-fluid`}>

            <CreateStoreLogIn
              index={index}
              state={state}
              currentUser={currentUser}
              newStore={props.newStore}
              handleChange={handleChange}
              stepValidation={stepValidation}
              handleStepValidation={handleStepValidation}
            />

            <CreateStoreCountry
              index={index}
              state={state}
              newStore={props.newStore}
              handleChangeSelector={handleChangeSelector}
              handleStepValidation={handleStepValidation}
            />

            <CreateStoreStore
              uid={uid}
              error={error}
              index={index}
              state={state}
              params={params}
              address={address}
              setState={setState}
              setAddress={setAddress}
              newStore={props.newStore}
              editStore={props.editStore}
              handleChange={handleChange}
              handleAddress={handleAddress}
              handleInputChange={handleInputChange}
              handleChangeSelector={handleChangeSelector}
              handleStepValidation={handleStepValidation}
            />

            <CreateStoreDocument
              uid={uid}
              index={index}
              state={state}
              setState={setState}
              newStore={props.newStore}
              handleCheck={handleCheck}
              handleStepValidation={handleStepValidation}
            />

            <CreateStoreBank
              uid={uid}
              index={index}
              state={state}
              setState={setState}
              newStore={props.newStore}
              handleChange={handleChange}
              handleStepValidation={handleStepValidation}
            />

            <CreateStoreVat
              uid={uid}
              index={index}
              state={state}
              setState={setState}
              newStore={props.newStore}
              handleCheck={handleCheck}
              handleChange={handleChange}
              handleStepValidation={handleStepValidation}
            />

            {
              error ?
                <div
                  className={styles.error}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  {
                    props.newStore ?
                    errorList[index + 1] : errorList[index]
                  }
                </div> : null
            }

            <CreateStoreFooter
              index={index}
              handleNext={handleNext}
              handlePrev={handlePrev}
              newStore={props.newStore}
              handleSubmit={handleSubmit}
            />

            {
              props.newStore ? null :
                <div className={styles.account}>
                  Already have an account? <a href='/login'> Log In</a>
                </div>
            }

          </div>

        </div>

      </div>

  )

}

export default SupplierCreateStore
