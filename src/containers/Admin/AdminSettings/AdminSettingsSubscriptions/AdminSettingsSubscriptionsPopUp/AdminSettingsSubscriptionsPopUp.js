import React, { useEffect, useState } from 'react'
import Input from '../../../../../components/UI/Input/Input'
import Select from '../../../../../components/UI/Select/Select'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'
import { firestore } from '../../../../../firebase/config'
import BasicSpinner from '../../../../../components/UI/BasicSpinner/BasicSpinner'
import PopUpHeader from '../../../../../components/UI/PopUpHeader/PopUpHeader'
import TextArea from '../../../../../components/UI/TextArea/TextArea'

import styles from './AdminSettingsSubscriptionsPopUp.module.scss'
import TextEditor from '../../../../../components/UI/TextEditor/TextEditor'


const AdminSettingsSubscriptionsPopUp = ({ lang, item, handleClose }) => {

  const [state, setState] = useState({
    name: '',
    description: {
      en: '',
      ar: ''
    },
    subscription: '',
    currency: '',
    unit_amount: '', // number
    oldPrice: '', // number
    active: true,
    interval: '', // day, week, month, year
    interval_count: '',
    usage_type: 'licensed',
    country: '',
    additionalDescription: {
      en: '',
      ar: ''
    },
    additionalDescriptionHtml: {
      en: '',
      ar: ''
    }
  })
  const [types, setTypes] = useState(null)
  const [countries, setCountries] = useState(null)
  const [currencies, setCurrencies] = useState(null)

  const intervals = [
    {id: 'd1', value: {en: 'Day', ar: 'يوم'}},
    {id: 'd2', value: {en: 'Week', ar: 'أسبوع'}},
    {id: 'd3', value: {en: 'Month', ar: 'شهر'}},
    {id: 'd4', value: {en: 'Year', ar: 'سنة'}}
  ]

  // get country list
  useEffect(() => {

    return firestore.collection('countriesList')
      .onSnapshot(snap => {
        let countries = []
        snap.forEach(doc => {
          countries = [...countries, {id: doc.id, ...doc.data()}]
        })
        setCountries(countries)
      })

  }, [])

  // get subscription types
  useEffect(() => {

    return firestore.collection('subscriptionsTypes')
      .onSnapshot(snap => {
        let types = []
        snap.forEach(doc => {
          types = [...types, {id: doc.id, ...doc.data()}]
        })
        setTypes(types)
      })

  }, [])

  // get currencies
  useEffect(() => {

    return firestore.collection('currencies')
      .onSnapshot(snap => {
        let currencies = []
        snap.forEach(doc => {
          currencies = [...currencies, {
            id: doc.id,
            title: {
              en: doc.data().currency.code,
              ar: doc.data().currency.symbol
            }
          }]
        })
        setCurrencies(currencies)
      })

  }, [])

  // update state from item
  useEffect(() => {
    if (item === null) return
    setState(item)
  }, [item])

  const handleChangeSelect = event => {

    const { value, name } = event.target

    setState({
      ...state,
      [name]: typeof JSON.parse(value) === 'object' ?
        JSON.parse(value) : value
    })

  }

  const handleChange = (event, lang) => {

    const { value, name } = event.target

    if (lang !== undefined) {

      setState({
        ...state,
        [name]: {
          ...state[name],
          [lang]: value
        }
      })

    } else {

      setState({
        ...state,
        [name]: (name === 'interval_count' || name === 'unit_amount' || name === 'oldPrice') && value.length !== 0 ?
          Number(value) : value
      })

    }

  }

  const handleUpdate = id => {
    firestore.collection('suppliersSubscriptions')
      .doc(id)
      .update({...state})
      .then(() => {
        handleClose()
      })
  }

  const handleAdd = () => {
    firestore.collection('suppliersSubscriptions')
      .add({...state})
      .then(() => {
        handleClose()
      })
  }

  const handleEditor = (editorState, lang) => {
    setState({
      ...state,
      additionalDescription: {
        ...state.additionalDescription,
        [lang]: editorState
      }
    })
  }

  const handleEditorHtml = (editorState, lang) => {
    setState({
      ...state,
      additionalDescriptionHtml: {
        ...state.additionalDescriptionHtml,
        [lang]: editorState
      }
    })
  }


  return(

    <div className={styles.AdminSettingsSubscriptionsPopUp}>

      <PopUpHeader
        handleClose={handleClose}
        title={item !== null ? 'Update Subscription' : 'Add New Subscription'}
      >

        <SignUpButton
          isSmall={true}
          type={'custom'}
          title={item !== null ? 'Update' : 'Save'}
          onClick={() => {
            item !== null ?
              handleUpdate(item.id) : handleAdd()
          }}
          disabled={false}
        />

        <SignUpButton
          isSmall={true}
          type={'custom'}
          title={'Cancel'}
          onClick={handleClose}
          disabled={false}
        />

      </PopUpHeader>

      {
        types !== null && countries !== null && currencies !== null ?
          <div className={styles.wrapper}>

            <div className={styles.title}>
              Subscription Information
            </div>

            <div className='row mb-5'>

              <div className='col-12'>
                <Select
                  lang={lang}
                  title={'Choose Subscription Type'}
                  options={types}
                  name={'subscription'}
                  handleChange={handleChangeSelect}
                  value={state.subscription}
                />
              </div>

              <div className='col-12 mb-3'>
                <Input
                  name={'name'}
                  type={'text'}
                  value={state.name}
                  label={'Subscription Name'}
                  handleChange={handleChange}
                />
              </div>

              <div className='col-12'>
                <TextArea
                  rows={4}
                  name={'description'}
                  type={'text'}
                  value={state.description}
                  placeholder={'Description'}
                  handleChange={handleChange}
                />
              </div>

            </div>

            <div className={styles.title}>
              Price Information
            </div>

            <div className='row mb-5'>

              <div className='col-12'>
                <Select
                  lang={lang}
                  title={'Price Available in Country'}
                  options={countries}
                  name={'country'}
                  handleChange={handleChangeSelect}
                  value={state.country}
                />
              </div>

              <div className='col-4'>
                <Input
                  name={'unit_amount'}
                  type={'number'}
                  value={state.unit_amount}
                  label={'Price'}
                  handleChange={handleChange}
                />
              </div>

              <div className='col-4'>
                <Input
                  name={'oldPrice'}
                  type={'number'}
                  value={state.oldPrice}
                  label={'Price Before Discount'}
                  handleChange={handleChange}
                />
              </div>

              <div className='col-4'>
                <Select
                  lang={lang}
                  title={'Choose Currency'}
                  options={currencies}
                  name={'currency'}
                  handleChange={handleChangeSelect}
                  value={state.currency}
                />
              </div>

              <div className='col-6'>
                <Select
                  lang={lang}
                  title={'Billing Period'}
                  options={intervals}
                  name={'interval'}
                  handleChange={handleChangeSelect}
                  value={state.interval}
                />
              </div>

              <div className='col-6'>
                <Input
                  name={'interval_count'}
                  type={'number'}
                  value={state.interval_count}
                  label={'Billing Interval'}
                  handleChange={handleChange}
                />
              </div>

            </div>

            <div className={styles.title}>
              Additional Information
            </div>

            <div className='row'>

              <div className='col-12'>
                <TextEditor
                  placeholder={'Description'}
                  handleEditor={handleEditor}
                  handleEditorHtml={handleEditorHtml}
                  descriptionHtml={state.additionalDescriptionHtml}
                />
              </div>

            </div>

          </div> :
          <BasicSpinner />
      }

    </div>

  )

}

export default AdminSettingsSubscriptionsPopUp