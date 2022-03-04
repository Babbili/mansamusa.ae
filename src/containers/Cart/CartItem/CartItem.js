import React from 'react'

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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 11h14v2H5z"></path></svg>
          </div>
          { item.quantity }
          <div className={styles.btn} onClick={() => handleIncrease(item)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
        </div>
      </td>

    </tr>

  )

}

export default CartItem
