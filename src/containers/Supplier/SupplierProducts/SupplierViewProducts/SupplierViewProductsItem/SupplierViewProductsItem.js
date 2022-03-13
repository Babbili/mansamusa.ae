import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../components/AppContext'
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
                    Status: { typeof product.status === 'object' ? product.status[lang] : product.status }
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z"></path><path d="M11 7h2v7h-2zm0 8h2v2h-2z"></path></svg>
                      <span>
                      { errNumber } { t('errors.label') }
                    </span>
                    </div>
                  </div> :
                  <div className={styles.attentionWrapper}>
                    <div className={styles.ready}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M14.829 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.042 6.042 0 0 0 2.415 0 5.972 5.972 0 0 0 2.148-.903c.313-.212.612-.458.886-.731.272-.271.52-.571.734-.889l-1.658-1.119a4.017 4.017 0 0 1-.489.592z"></path><circle cx="8.5" cy="10.5" r="1.5"></circle><circle cx="15.493" cy="10.493" r="1.493"></circle></svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
                  <span>Edit</span>
                </div>

                <div
                  className={styles.btn}
                  onClick={() => {
                    handleRemove(product.id)
                    scrollToTop(0, 'smooth')
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
                  <span>Remove</span>
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
