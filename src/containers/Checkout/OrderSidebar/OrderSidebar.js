import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../../components/AppContext'
import { toSlug } from '../../../components/utils/toSlug'

import styles from './OrderSidebar.module.scss'


const OrderSidebar = ({ orderId }) => {

  const context = useContext(AppContext)
  const { cart, lang } = context

  const [state, setState] = useState({
    total: 0,
    fee: 3,
    feeType: 'fixed',
    feeTotal: 0,
    delivery: 20
  })

  useEffect(() => {

    if (cart.length > 0) {

      let subTotal = cart.reduce((a, b) => a + (b.quantity * b.price), 0)
      let delivery = 20 * [...new Set(cart.map(m => m.store))].length
      let feeTotal = (subTotal + delivery) * state.fee / 100
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

    <div className={styles.OrderSidebar}>

      <div className='col-12 py-3'>

        <div className={styles.item}>
          <span>
            Order #{orderId}
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
                    AED { item.price * item.quantity }
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
              Total <small>Taxes Included</small>
            </div>
            <div className={styles.right}>
              <small>AED</small> { state.total }
            </div>
          </div>

        </div>

      </div>

    </div>

  )

}

export default OrderSidebar
