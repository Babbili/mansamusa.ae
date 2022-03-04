import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../AppContext'
import SignUpButton from '../SignUpButton/SignUpButton'
import { toSlug } from '../../utils/toSlug'
import { Link } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './PopUpShoppingCart.module.scss'


const PopUpShoppingCart = props => {

  const context = useContext(AppContext)
  const { cart, lang } = context
  const [total, setTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let total = cart.reduce((a, b) => a + (b.quantity * b.price), 0)
    setTotal(total)
  }, [cart])

  useEffect(() => {
    setIsOpen(cart.reduce((a, b) => a + b.quantity, 0) === 1)
    setTimeout(() => {
      setIsOpen(false)
    }, 2000)
  }, [cart])


  return(

    cart.length > 0 ?
    <ul
      className={`${styles.PopUpShoppingCart}`}
      style={{
        // visibility: isOpen ? 'visible' : '',
        // opacity: isOpen ? '1' : '0'
      }}
    >

      <li>
        <span>
          My Shopping Cart
        </span>
      </li>

      <div className={styles.wrapper}>

        {
          cart.map((item, index) => {

            let url = '/details' + toSlug(item.name.en) + '-' + item.id

            return(

              <li key={index}>
                <Link to={url}>

                  {
                    item.offerImages !== undefined && item.offerImages.length > 0 ?
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
              </li>

            )

          })
        }

      </div>

      <li>
        <span>
          <div className={styles.footerWrapper}>

            <div className={styles.total}>
              <div className={styles.left}>
                Total <small>Taxes Included</small>
              </div>
              <div className={styles.right}>
                <small>AED</small> { total }
              </div>
            </div>

            <Link to={'/cart'}>
              <SignUpButton
                title={'Go to cart'}
                type={'custom'}
                onClick={() => setIsOpen(false)}
                disabled={false}
              />
            </Link>

          </div>
        </span>
      </li>

      {/*<FontAwesomeIcon icon="key" fixedWidth />*/}
    </ul> : null

  )

}

export default PopUpShoppingCart
