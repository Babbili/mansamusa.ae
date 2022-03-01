import React, { useContext } from 'react'
import AppContext from '../../AppContext'

import styles from './Steps.module.scss'
import delivery from '../../../assets/deliveryNew.png'
import payment from '../../../assets/payment.png'
import order from '../../../assets/order.png'


const Steps = ({ index }) => {

  const context = useContext(AppContext)
  const { lang, isMobile } = context

  const tabs = [
    {
      title: {
        en: 'Delivery',
        ar: 'توصيل'
      },
      icon: delivery
    },
    {
      title: {
        en: 'Payment',
        ar: 'دفع'
      },
      icon: payment
    },
    {
      title: {
        en: 'Order',
        ar: 'ترتيب'
      },
      icon: order
    }
  ]

  return(

    <div className={styles.Steps}>
      <div className={styles.wrapper}>

        {
          tabs.map((tab, i) => {

            return(

              <div
                key={i}
                className={`${styles.tab} ${i === index ? styles.active : ''} ${i < index ? styles.prev : ''} ${lang !== 'en' ? styles.ar : ''}`}
                // style={{
                //   display: isMobile && index !== i ? 'none' : ''
                // }}
              >
                <img src={tab.icon} alt={tab.title.en} />
                <div style={{minWidth: '5px'}} />
                { tab.title[lang] }
              </div>

            )

          })
        }

      </div>
    </div>

  )

}

export default Steps