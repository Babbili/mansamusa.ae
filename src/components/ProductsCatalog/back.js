import React, { useCallback, useEffect, useState } from 'react'
import { titleCase } from '../utils/titleCase'
import { firestore } from '../../firebase/config'
import ProductsCatalogBody from './ProductsCatalogBody/ProductsCatalogBody'
import ProductsCatalogFilters from './ProductsCatalogFilters/ProductsCatalogFilters'

import styles from './ProductsCatalog.module.scss'


const ProductsCatalog1 = ({ category, categories }) => {

  const [products, setProducts] = useState([])

  const [filteredProducts, setFilteredProducts] = useState([])

  const [filters, setFilters] = useState([])

  const handleFilters = (filter) => {

    if (filters.length > 0) {

      return filters.some(f => f.categories === filter) ?
        setFilters(filters.filter(f => f.categories !== filter)) :
        setFilters(prevState => {
          return [...prevState, {categories: filter}]
        })

    } else {

      setFilters(prevState => {
        return [...prevState, {categories: filter}]
      })

    }

  }

  const getProducts = useCallback((initialQuery, categories, index) => {

    let currentIndex = index === categories.length - 1 ? categories.length - 1 : index

    let currentQuery = initialQuery
    .where(`categoryPicker.productCats.${titleCase(categories[currentIndex])}`, '==', true)

    if (index < categories.length - 1) {
      currentIndex = currentIndex + 1
      getProducts(currentQuery, categories, currentIndex)
    }

    if (index === categories.length - 1) {

      currentQuery
      .get().then(querySnapshot => {
        let products = []
        querySnapshot.forEach(doc => {
          products = [...products, {id: doc.id, ...doc.data()}]
        })
        setProducts(products)
      })

    }

  }, [])

  const getFilteredProducts = useCallback((initialQuery, categories, index) => {

    let currentIndex = index === categories.length - 1 ? categories.length - 1 : index

    let currentQuery = initialQuery
    .where(`categoryPicker.productCats.${categories[currentIndex]}`, '==', true)

    if (index < categories.length - 1) {
      currentIndex = currentIndex + 1
      getFilteredProducts(currentQuery, categories, currentIndex)
    }

    if (index === categories.length - 1) {

      currentQuery
      .get().then(querySnapshot => {
        let products = []
        querySnapshot.forEach(doc => {
          products = [...products, {id: doc.id, ...doc.data()}]
        })
        console.log('products', products)
        setFilteredProducts(prevState => {
          return [...prevState, ...products]
        })
      })

    }

  }, [])

  useEffect(() => {

    let index = 0
    let initialQuery = firestore.collection('products')

    return getProducts(initialQuery, categories, index)

  }, [categories, getProducts])

  useEffect(() => {

    let index = 0
    let initialQuery = firestore.collection('products')

    setFilteredProducts([])

    filters.map(filter => (
      getFilteredProducts(initialQuery, filter.categories, index)
    ))

  }, [filters, getFilteredProducts])


  return(

    <div className={`${styles.ProductsCatalog}`}>
      <div className='row'>
        <div className='col-12'>
          <div className='row'>
            <div className='col-3'>
              <ProductsCatalogFilters
                category={category}
                handleFilters={handleFilters}
              />
            </div>
            <div className='col-9'>
              <ProductsCatalogBody
                category={category}
                isFiltering={filteredProducts.length === 0 && filters.length > 0}
                products={filteredProducts.length > 0 ? filteredProducts : products}
              />
            </div>
          </div>
        </div>
      </div>
    </div>

  )

}

export default ProductsCatalog1
