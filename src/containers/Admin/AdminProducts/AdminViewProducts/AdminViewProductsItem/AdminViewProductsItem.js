import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AppContext from '../../../../../components/AppContext'
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg>
                        <span>
                      { errNumber } { t('errors.label') }
                    </span>
                      </div>
                    </div> :
                    <div className={styles.attentionWrapper}>
                      <div className={styles.ready}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M14.829 14.828a4.055 4.055 0 0 1-1.272.858 4.002 4.002 0 0 1-4.875-1.45l-1.658 1.119a6.063 6.063 0 0 0 1.621 1.62 5.963 5.963 0 0 0 2.148.903 6.042 6.042 0 0 0 2.415 0 5.972 5.972 0 0 0 2.148-.903c.313-.212.612-.458.886-.731.272-.271.52-.571.734-.889l-1.658-1.119a4.017 4.017 0 0 1-.489.592z"></path><circle cx="8.5" cy="10.5" r="1.5"></circle><circle cx="15.493" cy="10.493" r="1.493"></circle></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="hsl(138, 73%, 58%)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z"></path></svg>
                        <span>{ t('approve.label') }</span>
                      </div> : null
                  }

                  {
                    product.isApproved ?
                      <div
                        className={styles.btn}
                        onClick={() => handleBlock(product.id, !product.isBlocked)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-1.846.634-3.542 1.688-4.897l11.209 11.209A7.946 7.946 0 0 1 12 20c-4.411 0-8-3.589-8-8zm14.312 4.897L7.103 5.688A7.948 7.948 0 0 1 12 4c4.411 0 8 3.589 8 8a7.954 7.954 0 0 1-1.688 4.897z"></path></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm-5 10.5A1.5 1.5 0 0 1 9.5 14c-.086 0-.168-.011-.25-.025-.083.01-.164.025-.25.025a2 2 0 1 1 2-2c0 .085-.015.167-.025.25.013.082.025.164.025.25zm4 1.5c-.086 0-.167-.015-.25-.025a1.471 1.471 0 0 1-.25.025 1.5 1.5 0 0 1-1.5-1.5c0-.085.012-.168.025-.25-.01-.083-.025-.164-.025-.25a2 2 0 1 1 2 2z"></path></svg>
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
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--text-color)"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7z"></path></svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--text-color)"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
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
