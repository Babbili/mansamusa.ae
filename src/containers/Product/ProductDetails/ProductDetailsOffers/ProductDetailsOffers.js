import React from 'react'
import { scrollToTop } from '../../../../utils/utils'

import styles from './ProductDetailsOffers.module.scss'


const ProductDetailsOffers = ({ offers, isMobile, currentOffer, handleCurrentOffer }) => {

  return(

    isMobile && offers.length === 1 ? null :
    <div className={styles.ProductDetailsOffers}>

      {
        offers.map((offer, index) => {

          return(

            <div
              key={index}
              className={styles.offer}
              style={{
                marginRight: offers.length >= 2 ? '15px' : ''
              }}
              onClick={() => {
                handleCurrentOffer(offer)
                if (isMobile) {
                  scrollToTop(0, 'smooth')
                } else {
                  scrollToTop(190, 'smooth')
                }
              }}
            >

              <div className={styles.wrapper}>
                {
                  offer.images.length > 0 ?
                    <div
                      className={`${styles.img} ${offer === currentOffer ? styles.active : ''}`}
                      style={{
                        backgroundImage: `url(${offer.images[0].url})`
                      }}
                    /> : null
                }
              </div>

            </div>

          )

        })
      }

    </div>

  )

}

export default ProductDetailsOffers
