import React, { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                          <FontAwesomeIcon icon={'edit'} fixedWidth />
                        </div>
                        <div className={styles.btn} onClick={() => handleRemoveOffer(index)}>
                          <FontAwesomeIcon icon={'trash'} fixedWidth />
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
                Add Characteristics <FontAwesomeIcon icon="plus-circle" fixedWidth />
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default ProductCharacteristics
