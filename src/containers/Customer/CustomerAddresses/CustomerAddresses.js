import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../../../components/AppContext'

import styles from './CustomerAddresses.module.scss'
import DeliveryAddressForm from "../../Checkout/Delivery/DeliveryAddressForm/DeliveryAddressForm";
import DeliveryAddressSelector from "../../Checkout/Delivery/DeliveryAddressSelector/DeliveryAddressSelector";
import SignUpButton from "../../../components/UI/SignUpButton/SignUpButton";
import {firestore} from "../../../firebase/config";
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import {useHistory} from "react-router-dom";
import DashboardWidget from "../../../components/UI/Dashboard/DashboardWidget/DashboardWidget";


const CustomerAddresses = props => {

  const context = useContext(AppContext)
  const { lang, currentUser } = context
  const history = useHistory()

  const [state, setState] = useState({
    typeId: [
      {
        radioName: {
          en: 'Building',
          ar: 'بناء'
        },
        selected: true,
        value: 2
      },
      {
        radioName: {
          en: 'Tower',
          ar: 'برج'
        },
        selected: false,
        value: 1
      },
      {
        radioName: {
          en: 'Commercial',
          ar: 'تجاري'
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
    country: '',

    isDefault: false,
    isAddress: false,
    isAddressChange: false,
    isNewAddress: false,
    addressQuantity: 0,
    addresses: [],
    selectedAddress: '',
  })
  const [address, setAddress] = useState(null)

  useEffect(() => {

    if (address !== null) {
      return geocodeByAddress(address.label)
      .then(results => {
        let country = results[0].address_components.map(a => {
          if (a.types.includes('country')) {
            return a.long_name
          }
          return null
        }).filter(f => f !== null).toString()
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
              country
            }
          })
        })
      })
    }

  }, [address, history])

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

  // check is there more than one address +
  useEffect(() => {

    if (currentUser !== null && currentUser.uid !== undefined) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('addresses')
      .onSnapshot(snapshot => {
        setState(prevState => {
          return {
            ...prevState,
            addressQuantity: snapshot.size
          }
        })
      })

    }

  }, [currentUser])

  // load all addresses
  useEffect(() => {

    return firestore.collection('users').doc(currentUser.uid)
    .collection('addresses')
    .onSnapshot(snapshot => {
      let addresses = []
      snapshot.forEach(doc => {
        addresses = [...addresses, {id: doc.id, value: doc.data().customerAddress, ...doc.data()}]
      })
      setState(prevState => {
        return {
          ...prevState,
          addresses
        }
      })
    })

  }, [currentUser, state.isAddressChange])

  // select address
  useEffect(() => {

    if (state.selectedAddress.length > 0) {

      state.addresses.map(a => {

        if (a.customerAddress === state.selectedAddress) {

          let addressRef = firestore.collection('users')
          .doc(currentUser.uid)
          .collection('addresses')

          addressRef.get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              addressRef.doc(doc.id)
              .update({
                default: false
              })
              .then(() => {})
            })
          })
          .then(() => {

            addressRef.doc(a.id)
            .update({
              default: true
            })
            .then(() => {
              setState(prevState => {
                return {
                  ...prevState,
                  lat: a.lat,
                  lng: a.lng,
                  customerAddress: a.customerAddress,
                  customerAddressTypeId: a.customerAddressTypeId,
                  customerAddressNote: a.customerAddressNote,
                  area: a.area,
                  city: a.city,
                  country: a.country,
                  building: a.building,
                  floor: a.floor,
                  unit: a.unit,
                  isAddressChange: false,
                  selectedAddress: ''
                }
              })
            })

          })

        }

        return null

      })

    }

  }, [currentUser, state.selectedAddress, state.addresses])

  // get current user address
  useEffect(() => {

    if (currentUser !== null && currentUser.uid !== undefined && !state.isNewAddress) {

      return firestore.collection('users')
      .doc(currentUser.uid)
      .collection('addresses')
      .where('default', '==', true)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          setState(prevState => {
            return {
              ...prevState,
              lat: doc.data().lat,
              lng: doc.data().lng,
              customerAddress: doc.data().customerAddress,
              customerAddressTypeId: doc.data().customerAddressTypeId,
              customerAddressNote: doc.data().customerAddressNote,
              area: doc.data().area,
              building: doc.data().building,
              floor: doc.data().floor,
              unit: doc.data().unit,
              city: doc.data().city,
              country: doc.data().country,
              isDefault: true
            }
          })
        })
      })

    } else {

      setState(prevState => {
        return {
          ...prevState,
          lat: prevState.lat,
          lng: prevState.lng,
          customerAddress: prevState.customerAddress,
          customerAddressTypeId: 2,
          customerAddressNote: prevState.customerAddressNote,
          area: prevState.area,
          building: prevState.building,
          floor: prevState.floor,
          unit: prevState.unit,
          city: prevState.city,
          country: prevState.country
        }
      })

    }

  }, [state.isNewAddress, currentUser])

  // update address
  useEffect(() => {

    if (state.customerAddress.length > 0) {
      setAddress({
        label: state.customerAddress,
        value: {
          description: state.customerAddress
        }
      })
    }

  }, [state.customerAddress])

  const handleChange = event => {

    let { name, value } = event.target

    setState({
      ...state,
      [name]: value
    })

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

  const handleAddress = () => {

    setState(prevState => {
      return {
        ...prevState,
        isAddress: true
      }
    })

    let addressRef = firestore.collection('users')
    .doc(currentUser.uid)
    .collection('addresses')

    addressRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        addressRef.doc(doc.id)
        .update({
          default: false
        })
        .then(() => {})
      })
    })
    .then(() => {

      addressRef
      .add({
        lat: state.lat,
        lng: state.lng,
        customerAddress: state.customerAddress,
        customerAddressTypeId: state.customerAddressTypeId,
        customerAddressNote: state.customerAddressNote,
        area: state.area,
        building: state.building,
        floor: state.floor,
        unit: state.unit,
        city: state.city,
        country: state.country,
        default: true
      })
      .then(() => {
        setState(prevState => {
          return {
            ...prevState,
            isAddress: false,
            isNewAddress: false
          }
        })
      })

    })

  }

  const handleNewAddress = () => {

    setState(prevState => {
      return {
        ...prevState,
        isNewAddress: !prevState.isNewAddress
      }
    })

  }

  const handleChangeAddress = () => {

    setState(prevState => {
      return {
        ...prevState,
        isAddressChange: !prevState.isAddressChange
      }
    })

  }

  const handleSelectAddress = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }


  return(

    <div className={styles.CustomerAddresses}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        My Addresses
      </div>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>
          {
            state.addresses.length > 0 ?
              state.addresses.map((a, i) => (
                <DashboardWidget
                  key={i}
                  title={a.area}
                  description={a.customerAddress}
                />
              )) : null
          }
        </div>

        <div className={`${styles.dashboard} row`}>

          <div className={`${styles.subTitle} col-12 mb-3`}>
            Current Address
          </div>

          {
            currentUser !== null && state.isDefault ?
              <>

                {
                  state.isNewAddress ?
                    <DeliveryAddressForm
                      lang={lang}
                      state={state}
                      address={address}
                      setAddress={setAddress}
                      handleChange={handleChange}
                      handleInputChange={handleInputChange}
                    /> :
                    state.isAddressChange && state.addresses.length > 0 ?
                      <DeliveryAddressSelector
                        lang={lang}
                        state={state}
                        handleSelectAddress={handleSelectAddress}
                      /> :
                      <div className='col-12 mb-3'>
                        <div className={styles.description}>
                          { state.customerAddress }
                        </div>
                        <div className={styles.description}>
                          { state.area }
                        </div>
                      </div>

                }

                <div className='col-12'>
                  <div className={styles.buttonWrapper}>
                    {
                      state.isAddressChange ? null :
                        <>
                          <SignUpButton
                            isSmall={true}
                            title={state.isNewAddress ? 'Cancel' : 'Add New'}
                            onClick={() => handleNewAddress()}
                            disabled={false}
                          />
                          {
                            state.isNewAddress ?
                              <SignUpButton
                                title={state.isAddress ? 'Adding...' : 'Add'}
                                isSmall={true}
                                onClick={() => handleAddress()}
                                disabled={false}
                              /> : null
                          }
                        </>
                    }

                    {
                      !state.isNewAddress && state.addressQuantity > 1 ?
                        <SignUpButton
                          title={state.isAddressChange ? 'Cancel' : 'Change'}
                          isSmall={true}
                          onClick={() => handleChangeAddress()}
                          disabled={false}
                        /> : null
                    }
                  </div>
                </div>

              </> :
              <>

                <DeliveryAddressForm
                  lang={lang}
                  state={state}
                  address={address}
                  setAddress={setAddress}
                  handleChange={handleChange}
                  handleInputChange={handleInputChange}
                />

                {
                  currentUser !== null && !state.isDefault ?
                    <div className='col-6'>
                      <SignUpButton
                        title={state.isAddress ? 'Adding...' : 'Add an address'}
                        isSmall={true}
                        onClick={() => handleAddress()}
                        disabled={false}
                      />
                    </div> : null
                }

              </>
          }

        </div>

      </div>

    </div>

  )

}

export default CustomerAddresses
