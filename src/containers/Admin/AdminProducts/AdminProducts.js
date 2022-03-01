import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
import AdminViewProducts from './AdminViewProducts/AdminViewProducts'
import AdminProductCharacteristics from './AdminProductCharacteristics/AdminProductCharacteristics'
import AdminProductCategories from './AdminProductCategories/AdminProductCategories'
import BreadCrumbsAdmin from '../../../components/UI/BreadCrumbsAdmin/BreadCrumbsAdmin'

import styles from './AdminProducts.module.scss'


const AdminProducts = props => {

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

    <div className={styles.AdminProducts}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { title[lang] }
      </div>

      {/*<Redirect to={`${path}/view-products`} />*/}

      {
        bc.length > 0 ?
          <BreadCrumbsAdmin bc={bc} {...props} /> : null
      }

      <Switch>

        <Route path={`${path}/view-products`} render={props => <AdminViewProducts {...props} /> } />

        <Route path={`${path}/characteristics`} render={props => <AdminProductCharacteristics {...props} /> } />

        <Route
          path={`${path}/categories`}
          render={props =>
            <AdminProductCategories
              bc={bc}
              url={url}
              setBc={setBc}
              {...props}
            />
          }
        />

      </Switch>

    </div>

  )

}

export default AdminProducts
