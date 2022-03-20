import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../../AppContext'

import styles from './AddToFavourites.module.scss'


const AddToFavourites = ({ product }) => {

  const context = useContext(AppContext)
  const { wishlist, handleAddWishlistItem } = context
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {

    if (wishlist.length > 0) {
      let check = wishlist.some(s => s.id === product.id)
      setIsAdded(check)
    }

  }, [wishlist, product])

  return(

    <div className={`${styles.AddToFavourites} ${isAdded ? styles.active : ''}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" onClick={() => handleAddWishlistItem(product)}><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>
    </div>

  )

}

export default AddToFavourites
