import React, { useContext } from 'react'
import AppContext from '../../components/AppContext'
import CartItem from './CartItem/CartItem'
import CartSidebar from './CartSidebar/CartSidebar'

import styles from './Cart.module.scss'


const Cart = props => {

  const context = useContext(AppContext)
  let { lang, cart, handleIncreaseQuantity, handleDecreaseQuantity, handleRemoveItem } = context
  let path = ['Home', 'Cart']

  const handleIncrease = item => {
    handleIncreaseQuantity(item)
  }

  const handleDecrease = item => {
    handleDecreaseQuantity(item)
  }

  const handleRemove = item => {
    handleRemoveItem(item)
  }


  return(

    <>

      <div className={`${styles.Cart} bd__container`}>

          <div className='col-12 mb-4'>
            <div className={styles.title}>
              Shopping Cart {`${cart.length > 0 ? `(${cart.length})` : ''}`}
            </div>
          </div>

          <div className='col-lg-8 col-12'>

            <table>

              <thead>
              <tr>
                <th scope="col">Products</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col"/>
              </tr>
              </thead>

              <tbody>

              {
                cart.length > 0 ?
                  cart.map((item, index) => (
                    <CartItem
                      key={index}
                      lang={lang}
                      item={item}
                      handleRemove={handleRemove}
                      handleIncrease={handleIncrease}
                      handleDecrease={handleDecrease}
                    />
                  )) : null
              }

              </tbody>

            </table>

          </div>

          <div className='col-lg-8 col-12'>

            <CartSidebar cart={'cart'} {...props} />

          </div>
  

        <div className='col-12'>
          <div style={{height: '100px'}} />
        </div>

      </div>

    </>

  )

}

export default Cart
