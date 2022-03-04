import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../../firebase/config'
import AppContext from '../../../../../components/AppContext'

import styles from './AdminSettingsSubscriptionsFilter.module.scss'


const AdminSettingsSubscriptionsFilter = ({ filter, handleFilter }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const [items, setItems] = useState(null)

  useEffect(() => {

    firestore.collection('countriesList')
    .orderBy('title.en', 'asc')
    .onSnapshot(snap => {
      let items = []
      snap.forEach(doc => {
        items = [...items, {id: doc.id, ...doc.data()}]
      })
      setItems(items)
    })

  }, [])


  return(

    items !== null ?
    <div className={styles.AdminSettingsSubscriptionsFilter}>

      <div className={styles.title}>
        {
          lang !== 'ar' ? 'Filter subscriptions by countries' : 'تصفية الاشتراكات حسب المناطق'
        }
      </div>

      <div
        className={`${styles.item} ${filter === null ? styles.current : ''}`}
        onClick={() => handleFilter(null)}
      >
        <span>
          { lang !== 'ar' ? 'All' : 'الجميع' }
        </span>
      </div>

      {
        items.length > 0 ?
          items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleFilter(item.title.en)}
              className={`${styles.item} ${filter === item.title.en ? styles.current : ''}`}
            >
              <span>
                { item.title[lang] }
              </span>
            </div>
          )) : null
      }

    </div> : null

  )

}

export default AdminSettingsSubscriptionsFilter