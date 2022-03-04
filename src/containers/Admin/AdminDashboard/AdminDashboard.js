import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import DashboardWidget from '../../../components/UI/Dashboard/DashboardWidget/DashboardWidget'
import { firestore } from '../../../firebase/config'
import moment from 'moment'

import styles from './AdminDashboard.module.scss'


const AdminDashboard = props => {

  const context = useContext(AppContext)
  let { lang } = context

  const [state, setState] = useState({
    orders: 0,
    pending: 0,
    revenue: 0,
    sales: 0,
    customers: 0,
    suppliers: 0
  })

  useEffect(() => {

    const getData = async () => {

      const orders = await firestore.collectionGroup('orders')
      .get()
      .then(snap => {
        let docs = []
        snap.forEach(doc => {
          docs = [...docs, doc.data()]
        })
        return docs
      })

      const users = await firestore.collection('users')
      .get()
      .then(snap => {
        let docs = []
        snap.forEach(doc => {
          docs = [...docs, doc.data()]
        })
        return docs
      })

      return {
        orders,
        users
      }

    }

    getData()
    .then(data => {

      let now = moment()
      let startDate = moment(now).startOf('day').unix()
      let endDate = moment(now).endOf('day').unix()

      let orders = data.orders.length
      let pending = data.orders.filter(f => !f.isDelivered && !f.isCanceled).length
      let revenue = data.orders.filter(f => !f.isCanceled).reduce((a, b) => a + b.total, 0)
      let sales = data.orders.filter(f => f.createdAt >= startDate && f.createdAt <= endDate).length

      let customers = data.users.filter(f => f.type === 'customer').length
      let suppliers = data.users.filter(f => f.type === 'supplier').length

      return {
        orders,
        pending,
        revenue,
        sales,
        customers,
        suppliers
      }

    })
    .then(data => {
      setState(data)
    })

  }, [])


  return(

    <div className={styles.AdminDashboard}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Admin Dashboard
      </div>

      <div className='container-fluid'>

        <div className={`${styles.dashboard} row`}>

          <DashboardWidget
            link={''}
            title={'Orders'}
            description={'Total number of orders'}
            number={state.orders}
            optionTitle={''}
            optionValue={''}
          />

          <DashboardWidget
            link={''}
            title={'Pending'}
            description={'Pending orders'}
            number={state.pending}
            optionTitle={''}
            optionValue={''}
          />

          <DashboardWidget
            link={''}
            title={'Revenue'}
            description={'Total income'}
            number={state.revenue}
            optionTitle={''}
            optionValue={''}
          />

          <DashboardWidget
            link={''}
            title={'Sales'}
            description={'Today\'s sales'}
            number={state.sales}
            optionTitle={''}
            optionValue={''}
          />

          <DashboardWidget
            link={''}
            title={'Customers'}
            description={'Total registered customers'}
            number={state.customers}
            optionTitle={''}
            optionValue={''}
          />

          <DashboardWidget
            link={''}
            title={'Suppliers'}
            description={'Total registered suppliers'}
            number={state.suppliers}
            optionTitle={''}
            optionValue={''}
          />

        </div>

      </div>

    </div>

  )

}

export default AdminDashboard
