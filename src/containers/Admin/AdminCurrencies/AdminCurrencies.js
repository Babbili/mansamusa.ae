import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../firebase/config'
import AppContext from '../../../components/AppContext'
import AdminCurrencyItem from './AdminCurrencyItem/AdminCurrencyItem'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import AddNewCurrency from './AddNewCurrency/AddNewCurrency'
import BasicSpinner from '../../../components/UI/BasicSpinner/BasicSpinner'

import styles from './AdminCurrencies.module.scss'


const AdminCurrencies = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [currencies, setCurrencies] = useState([])
  const [newCurrency, setNewCurrency] = useState(null)

  useEffect(() => {
    return firestore.collection('currencies')
    .onSnapshot(snapshot => {
      let currencies = []
      snapshot.forEach(doc => {
        currencies = [...currencies, {id: doc.id, ...doc.data()}]
      })
      setCurrencies(currencies)
    })
  }, [])

  const handleChange = (event) => {
    const { value, name } = event.target
    setNewCurrency({
      ...newCurrency,
      currency: {
        ...newCurrency.currency,
        [name]: value
      }
    })
  }

  const handleNewCurrency = () => {
    setNewCurrency({
      currency: {code: '', symbol: ''}
    })
  }

  const handleAddCurrency = () => {
    firestore.collection('currencies')
    .add({
      currency: newCurrency.currency
    })
    .then(() => {
      setNewCurrency(null)
    })
  }

  const handleUpdateCurrency = id => {
    firestore.collection('currencies').doc(id)
    .update({
      currency: newCurrency.currency
    })
    .then(() => {
      setNewCurrency(null)
    })
  }

  const handleEditCurrency = item => {
    setNewCurrency(item)
  }

  const handleRemoveCurrency = id => {
    firestore.collection('currencies')
    .doc(id).delete().then(() => {})
  }

  const handleCancel = () => {
    setNewCurrency(null)
  }


  return(

    <div className={styles.AdminCurrencies}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Currencies
      </div>

      {
        currencies.length > 0 ?
          <div className='container-fluid'>

            <div className={`${styles.dashboard} row`}>

              {
                currencies.map((item, index) => (
                  <AdminCurrencyItem
                    key={index}
                    item={item}
                    handleEditCurrency={handleEditCurrency}
                    handleRemoveCurrency={handleRemoveCurrency}
                  />
                ))
              }

            </div>

            {
              newCurrency !== null ?
                <AddNewCurrency
                  item={newCurrency}
                  handleChange={handleChange}
                  handleCancel={handleCancel}
                  handleAddCurrency={handleAddCurrency}
                  handleUpdateCurrency={handleUpdateCurrency}
                /> : null
            }

            <div className='row'>
              <div className='col-lg-4 col-12'>
                <SignUpButton
                  type={'custom'}
                  title={'Add New Currency'}
                  onClick={handleNewCurrency}
                  disabled={false}
                />
              </div>
            </div>

          </div> : <BasicSpinner />
      }

    </div>

  )

}

export default AdminCurrencies
