import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../firebase/config'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import AdminSettingsSubscriptionsItem from './AdminSettingsSubscriptionsItem/AdminSettingsSubscriptionsItem'
import AdminSettingsSubscriptionsFilter from './AdminSettingsSubscriptionsFilter/AdminSettingsSubscriptionsFilter'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import styles from './AdminSettingsSubscriptions.module.scss'
import AdminSettingsSubscriptionsPopUp from './AdminSettingsSubscriptionsPopUp/AdminSettingsSubscriptionsPopUp'
import AppContext from '../../../../components/AppContext'


const AdminSettingsSubscriptions = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [items, setItems] = useState(null)
  const [filter, setFilter] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  useEffect(() => {

    return firestore.collection('suppliersSubscriptions')
      .onSnapshot(snap => {
        let subs = []
        snap.forEach(doc => {
          subs = [...subs, {id: doc.id, ...doc.data()}]
        })
        setItems(subs)
      })

  }, [])

  const handleFilter = country => {

    setItems(null)
    setFilter(country)

    if (country === null) {
      firestore.collection('suppliersSubscriptions')
        .get()
        .then(snap => {
          let items = []
          snap.forEach(doc => {
            items = [...items, {id: doc.id, ...doc.data()}]
          })
          setItems(items)
        })
    } else {
      firestore.collection('suppliersSubscriptions')
        .where('country.en', '==', country)
        .get()
        .then(snap => {
          let items = []
          snap.forEach(doc => {
            items = [...items, {id: doc.id, ...doc.data()}]
          })
          setItems(items)
        })
    }

  }

  const handleAdd = () => {
    setIsOpen(true)
  }

  const handleEdit = item => {
    setIsOpen(true)
    setCurrentItem(item)
  }

  const handleRemove = item => {
    firestore.collection('suppliersSubscriptions')
      .doc(item.id)
      .delete()
      .then(() => {})
  }

  const handleClose = () => {
    setIsOpen(false)
    setCurrentItem(null)
  }


  return(

    <div className={styles.AdminSettingsSubscriptions}>

      {
        isOpen ?
          <AdminSettingsSubscriptionsPopUp
            lang={lang}
            item={currentItem}
            handleClose={handleClose}
          /> : null
      }

      <div className='container-fluid'>

        <div className={`${styles.subscriptions} row mb-4`}>

          <div className='col-12'>

            <AdminSettingsSubscriptionsFilter
              filter={filter}
              handleFilter={handleFilter}
            />

          </div>

        </div>

        <div className={`${styles.subscriptions} row`}>

          {
            items !== null ?
              items.length > 0 ?
                items.map((item, index) => (
                  <AdminSettingsSubscriptionsItem
                    key={index}
                    item={item}
                    handleEdit={handleEdit}
                    handleRemove={handleRemove}
                  />
                )) :
                <div className='col-12 my-5'>
                  No Subscriptions Yet
                </div>:
              <div className='col-12 py-5 my-5'>
                <BasicSpinner />
              </div>
          }

        </div>

        <div className='row'>
          <div className='col-lg-4 col-12'>
            {/* <SignUpButton
              type={'custom'}
              title={'Add New Subscription'}
              onClick={handleAdd}
              disabled={false}
            /> */}
          </div>
        </div>

      </div>

    </div>

  )

}

export default AdminSettingsSubscriptions