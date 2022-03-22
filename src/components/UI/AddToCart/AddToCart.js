import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AddToCart.module.scss'


const AddToCart = ({ product }) => {

  // id: "X1MOTAS85gtS39jfOQ7O"
  // name: {ar: "بدلة بلونين جيرسي", en: "Jersey two-tone suit"}
  // offerImages: (3) [{…}, {…}, {…}]
  // options: (2) [{…}, {…}]
  // price: 850 / productPrice: 950
  // quantity: 1 / quantity: 1
  // store: "pinchme" / store: "pinchme"


  return(

    <div className={styles.AddToCart}>

      <FontAwesomeIcon icon="shopping-cart" fixedWidth />
    </div>

  )

}

export default AddToCart
