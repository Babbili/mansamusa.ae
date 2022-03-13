import React, { useContext, useState } from 'react'
import AppContext from '../../../../../components/AppContext'
import ProductCharacteristicPopUp from './ProductCharacteristicPopUp/ProductCharacteristicPopUp'

import styles from './ProductCharacteristics.module.scss'


const ProductCharacteristics = ({ error, text, images, offers, characteristics, handleOffer, handleRemoveOffer }) => {

  const context = useContext(AppContext)
  const { lang, currentUser } = context
  const [isShow, setIsShow] = useState(false)
  const [offerIndex, setOfferIndex] = useState(null)

  return(

    <div className='row'>

      <div className='col-12 d-flex justify-content-center'>

        <div
          className={`${styles.ProductCharacteristics} row`}
          style={{
            border: error ? '1px solid red' : ''
          }}
        >

          <div className='col-12'>

            {
              isShow ?
                <ProductCharacteristicPopUp
                  offers={offers}
                  isShow={isShow}
                  images={images}
                  uid={currentUser.uid}
                  setIsShow={setIsShow}
                  offerIndex={offerIndex}
                  handleOffer={handleOffer}
                  setOfferIndex={setOfferIndex}
                  characteristics={characteristics}
                /> : null
            }

            {
              error ?
                <div className={`${styles.offerRow} row mb-3`}>
                  <div className='col-12'>
                    { text }
                  </div>
                </div> : null
            }

            {
              offers.length > 0 ?
                offers.map((offer, index) => (
                  <div key={index} className={`${styles.offerRow} row mb-3`}>
                    <div className='col-lg-3 col-12 pl-0 mb-lg-0 mb-3'>
                      {
                        offer.images.map((image, index) => (
                          index === 0 ?
                            <div
                              key={index}
                              className={styles.image}
                              style={{
                                backgroundImage: `url('${image.url}')`
                              }}
                            /> : ''
                        ))
                      }
                    </div>
                    {
                      offer.options.map((option, index) => (
                        <div key={index} className='col-lg col-12 d-flex align-items-center mb-3 mb-lg-0'>
                          <div className={styles.optionsBlock}>
                            <div className={styles.title}>
                              { option.title[lang] }
                            </div>
                            <div className={styles.options}>
                              {
                                option.items.map((item, index) => (
                                  <div className={styles.option} key={index}>
                                    { typeof item.value !== 'object' ? item.value : item.value[lang] }
                                    { item.quantity > 0 ? `(${item.quantity})` : '' }
                                    { option.items.length - 1 === index ? '' : ', ' }
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    }
                    <div className='col-lg-2 col-12 pr-0 d-flex justify-content-end align-items-center'>
                      <div className={styles.buttonsWrapper}>
                        <div
                          className={styles.btn}
                          onClick={() => {
                            setOfferIndex(index)
                            setIsShow(true)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
                        </div>
                        <div className={styles.btn} onClick={() => handleRemoveOffer(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : null
            }

            <div className='row'>
              <div
                className={`${styles.addNew} col-12`}
                onClick={() => {
                  setIsShow(!isShow)
                  setOfferIndex(null)
                }}
              >
                Add Characteristics <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default ProductCharacteristics
