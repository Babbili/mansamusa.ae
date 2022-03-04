import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../components/AppContext'
import ProductItem from '../../components/ProductItem/ProductItem'

import styles from './WishList.module.scss'


const WishList = props => {

  const context = useContext(AppContext)
  const { wishlist } = context
  let path = ['Home', 'Wishlist']
  const [products, setProducts] = useState([])

  useEffect(() => {

    let stores = []
    let products = []

    if (wishlist.length > 0) {
      stores = wishlist.map(m => {
        return {
          store: m.storeName
        }
      })

      let merged = Array.from(new Set(stores.map(a => a.store)))
      .map(id => {
        return stores.find(a => a.store === id)
      })

      products = merged.map(m => {

        return {
          ...m,
          items: wishlist.filter(f => f.storeName === m.store)
        }

      })
      setProducts(products)
    }

  }, [wishlist])

  return(

    <div className={`${styles.WishList} bd__container`}>

        
          <div className={styles.title}>
            Wishlist <span>Need Help?</span>
          </div>
        

        <div className={styles.wishlist__products}>

          {
            products.length > 0 ?
              products.map((m, i) => (

                <div key={i} className={styles.wishlist__product}>
                  <h5>{ m.store }</h5>
                  {
                    m.items.map((item, i) => (
                      <ProductItem
                        key={i}
                        product={item}
                      />
                    ))
                  }
                </div>

              )) : null
          }
        </div>
    </div>

  )

}

export default WishList
