import React, { useContext } from 'react'
import ProductItem from '../../ProductItem/ProductItem'
import BasicSpinner from '../../UI/BasicSpinner/BasicSpinner'
import AppContext from '../../AppContext'

import styles from './ProductsCatalogBody.module.scss'


const ProductsCatalogBody = ({ category, products, isFiltering }) => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <div className={`${styles.ProductsCatalogBody} row`}>
      <div className='col-12 mb-5'>
        <h5>{ category.title[lang] }</h5>
      </div>
      <div className='col-12'>
        <div className='row'>
          {
            isFiltering ?
              <BasicSpinner /> :
              products.map((product, index) => (
                <ProductItem
                  mb={'mb-5'}
                  key={index}
                  product={product}
                />
              ))
          }
        </div>
      </div>
    </div>

  )

}

export default ProductsCatalogBody
