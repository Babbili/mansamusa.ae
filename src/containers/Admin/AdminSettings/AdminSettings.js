import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import BreadCrumbsAdmin from '../../../components/UI/BreadCrumbsAdmin/BreadCrumbsAdmin'
import AdminSettingsSubscriptions from './AdminSettingsSubscriptions/AdminSettingsSubscriptions'

import styles from './AdminSettings.module.scss'


const AdminSettings = props => {

  const context = useContext(AppContext)
  let { lang } = context
  let { path } = useRouteMatch()
  let { params } = useLocation()

  const [bc, setBc] = useState([])
  let url = window.location.pathname
  const string = '/admin/products/categories'

  const [title, setTitle] = useState('')

  useEffect(() => {
    if (params !== undefined) {
      setTitle(params.title)
    }
  }, [params])

  useEffect(() => {
    if (!url.includes(string)) {
      setBc([])
    }
  }, [url])


  return(

    <div className={styles.AdminSettings}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Settings: { title[lang] }
      </div>

      {
        bc.length > 0 ?
          <BreadCrumbsAdmin bc={bc} {...props} /> : null
      }

      <Switch>

        <Route path={`${path}/subscriptions`} render={props => <AdminSettingsSubscriptions {...props} /> } />

      </Switch>

    </div>

  )

}

export default AdminSettings