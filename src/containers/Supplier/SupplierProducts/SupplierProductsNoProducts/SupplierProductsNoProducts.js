import React from 'react'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import styles from './SupplierProductsNoProducts.module.scss'
import noProducts from '../../../../assets/nodata.jpg'


const SupplierProductsNoProducts = props => {

  let { t } = useTranslation()

  return(

    <div className={`${styles.SupplierProductsNoProducts} container-fluid`}>
      <div className='row'>
        <div className='col-12 text-center'>
          <img src={noProducts} alt={'No products yet'} />
          <h3>
            { t('yourProductsWillShowHere.label') }
          </h3>
          <div className={styles.description}>
            { t('yourProductsWillShowHereWide.label') }
          </div>
        </div>
      </div>
      <div className='row mt-4 justify-content-center'>
        <div className='col-6'>
          <SignUpButton
            title={ t('addYourFirstProduct.label') }
            type={'custom'}
            onClick={() => {
              props.history.push({
                pathname: '/supplier/products/add-new',
                params: {
                  title: t('addYourFirstProduct.label')
                }
              })
            }}
            disabled={false}
          />
        </div>
      </div>
    </div>

  )

}

export default SupplierProductsNoProducts
