import React, {useContext, useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
      <FontAwesomeIcon icon="heart" fixedWidth onClick={() => handleAddWishlistItem(product)} />
    </div>

  )

}

export default AddToFavourites
