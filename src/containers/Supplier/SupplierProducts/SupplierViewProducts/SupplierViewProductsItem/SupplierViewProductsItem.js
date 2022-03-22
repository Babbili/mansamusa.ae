import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { productValidation } from '../utils/utils'
import Separator from '../../../../../components/UI/Separator/Separator'
import AdminViewProductsItemOffers from './AdminViewProductsItemOffers/AdminViewProductsItemOffers'
import AdminViewProductsItemErrors from './AdminViewProductsItemErrors/AdminViewProductsItemErrors'
import AdminViewProductsItemDetails from './AdminViewProductsItemDetails/AdminViewProductsItemDetails'
import { scrollToTop } from '../../../../../utils/utils'
import styles from './SupplierViewProductsItem.module.scss'


const SupplierViewProductsItem = ({ products, handleEdit, handleRemove }) => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context
  let { t } = useTranslation()

  const [isToggle, setIsToggle] = useState({})

  const handleToggle = index => {

    setIsToggle(prevState => {
      return {
        ...prevState,
        [index]: !prevState[index]
      }
    })

  }


  return(

    products.length > 0 ?
    products.map((product, index) => {

      let validationObj = productValidation(product)
      let errNumber = Object.values(validationObj).filter(f => f !== undefined).length
      let errors = Object.values(validationObj).filter(f => f !== undefined)

      return(

        <div
          key={index}
          className={`${styles.AdminViewProductsItem} col-12 mb-4`}
        >

          <div className={styles.wrapper}>

            <div className={styles.display}>

              <div
                className={styles.left}
                onClick={() => handleToggle(index)}
              >
                <div
                  className={styles.image}
                  style={{
                    backgroundImage: `url(${product.productImages.length > 0 ? product.productImages[0].url : ''})`
                  }}
                />

                {
                  isMobile ?
                    <div style={{width: '10px'}} /> : null
                }

                <div className={styles.titleWrapper}>
                  <h3>{ product.productName[lang] }</h3>
                  <div className={styles.description}>
                    {t('status.label')}: { typeof product.status === 'object' ? product.status[lang] : product.status }
                  </div>
                </div>
              </div>

              {
                errNumber > 0 ?
                  <div
                    className={styles.attentionWrapper}
                    onClick={() => {
                      if (errNumber > 0) {
                        handleToggle(index)
                      }
                    }}
                  >
                    <div className={styles.attention}>
                      <FontAwesomeIcon icon='exclamation-triangle' fixedWidth />
                      <span>
                      { errNumber } { t('errors.label') }
                    </span>
                    </div>
                  </div> :
                  <div className={styles.attentionWrapper}>
                    <div className={styles.ready}>
                      <FontAwesomeIcon icon='smile' fixedWidth />
                      <span>
                        {
                          product.isApproved ?
                            t('approved.label') : 'Your product will be approved shortly'
                        }
                      </span>
                    </div>
                  </div>
              }

              <div className={styles.btnWrapper}>

                <div
                  className={styles.btn}
                  onClick={() => {
                    handleEdit(product.id)
                    scrollToTop(0, 'smooth')
                  }}
                >
                  <FontAwesomeIcon icon='edit' fixedWidth />
                  <span>{ t('edit.label')}</span>
                </div>

                <div
                  className={styles.btn}
                  onClick={() => {
                    handleRemove(product.id)
                    scrollToTop(0, 'smooth')
                  }}
                >
                  <FontAwesomeIcon icon='trash' fixedWidth />
                  <span>{ t('delete.label')}</span>
                </div>

              </div>

            </div>

            {
              isToggle[index] ?
                <Separator color={'#ccc'} /> : null
            }

            {
              isToggle[index] ?
                <div className={styles.view}>

                  {
                    errNumber > 0 ?
                      <AdminViewProductsItemErrors
                        lang={lang}
                        errors={errors}
                      /> : null
                  }

                  <div className={styles.dashboard}>

                    <div className={`${styles.details} row`}>

                      <AdminViewProductsItemDetails
                        lang={lang}
                        product={product}
                      />

                      {
                        product.offers.length > 0 ?
                          <AdminViewProductsItemOffers
                            offers={product.offers}
                            discount={product.discount}
                            price={product.productPrice}
                            isDiscount={product.isDiscount}
                          /> : null
                      }

                    </div>

                  </div>

                </div> : null
            }

          </div>

        </div>

      )

    }) :
      <div className={`${styles.AdminViewProductsItem} col-12 my-5`}>
        <h5>{ t('noProductsToShow.label') }</h5>
        <p>{ t('useFiltersAboveToSearchTheProducts.label') }</p>
      </div>

  )

}

export default SupplierViewProductsItem
