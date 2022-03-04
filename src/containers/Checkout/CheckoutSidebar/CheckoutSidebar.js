import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../../components/AppContext'
import { toSlug } from '../../../components/utils/toSlug'

import styles from './CheckoutSidebar.module.scss'


const CheckoutSidebar = props => {

  const context = useContext(AppContext)
  const { cart, lang } = context

  const [state, setState] = useState({
    total: 0,
    fee: 0,
    feeType: 'fixed',
    feeTotal: 0,
    delivery: 0
  })

  useEffect(() => {

    if (cart.length > 0) {

      let subTotal = cart.reduce((a, b) =>{
        if(b.price > 100) {
         return (a + (b.quantity * b.price * 1.1))
        } else {
         return (a + (b.quantity * (b.price + 10)))
        }
      }, 0)
      let delivery = 0 * [...new Set(cart.map(m => m.store))].length
      let feeTotal = (subTotal + delivery) * 0
      let total = (subTotal + delivery) + feeTotal

      setState(prevState => {
        return {
          ...prevState,
          total: total.toFixed(2),
          feeTotal: feeTotal,
          delivery
        }
      })

    }

  }, [cart, state.delivery, state.fee])


  return(

    <div className={styles.CheckoutSidebar}>

      <div className='col-12 py-3'>

        <div className={styles.item}>
          <span>
            Summary
          </span>
        </div>

        {
          cart.map((item, index) => {

            let url = '/details' + toSlug(item.name.en) + '-' + item.id

            return(

              <div key={index} className={styles.item}>

                <Link to={url}>

                  {
                    item.offerImages.length > 0 ?
                      <div
                        className={styles.image}
                        style={{
                          backgroundImage: `url(${item.offerImages[0].url})`
                        }}
                      /> :
                      <div className={styles.image}/>
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

                      <div className={styles.option}>
                        Quantity: <b>{ item.quantity }</b>
                      </div>

                    </div>
                  </div>

                  <div className={styles.price}>
                    {
                      item.price > 100 ?
                      Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((item.price*1.1) * item.quantity) 
                      :
                      Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((item.price + 10 ) * item.quantity)
                    }
                  </div>

                </Link>
              </div>

            )

          })
        }

      </div>

      <div className='col-12'>

        <div className={styles.footerWrapper}>

          {
            state.fee > 0 ?
              <div className={styles.delivery}>
                <div className={styles.left}>
                  Payment Fee
                </div>

                {
                  state.feeType !== 'fixed' ?
                    <div className={styles.right}>
                      { state.fee } <small>%</small>
                    </div> :
                    <div className={styles.right}>
                      <small>AED</small> { state.fee }
                    </div>
                }

              </div> : null
          }

          <div className={styles.delivery}>
            <div className={styles.left}>
              Delivery
            </div>
            <div className={styles.right}>
              <small>AED</small> { state.delivery }
            </div>
          </div>

          <div className={styles.total}>
            <div className={styles.left}>
              Total
            </div>
            <div className={styles.right}>
              { Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(state.total) }
            </div>
          </div>

          { props.children }

        </div>

      </div>
      <small style={{ padding: '1rem' }}>*customs & duty may apply</small>

    </div>

  )

}

export default CheckoutSidebar
