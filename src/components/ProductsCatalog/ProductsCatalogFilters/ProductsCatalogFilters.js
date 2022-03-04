import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import CategoryFilter from './CategoryFilter/CategoryFilter'

import styles from './ProductsCatalogFilters.module.scss'


const ProductsCatalogFilters = ({ handleFilters }) => {

  let { pathname } = useLocation()
  let { category } = useParams()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    setCategories(pathname.split('/').splice(3))
  }, [pathname])

  return(

    <div className={`${styles.ProductsCatalogFilters} row`}>
      <div className='col-12 mb-5'>
        <h5>Filter By</h5>
      </div>
      <CategoryFilter
        category={category}
        categories={categories}
        handleFilters={handleFilters}
      />
    </div>

  )

}

export default ProductsCatalogFilters
