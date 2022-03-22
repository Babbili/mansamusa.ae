import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './CartItem.module.scss'


const CartItem = ({ item, lang, dataLabel, handleRemove, handleIncrease, handleDecrease }) => {


  return(

    <tr>

      <td data-label={'Products'}>
        <div className={styles.CartItem}>

          {
            item.offerImages.length > 0 ?
              <div
                className={styles.img}
                style={{
                  backgroundImage: `url(${item.offerImages[0].url})`
                }}
              /> :
              <div className={styles.img}/>
          }

          <div className={styles.details}>
            <div className={styles.title}>
              { item.name[lang] }
            </div>
            <div className={styles.options}>
              {
                item.options !== undefined ?
                item.options.map((option, index) => (
                  <div key={index} className={styles.option}>
                    { option.name[lang] }: <b>{ typeof option.value === 'object' ? option.value[lang] : option.value }</b>
                  </div>
                )) : null
              }
            </div>
          </div>
        </div>
      </td>

      <td data-label={'Quantity'}>
        <div className={styles.quantity}>
          <div className={styles.btn} onClick={() => handleDecrease(item)}>
            <FontAwesomeIcon icon={'minus'} />
          </div>
          { item.quantity }
          <div className={styles.btn} onClick={() => handleIncrease(item)}>
            <FontAwesomeIcon icon={'plus'} />
          </div>
        </div>
      </td>

      <td data-label={'Price'}>
        <div className={styles.price}>
          { item.price > 100 ?
           Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((item.price)*1.1) 
           :
           Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(item.price + 10)
          }
        </div>
      </td>

      <td data-label={'Remove'}>
        <div className={styles.remove} onClick={() => handleRemove(item)}>
          <FontAwesomeIcon icon='trash' fixedWidth />
        </div>
      </td>

    </tr>

  )

}

export default CartItem
