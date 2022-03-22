import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../../../components/AppContext'
import Input from '../../../components/UI/Input/Input'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import CheckoutLogIn from '../../CheckoutLogIn/CheckoutLogIn'

import styles from './CartSidebar.module.scss'
import { scrollToTop } from '../../../utils/utils'
import { useTranslation } from 'react-i18next'


const CartSidebar = props => {
  const { t } = useTranslation()


  const context = useContext(AppContext)
  const { currentUser, cart } = context

  const [state, setState] = useState({
    coupon: '',
    isLogin: false,
    total: 0,
    delivery: 0
  })

  useEffect(() => {

    if (cart.length > 0) {

      let total = cart.reduce((a, b) =>{
        if(b.price > 100) {
         return (a + (b.quantity * b.price * 1.1))
        } else {
         return (a + (b.quantity * (b.price + 10)))
        }
      }, 0)

      setState(prevState => {
        return {
          ...prevState,
          total
        }
      })

    } else {

      setState(prevState => {
        return {
          ...prevState,
          total: 0
        }
      })

    }

  }, [cart])

  const handleChange = event => {

    let { name, value } = event.target

    setState({
      ...state,
      [name]: value
    })

  }

  const checkout = () => {

    scrollToTop(0, 'smooth')

    if (currentUser !== null) {
      props.history.push('/checkout')
    } else {
      setState({
        ...state,
        isLogin: true
      })
    }

  }

  return(

    <div className={styles.CartSidebar}>

      {
        state.isLogin ?
          <div className={styles.login}>
            <CheckoutLogIn {...props} checkout={true} />
          </div> : null
      }

      <div className='col-12'>
        <Input
          name='coupon'
          type='text'
          label={'Have a discount coupon?'}
          value={state.coupon}
          handleChange={handleChange}
        />
      </div>

      <div style={{ fontSize: '.8rem' }} className='col-12 mb-4'>
        {t('cartCouponDesc.label')}
        <p style={{ fontSize: '.8rem', padding: '1.2rem 0rem'  }}>{t('feesNote.label')}</p>
      </div>
      

      <div className='col-12'>
        <div className={styles.row}>
          <div className={styles.left}>
            {t('totalItems.label')}
          </div>
          <div className={styles.right}>
          { Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(state.total) }
          </div>
        </div>
      </div>

      {/* {
        props.cart === 'cart' ? null :
          <div className='col-12'>
            <div className={styles.row}>

              <div className={styles.left}>
                Delivery
              </div>
              <div className={styles.right}>
                <small>AED</small> { state.delivery }
              </div>
            </div>
          </div>
      } */}

      <div className='col-12'>

        <div className={styles.footerWrapper}>

          <div className={styles.total}>
            <div className={styles.left}>
              {t('total.label')}
            </div>
            <div className={styles.right}>
            { Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(state.total) }
            </div>
          </div>

          <SignUpButton
            title={t('checkout.label')}
            type={'custom'}
            onClick={() => checkout()}
            disabled={false}
            isWide={true}
          />

        </div>

      </div>

    </div>

  )

}

export default CartSidebar
