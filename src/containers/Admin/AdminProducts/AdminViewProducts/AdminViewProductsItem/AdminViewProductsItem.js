import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { productValidation } from '../../utils/utils'
import Separator from '../../../../../components/UI/Separator/Separator'
import AdminViewProductsItemOffers from './AdminViewProductsItemOffers/AdminViewProductsItemOffers'
import AdminViewProductsItemErrors from './AdminViewProductsItemErrors/AdminViewProductsItemErrors'
import AdminViewProductsItemDetails from './AdminViewProductsItemDetails/AdminViewProductsItemDetails'

import styles from './AdminViewProductsItem.module.scss'
import PopUpImageSlider from '../../../../../components/UI/PopUpImageSlider/PopUpImageSlider'


const AdminViewProductsItem = ({ products, handleBlock, handleComment, handleApprove, notifications }) => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context
  let { t } = useTranslation()

  const [isToggle, setIsToggle] = useState({})
  const [toggleImagePreview, setToggleImagePreview] = useState({})

  const handleToggle = index => {
    setIsToggle(prevState => {
      return {
        ...prevState,
        [index]: !prevState[index]
      }
    })
  }

  const handleImageToggle = index => {
    setToggleImagePreview(prevState => {
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
        let notification = notifications.filter(f => f.productId === product.id).length

        return(

          <div
            key={index}
            className={`${styles.AdminViewProductsItem} col-12 mb-4`}
          >

            <div className={styles.wrapper}>

              <div className={styles.display}>

                <div
                  className={styles.left}
                >
                  <div
                    className={styles.image}
                    style={{
                      backgroundImage: `url(${product.productImages.length > 0 ? product.productImages[0].url : ''})`
                    }}
                    onClick={() => handleImageToggle(index)}
                  />

                  {
                    isMobile ?
                      <div style={{width: '10px'}} /> : null
                  }

                  <div
                    className={styles.titleWrapper}
                    onClick={() => handleToggle(index)}
                  >
                    <h3>{ product.productName[lang] }</h3>
                    <div className={styles.description}>
                      Brand: { product.storeName }
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
                            t('approved.label') : t('readyToApprove.label')
                        }
                      </span>
                      </div>
                    </div>
                }

                <div className={styles.btnWrapper}>

                  {
                    !product.isApproved ?
                      <div
                        className={styles.btn}
                        style={{
                          cursor: errors.length > 0 ? 'not-allowed' : ''
                        }}
                        onClick={() => {
                          if (errors.length === 0) {
                            handleApprove(product.id)
                          }
                        }}
                      >
                        <FontAwesomeIcon icon='check' fixedWidth />
                        <span>{ t('approve.label') }</span>
                      </div> : null
                  }

                  {
                    product.isApproved ?
                      <div
                        className={styles.btn}
                        onClick={() => handleBlock(product.id, !product.isBlocked)}
                      >
                        <FontAwesomeIcon icon='ban' fixedWidth />
                        <span>
                            {
                              product.isBlocked ?
                                'Unblock' : 'Block'
                              // t('block.label')
                            }
                          </span>
                      </div> : null
                  }

                  <div
                    className={styles.btn}
                    onClick={() => handleComment(product.id)}
                  >
                    <FontAwesomeIcon icon='comment' fixedWidth />
                    <span>{ t('comment.label') } { notification > 0 ? ` (${notification})` : '' }</span>
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
                            /> :
                            <div className='col-12'>

                              <table>

                                <thead>
                                <tr>
                                  <th>Images</th>
                                  <th>Price</th>
                                  <th>Discount</th>
                                  <th>Quantity</th>
                                </tr>
                                </thead>

                                <tbody>
                                <tr>
                                  <td
                                    data-label={'Images'}
                                    onClick={() => {
                                      if (product.productImages.length > 0) handleImageToggle(index)
                                    }}
                                  >
                                    {
                                      product.productImages.length > 0 ?
                                        <div className={styles.offer}>
                                          <div
                                            className={styles.img}
                                            style={{
                                              backgroundImage: `url(${product.productImages[0].url})`
                                            }}
                                          />
                                        </div> :
                                        <div className={styles.offer}>
                                          <div className={styles.img}>
                                            <FontAwesomeIcon icon='image' fixedWidth />
                                          </div>
                                        </div>
                                    }
                                  </td>
                                  <td data-label={'Price'}>
                                    AED { product.productPrice }
                                  </td>
                                  <td data-label={'Discount'}>
                                    { product.isDiscount ? product.discount : '—' }
                                  </td>
                                  <td data-label={'Cycle'}>
                                    { product.productQuantity }
                                  </td>
                                </tr>
                                </tbody>

                              </table>

                            </div>
                        }

                      </div>

                    </div>

                  </div> : null
              }

              {
                toggleImagePreview[index] ?
                  <div className={styles.sliderPopUp}>
                    <div className={styles.wrapper}>
                      <div
                        className={styles.close}
                        onClick={() => handleImageToggle(index)}
                      >
                        <FontAwesomeIcon icon={'times'} fixedWidth />
                      </div>
                      <PopUpImageSlider
                        lang={lang}
                        images={product.productImages}
                      />
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

export default AdminViewProductsItem
