import React, { useContext, useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import firebase, {auth, firestore} from '../../../firebase/config'
import AppContext from '../../../components/AppContext'
import SupplierTabs from '../SupplierTabs/SupplierTabs'
import Input from '../../../components/UI/Input/Input'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
// import FileInput from '../../../components/UI/FileInput/FileInput'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'
import { validatePassword, validateRePassword } from '../../../components/Auth/utils/utils'
import { useTranslation } from 'react-i18next'
import { scrollToTop } from '../../../utils/utils'

import styles from './SupplierProfile.module.scss'
import ImagePicker from '../../../components/ImagePicker/ImagePicker'
import { moveFirebaseFile } from '../../../components/ImagePicker/FileLoader/utils'


const SupplierProfile = props => {

  const context = useContext(AppContext)

  let { lang, currentUser } = context
  let { t } = useTranslation()

  let tabs = [t('personalInformation.label'), t('changePassword.label')]

  const [isLoaded, setIsLoaded] = useState(false)

  const [tabsIndex, setTabsIndex] = useState(0)

  const [isEdit, setIsEdit] = useState(false)

  const [state, setState] = useState({
    avatar: [],
    firstName: {
      placeholder: t('firstName.label'),
      value: ''
    },
    lastName: {
      placeholder: 'Last Name',
      value: ''
    },
    DOB: {
      placeholder: 'Date of Birth',
      value: '',
      type: 'date'
    },
    phoneNumber: {
      placeholder: 'Contact Number',
      value: ''
    },
    email: {
      placeholder: 'Email',
      value: ''
    },
    nationality: {
      placeholder: 'Nationality',
      value: ''
    },
    city: {
      placeholder: 'City',
      value: ''
    },
    streetName: {
      placeholder: 'Street Name',
      value: ''
    },
    buildingName: {
      placeholder: 'Building Name',
      value: ''
    },
    floorNumber: {
      placeholder: 'Floor Number',
      value: ''
    },
    flatNumber: {
      placeholder: 'Flat Number',
      value: ''
    },
    location: {
      placeholder: 'Location',
      value: ''
    }
  })

  const [authState, setAuthState] = useState({
    oldPassword: '',
    password: '',
    rePassword: ''
  })

  const [isPassUpdating, setIsPassUpdating] = useState(false)

  useEffect(() => {

    if (currentUser !== null) {

      return firestore.collection('users').doc(currentUser.uid)
      .collection('profile')
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          if (doc.data().avatar !== undefined && doc.data().avatar.length > 0) {
            // setAvatar(doc.data().avatar)
            setState(prevState => {
              return {
                ...prevState,
                avatar: doc.data().avatar
              }
            })
          }
          Object.entries(doc.data()).map(m => {

            if (m[0] !== 'id' && m[0] !== 'avatar') {

              return (

                setState(prevState => {
                  return {
                    ...prevState,
                    [m[0]]: {
                      ...prevState[m[0]],
                      value: m[1]
                    }
                  }
                })

              )

            }

            return null

          })

        })

        setTimeout(() => {
          setIsLoaded(true)
        }, 500)

      })

    }

  }, [isEdit, currentUser])

  const handleIndex = index => {
    setTabsIndex(index)
  }

  const handleChangeState = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: {
        ...state[name],
        value
      }
    })
  }

  const handleChangeAuthState = event => {
    const { value, name } = event.target
    setAuthState({
      ...authState,
      [name]: value
    })
  }

  const handleSubmit = async () => {

    scrollToTop(0, 'smooth')

    setIsEdit(!isEdit)

    const { uid } = currentUser

    const usersRef = firestore.collection('users')

    let updatedFiles = []

    for (const file of state.avatar) {

      let oldRef = `tmp/${file.source}`
      let newRef = `images/${uid}/avatar/${file.source}`
      let url = await moveFirebaseFile(oldRef, newRef)
      updatedFiles = [...updatedFiles, {
        ...file,
        url,
        options: {
          type: 'local'
        }
      }]

    }

    const unsubscribe = usersRef.doc(uid).collection('profile')
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {

        firestore.doc(doc.ref.path)
        .update({
          avatar: updatedFiles,
          firstName: state.firstName.value,
          lastName: state.lastName.value,
          DOB: state.DOB.value,
          phoneNumber: state.phoneNumber.value,
          email: state.email.value,
          nationality: state.nationality.value,
          city: state.city.value,
          streetName: state.streetName.value,
          buildingName: state.buildingName.value,
          floorNumber: state.floorNumber.value,
          flatNumber: state.flatNumber.value,
          location: state.location.value
        })
        .then(r => {
          unsubscribe()
        })

      })
    })

  }

  const handlePasswordChange = () => {

    setIsPassUpdating(prevState => !prevState)

    if (
      validatePassword(authState.password) &&
      validateRePassword(authState.password, authState.rePassword) &&
      authState.oldPassword.length > 3
    ) {

      auth.signInWithEmailAndPassword(state.email.value, authState.oldPassword)
      .then((r) => {

        console.log('r', r)

        let user = firebase.auth().currentUser

        user.updatePassword(authState.password)
        .then(() => {
          console.log('pass updated')
          setIsPassUpdating(prevState => !prevState)
          setAuthState({
            oldPassword: '',
            password: '',
            rePassword: ''
          })
        })
        .catch((error) => {
          console.log('pass not updated', error)
          setIsPassUpdating(prevState => !prevState)
          setAuthState({
            oldPassword: '',
            password: '',
            rePassword: ''
          })
        })

      })
      .catch(error => {
        console.log('some error', error)
        setIsPassUpdating(prevState => !prevState)
        setAuthState({
          oldPassword: '',
          password: '',
          rePassword: ''
        })
      })

    } else {
      setIsPassUpdating(prevState => !prevState)
      setAuthState({
        oldPassword: '',
        password: '',
        rePassword: ''
      })
    }

  }


  return(

    <div className={styles.SupplierProfile}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('profile.label') }
      </div>

      {
        isLoaded ?
          <>
            <SupplierTabs
              tabs={tabs}
              tabsIndex={tabsIndex}
              handleIndex={handleIndex}
            />

            <div
              className='container-fluid'
              style={{
                opacity: tabsIndex === 0 ? 1 : 0,
                transition: 'opacity .15s linear',
                height: tabsIndex === 0 ? 'auto' : '0',
                overflow: 'hidden'
              }}
            >

              <div className='row justify-content-center'>
                <div
                  className='col-lg-6 col-12'
                  style={{
                    pointerEvents: isEdit ? 'all' : 'none'
                  }}
                >

                  <ImagePicker
                    state={state}
                    name={'avatar'}
                    isMultiple={false}
                    setState={setState}
                    uid={currentUser.uid}
                  />

                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'firstName'}
                    type={'text'}
                    label={t('firstName.label')}
                    value={state.firstName.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'lastName'}
                    type={'text'}
                    label={t('lastName.label')}
                    value={state.lastName.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'DOB'}
                    type={'date'}
                    label={t('dateOfBirth.label')}
                    value={state.DOB.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <PhoneInput
                    inputProps={{name: 'phoneNumber'}}
                    country={'ae'}
                    placeholder={t('contactNumber.label')}
                    value={state.phoneNumber.value}
                    onChange={(value, country, e, formattedValue) => {
                      handleChangeState(e)
                    }}
                    containerClass={styles.phoneContainer}
                    buttonClass={styles.dropDownContainer}
                    inputClass={styles.textField}
                    disableDropdown={true}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'email'}
                    type={'text'}
                    label={t('email.label')}
                    value={state.email.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'nationality'}
                    type={'text'}
                    label={t('nationality.label')}
                    value={state.nationality.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'city'}
                    type={'text'}
                    label={t('city.label')}
                    value={state.city.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'streetName'}
                    type={'text'}
                    label={t('streetName.label')}
                    value={state.streetName.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'buildingName'}
                    type={'text'}
                    label={t('buildingName.label')}
                    value={state.buildingName.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'floorNumber'}
                    type={'text'}
                    label={t('floorNumber.label')}
                    value={state.floorNumber.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'flatNumber'}
                    type={'text'}
                    label={t('flatNumber.label')}
                    value={state.flatNumber.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-6 col-12'>
                  <Input
                    name={'location'}
                    type={'text'}
                    label={t('location.label')}
                    value={state.location.value}
                    handleChange={handleChangeState}
                    disabled={!isEdit}
                  />
                </div>
              </div>

              <div className='row justify-content-center'>
                <div className='col-lg-3 col-6'>
                  <SignUpButton
                    type={'custom'}
                    title={isEdit ? t('cancel.label') : t('editProfile.label')}
                    onClick={() => {
                      scrollToTop(0, 'smooth')
                      setIsEdit(!isEdit)
                    }}
                    disabled={false}
                    isWide={true}
                  />
                </div>
                {
                  isEdit ?
                    <div className='col-lg-3 col-6'>
                      <SignUpButton
                        type={'custom'}
                        title={ t('saveProfile.label') }
                        onClick={() => handleSubmit()}
                        disabled={false}
                        isWide={true}
                      />
                    </div> : null
                }
              </div>

            </div>

            <div
              className='container-fluid'
              style={{
                opacity: tabsIndex !== 0 ? 1 : 0,
                transition: 'opacity .15s linear',
                height: tabsIndex !== 0 ? 'auto' : '0',
                overflow: 'hidden'
              }}
            >

              {
                isPassUpdating ?
                  <BasicSpinner /> :
                  <>
                    <div className='row justify-content-center'>
                      <div className='col-lg-6 col-12'>
                        <Input
                          name={'oldPassword'}
                          type='password'
                          label={ t('oldPassword.label') }
                          value={authState.oldPassword}
                          handleChange={handleChangeAuthState}
                        />
                      </div>
                    </div>

                    <div className='row justify-content-center'>
                      <div className='col-lg-6 col-12'>
                        <Input
                          name={'password'}
                          type='password'
                          label={ t('newPassword.label') }
                          value={authState.password}
                          handleChange={handleChangeAuthState}
                          error={!validatePassword(authState.password) && authState.password.length > 0}
                          text={
                            !validatePassword(authState.password) && authState.password.length > 0 ?
                              t('useEightSymbolError.label') :
                              !validatePassword(authState.password) && authState.password.length === 0 ?
                                t('useEightSymbolError.label') : ''
                          }
                        />
                      </div>
                    </div>

                    <div className='row justify-content-center'>
                      <div className='col-lg-6 col-12'>
                        <Input
                          name={'rePassword'}
                          type='password'
                          label={ t('repeatNewPassword.label') }
                          value={authState.rePassword}
                          handleChange={handleChangeAuthState}
                          error={!validateRePassword(authState.password, authState.rePassword) && authState.rePassword.length > 0}
                          text={
                            !validateRePassword(authState.password, authState.rePassword) && authState.rePassword.length > 0 ?
                              t('passwordsDoNotMuch.label') : ''
                          }
                        />
                      </div>
                    </div>

                    <div className='row justify-content-center'>
                      <div className='col-lg-6 col-12'>
                        <SignUpButton
                          type={'custom'}
                          title={ t('updatePassword.label') }
                          onClick={() => handlePasswordChange()}
                          disabled={false}
                          isWide={true}
                        />
                      </div>
                    </div>
                  </>
              }

            </div>
          </> :
          <BasicSpinner />
      }

    </div>

  )

}

export default SupplierProfile
