import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Label from '../../../components/UI/Label/Label'
import ProductDetailsOptions from './ProductDetailsOptions/ProductDetailsOptions'
import ProductDetailsOffers from './ProductDetailsOffers/ProductDetailsOffers'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import styles from './ProductDetails.module.scss'


const ProductDetails = ({ lang, isAdded, isMobile, isError, product, newPrice, leftOvers, isWishlist, isMaxQuantity, handleOptions, currentOffer, handleAddToCart, handleCurrentOffer, handleAddWishlistItem }) => {

  const { t } = useTranslation()
  let productType = product.productType.filter(f => f.selected)[0]['radioName']
  let productPrice = Number(product.productPrice)
  let discountPrice = Number(product.discountPrice)
  let colour = product.offers.length > 0 ? currentOffer.options.map(o => {
    if (o.title.en === 'Colour') {
      return {
        title: o.title,
        value: o.items[0].value
      }
    }
    return null
  }).filter(f => f !== null)[0] : null

  const [currLeftOvers, setCurrLeftOvers] = useState([])

  useEffect(() => {

    let curr = leftOvers
    .filter(l => l.leftOvers.length > 0)
    .map(m => Number(m.leftOvers))[0]

    setCurrLeftOvers(curr)

  }, [leftOvers])


  return (

    <div className={styles.ProductDetails}>

      

      <div className={styles.brand}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--text-color)"><path d="M19.148 2.971A2.008 2.008 0 0 0 17.434 2H6.566c-.698 0-1.355.372-1.714.971L2.143 7.485A.995.995 0 0 0 2 8a3.97 3.97 0 0 0 1 2.618V19c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8.382A3.97 3.97 0 0 0 22 8a.995.995 0 0 0-.143-.515l-2.709-4.514zm.836 5.28A2.003 2.003 0 0 1 18 10c-1.103 0-2-.897-2-2 0-.068-.025-.128-.039-.192l.02-.004L15.22 4h2.214l2.55 4.251zM10.819 4h2.361l.813 4.065C13.958 9.137 13.08 10 12 10s-1.958-.863-1.993-1.935L10.819 4zM6.566 4H8.78l-.76 3.804.02.004C8.025 7.872 8 7.932 8 8c0 1.103-.897 2-2 2a2.003 2.003 0 0 1-1.984-1.749L6.566 4zM10 19v-3h4v3h-4zm6 0v-3c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H5v-7.142c.321.083.652.142 1 .142a3.99 3.99 0 0 0 3-1.357c.733.832 1.807 1.357 3 1.357s2.267-.525 3-1.357A3.99 3.99 0 0 0 18 12c.348 0 .679-.059 1-.142V19h-3z"></path></svg>
        <Link to={`/store/${product.store}`}>
          Seller: { product.storeName }
        </Link>
      </div>

      <div
        className={`${styles.description} col-12 mt-3 ${isMobile ? 'order-8' : ''}`} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
        dangerouslySetInnerHTML={{
          __html: product.productDescriptionHtml !== undefined && product.productDescriptionHtml[lang].length > 0 ?
            product.productDescriptionHtml[lang] : product.productDescription[lang]
        }}
      />

      <div className={`${isMobile ? 'justify-content-center' : ''} col-12 d-flex mb-4 ${isMobile ? 'order-4' : ''}`} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
        <Label title={productType[lang]} />
      </div>

      {
        colour !== null ?
          <div className='col-12 d-lg-block' style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h5>
              { colour.title[lang] }: { colour.value[lang] }
            </h5>
          </div> : null
      }

      {
        product.offers.length > 0 ?
          <>

            {/*             
            <ProductDetailsOffers
              isMobile={isMobile}
              offers={product.offers}
              currentOffer={currentOffer}
              handleCurrentOffer={handleCurrentOffer}
            /> */}
            

            {
              currentOffer.options !== undefined && currentOffer.options.some(s => s.isMultiple) ?
                <div className={`col-12 mb-4 ${isMobile ? 'order-5' : ''}`}>
                  <ProductDetailsOptions
                    lang={lang}
                    leftOvers={leftOvers}
                    handleOptions={handleOptions}
                    offers={currentOffer.options}
                    isError={isError}
                    error={'Please choose one of the option'}
                  />
                </div> : null
            }

            {
              currLeftOvers !== undefined && !currentOffer.options.some(s => s.isMultiple) && currLeftOvers < 10 ?
                <div className={`col-12 mb-4 ${isMobile ? 'order-6' : ''}`}>
                  <div className={styles.leftOvers}>
                    Low in stock: only { currLeftOvers } left.
                  </div>
                </div> : null
            }

          </> : null
      }


      <div className={styles.price}>
        <div className={styles.current}>
          {
            product.isDiscount ?
            ((discountPrice + newPrice) > 100 ?
            Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((discountPrice + newPrice)*1.1) : Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(discountPrice + newPrice + 10))
            :
            ((productPrice + newPrice) > 100 ?
            Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((productPrice + newPrice)*1.1) :
            Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(productPrice + newPrice + 10))
          }
        </div>
        {
          product.isDiscount ?
            <div className={styles.old}>
              { (productPrice + newPrice) > 100 ?
               Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format((productPrice + newPrice)*1.1) :
               Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(productPrice + newPrice + 10)
              }
            </div> : null
        }
        {
          product.isDiscount ?
            <Label title={`Discount ${product.discount}%`} /> : null
        }
      </div>
      <div className={styles.details} style={{ textAlign: lang === 'ar' ? 'center' : 'left' }}>
        <p>VAT included</p>
        <p>Sales Tax Free</p>
        <p>Free Shipping</p>
      </div>

      <div className={styles.add}>
        <SignUpButton
          type={'custom'}
          title={isMaxQuantity ? 'Maximum is reached' : isAdded ? 'In Cart' : t('AddToCart.label')}
          onClick={handleAddToCart}
          disabled={false}
          isWide={true}
        />
      </div>

    </div>

  )

}

export default ProductDetails
