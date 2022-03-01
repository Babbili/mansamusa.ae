import React, { useContext, useEffect, useState, useRef } from 'react'
import AppContext from '../../components/AppContext'
import { firestore } from '../../firebase/config'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toSlug } from '../../components/utils/toSlug'
import ProductItemAddToFavourites from '../../components/ProductItem/ProductItemAddToFavourites/ProductItemAddToFavourites'
import ProductItemHeader from '../../components/ProductItem/ProductItemHeader/ProductItemHeader'
import ProductItemBody from '../../components/ProductItem/ProductItemBody/ProductItemBody'
import ProductDetails from './ProductDetails/ProductDetails'

import SignUpButton from '../../components/UI/SignUpButton/SignUpButton'
import 'swiper/swiper-bundle.css'
import './slider.css'

import styles from './Product.module.scss'

// import CatalogBreadCrumbs from '../../components/UI/CatalogBreadCrumbs/CatalogBreadCrumbs'


const Product = props => {

  const Context = useContext(AppContext)
  let { lang, wishlist, handleAddWishlistItem, isMobile } = Context
  let globalCart = Context.cart
  const { t } = useTranslation()
  let { productId } = useParams()

  const [product, setProduct] = useState(null)
  const [latestProducts, setLatestProducts] = useState([])
  const [isDone, setIsDone] = useState(false)
  const [cart, setCart] = useState({})
  const [priceOptions, setPriceOptions] = useState([])
  const [newPrice, setNewPrice] = useState(0)
  const [isError, setIsError] = useState(false)
  const [leftOvers, setLeftOvers] = useState([])
  const [isAdded, setIsAdded] = useState(false)
  const [currentOffer, setCurrentOffer] = useState([])
  const [currentLeftOvers, setCurrentLeftOvers] = useState(null)
  const [isMaxQuantity, setIsMaxQuantity] = useState(false)
  const [isWishlist, setIsWishlist] = useState(false)
  const [isOfferImages, setIsOfferImages] = useState(false)

  useEffect(() => {

    let offersImages = []

    if (product !== null) {

      if (product.offers.length > 0) {
        offersImages = product.offers.reduce((a, b) => [...a, ...b.images], [])
      } else {
        offersImages = []
      }

    }

    setIsOfferImages(offersImages.length > 0)

  }, [product])

  useEffect(() => {

    if (wishlist.length > 0 && product !== null) {
      let check = wishlist.some(s => s.id === product.id)
      setIsWishlist(check)
    }

  }, [wishlist, product])

  // load product +
  useEffect(() => {

    let id = productId.split('-')[productId.split('-').length - 1]

    setProduct(null)
    setIsDone(false)

    firestore.collection('products').doc(id).get()
    .then(doc => {

      if (doc.exists) {
        setProduct({id: doc.id, ...doc.data()})
      } else {
        console.log('No such document!')
      }

    })
    .then(() => {
      setIsDone(true)
    })

  }, [productId])

  // get same store products +
  useEffect(() => {

    return product !== null && product.store !== undefined ?
      firestore.collection('products')
      .where('store', '==', product.store)
      .where('isApproved', '==', true)
      // .where('productQuantity', '>', 0)
      .limit(5)
      .onSnapshot(snapshot => {
        let products = []
        snapshot.forEach(doc => {
          products = [...products, {id: doc.id, ...doc.data()}]
        })
        setLatestProducts(products)
      }) : null

  }, [product])

  // prepend local cart with product +
  useEffect(() => {
    if (product !== null) {
      setCart({
        id: productId.split('-')[productId.split('-').length - 1],
        name: product.productName,
        price: product.isDiscount ? Number(product.discountPrice) : Number(product.productPrice),
        quantity: 1,
        store: product.store,
        leftOvers: Number(product.productQuantity),
        offerImages: product.productImages
      })
    }
  }, [product, productId])

  // set new price for product from option +
  useEffect(() => {
    if (product !== null) {
      setCart(prevState => {
        return {
          ...prevState,
          price: product.isDiscount ?
            Number(product.discountPrice) + newPrice :
            Number(product.productPrice) + newPrice
        }
      })
    }
  }, [newPrice, product])

  // check for price in option +
  useEffect(() => {

    priceCheck(cart, currentOffer)

  }, [cart, currentOffer])

  // some price helper +
  useEffect(() => {

    if (priceOptions.length > 0) {

      let total = 0

      priceOptions.map(m => {
        if (m.prefix === '+') {
          total = total + Number(m.price)
        } else {
          total = total - Number(m.price)
        }
        return null
      })

      setNewPrice(total > 0 ? total : 0)

    }

  }, [product, priceOptions])

  // prepend current offer +
  useEffect(() => {

    if (product !== null && product.offers.length > 0) {
      let currentOffer = product.offers.filter((o, i) => i === 0)[0]
      let options = currentOffer.options
      .filter(f => f.items.length === 1)
      .map(m => {
        return {
          name: m.title,
          value: m.items[0].value
        }
      })
      setCurrentOffer(currentOffer)
      setCart(prevState => {
        return {
          ...prevState,
          options: options,
          quantity: 1,
          offerImages: isOfferImages ? currentOffer.images : prevState.offerImages
        }
      })
    }

  }, [product, isOfferImages])

  useEffect(() => {

    let lo = leftOvers.reduce((a, b) => a + Number(b.leftOvers), 0)

    setCurrentLeftOvers(lo)

  }, [leftOvers])

  const usePrevious = (value) => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const prevLeftOvers = usePrevious(currentLeftOvers)

  // match prev and curr leftovers and set curr
  useEffect(() => {

    if (prevLeftOvers !== currentLeftOvers) {

      setCart(prevState => {
        return {
          ...prevState,
          leftOvers: currentLeftOvers
        }
      })

    }

  }, [prevLeftOvers, currentLeftOvers])

  // update current cart with global cart item
  useEffect(() => {

    let compare = (a, b) => {
      let result = a.map(m => {
        return b.map(f => {

          if (typeof m.value === 'object') {
            return m.value.en === f.value.en
          } else {
            return m.value === f.value
          }

        }).flat(1).some(s => s === true)
      })
      return !result.some(s => s === false)
    }

    if (globalCart.length > 0) {

      if (cart.options !== undefined && cart.options.length > 0) {

        let globalCartItem = globalCart.filter(f => f.id === cart.id && compare(f.options, cart.options))

        if (globalCartItem.length > 0) {

          globalCartItem.map(m => (
            setCart(m)
          ))

        }

      } else {

        let globalCartItem = globalCart.filter(f => f.id === cart.id)

        if (globalCartItem.length > 0) {

          globalCartItem.map(m => (
            setCart(m)
          ))

        }

      }

    }

  }, [cart, globalCart])

  // update local cart with options +
  const handleOptions = event => {

    const { value, name } = event.target

    let currentOption = currentOffer.options
    .filter(f => typeof f.title === 'object' ? f.title.en === name : f.title === name)
    .map(m => {
      return {
        name: m.title,
        value: value !== name ? m.items.filter(f => typeof f.value === 'object' ? f.value.en === value : f.value === value)[0].value : undefined
      }
    })

    if (cart.options !== undefined) {

      if (value !== name) {

        setCart({
          ...cart,
          options: cart.options.filter(f => {

            if (typeof f.name === 'object') {
              return !currentOption.some(s => s.name.en === f.name.en)
            } else {
              return !currentOption.some(s => s.name === f.name)
            }

          }).concat(currentOption),
          quantity: 1
        })

      } else {

        setCart({
          ...cart,
          options: cart.options.filter(f => {

            if (typeof f.name === 'object') {
              return !currentOption.some(s => s.name.en === f.name.en)
            } else {
              return !currentOption.some(s => s.name === f.name)
            }

          }),
          quantity: 1
        })

      }

    } else {

      setCart({
        ...cart,
        options: [currentOption],
        quantity: 1
      })

    }

  }

  // +
  const priceCheck = (cart, offer) => {

    if (cart.options !== undefined && cart.options.length > 0) {

      let leftOvers = cart.options.map(cartOption => {

        return offer.options.map(offerOption => {

          if (typeof cartOption.name === 'object') {

            if (cartOption.name.en === offerOption.title.en) {

              return offerOption.items.map(offerItem => {

                if (typeof cartOption.value === 'object') {

                  if (cartOption.value.en === offerItem.value.en) {

                    return {
                      name: cartOption.name,
                      value: cartOption.value,
                      leftOvers: offerItem.quantity
                      // leftOvers: product.offers.length > 0 ? offerItem.quantity : product.productQuantity
                    }

                  }

                } else {

                  if (cartOption.value === offerItem.value) {

                    return {
                      name: cartOption.name,
                      value: cartOption.value,
                      leftOvers: offerItem.quantity
                    }

                  }

                }

                return null

              }).filter(f => f !== null)

            }

          } else {

            if (cartOption.name === offerOption.title) {

              return offerOption.items.map(offerItem => {

                return {
                  name: cartOption.name, value: cartOption.value, leftOvers: offerItem.quantity
                }

              })

            }

          }

          return null

        }).filter(f => f !== null)

      }).flat(2)

      setLeftOvers(prevState => {
        prevState = leftOvers
        return prevState
      })

      let priceOptions = cart.options.map(cartOption => {

        return offer.options.map(offerOption => {

          if (typeof cartOption.name === 'object') {

            if (cartOption.name.en === offerOption.title.en) {

              return offerOption.items.map(offerItem => {

                if (typeof cartOption.value === 'object') {

                  if (cartOption.value.en === offerItem.value.en) {

                    return {
                      name: cartOption.name,
                      prefix: offerItem.prefix,
                      price: offerItem.price,
                      quantity: offerItem.quantity
                    }

                  }

                } else {

                  if (cartOption.value === offerItem.value) {

                    return {
                      name: cartOption.name,
                      prefix: offerItem.prefix,
                      price: offerItem.price,
                      quantity: offerItem.quantity
                    }

                  }

                }

                return null

              }).filter(f => f !== null)

            }

          } else {

            if (cartOption.name === offerOption.title) {

              return offerOption.items.map(offerItem => {

                return {
                  name: cartOption.name,
                  prefix: offerItem.prefix,
                  price: offerItem.price,
                  quantity: offerItem.quantity
                }

              })

            }

          }

          return null

        }).filter(f => f !== null)

      }).flat(2)

      setPriceOptions(prevState => {
        prevState = priceOptions
        return prevState
      })

    }

  }

  // +
  const handleAddToCart = () => {

    if (product.offers.length > 0) {

      if (cart.options.length === product.characteristics.length) {

        if (cart.quantity <= cart.leftOvers - 1) {

          Context.handleAddToCart(cart)
          setIsAdded(true)
          setTimeout(() => {
            setIsAdded(false)
          }, 1500)

        }

        if (cart.quantity === cart.leftOvers) {

          setIsMaxQuantity(true)
          setTimeout(() => {
            setIsMaxQuantity(false)
          }, 1500)

        }

      } else {

        setIsError(true)
        setTimeout(() => {
          setIsError(false)
        }, 1500)

      }

    } else {

      if (cart.quantity <= cart.leftOvers - 1) {

        Context.handleAddToCart(cart)
        setIsAdded(true)
        setTimeout(() => {
          setIsAdded(false)
        }, 1500)

      }

      if (cart.quantity === cart.leftOvers) {

        setIsMaxQuantity(true)
        setTimeout(() => {
          setIsMaxQuantity(false)
        }, 1500)

      }

    }

  }

  // current offer update +
  const handleCurrentOffer = offer => {

    let lo = leftOvers.reduce((a, b) => a + Number(b.leftOvers), 0)

    setCurrentOffer(offer)

    let options = offer.options
    .filter(f => f.items.length === 1)
    .map(m => {
      return {
        name: m.title,
        value: m.items[0].value
      }
    })

    setCart(prevState => {

      if (prevState.options !== undefined) {

        return {
          ...prevState,
          options: prevState.options.filter((f, i) => {

            if (typeof f.name === 'object') {
              return !options.some(s => s.name.en === f.name.en)
            } else {
              return !options.some(s => s.name === f.name)
            }

          }).concat(options),
          quantity: 1,
          offerImages: offer.images,
          leftOvers: lo
        }

      } else {

        return {
          ...prevState,
          options: options,
          quantity: 1,
          offerImages: offer.images,
          leftOvers: lo
        }

      }
    })

  }

  const thumbSlides = useRef()
  const [imgActiveSrc, setImgActiveSrc] = useState('')
  
  

  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = useRef()

  function slideLeft() {
    console.log('currentSlide'+ currentSlide)
    if(currentSlide == 0) {
      setCurrentSlide(3)
    } else {
      setCurrentSlide( currentSlide -1)
    }
  }
  function slideRight() {
    if(currentSlide == 3) {
      setCurrentSlide(0)
    } else {
      setCurrentSlide( currentSlide +1)
    }
  }

  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState(0)
  const [endPosition, setEndPosition] = useState(0)

  function touchStart(event) {
    setIsDragging(true)
    setStartPosition(event.type.includes('mouse') ? event.pageX : event.touches[0].clientX)
  }
  function touchEnd() {
    setIsDragging(false)
  }
  function touchMove(event) {
    if(isDragging == true) {
      setEndPosition(event.type.includes('mouse') ? event.pageX : event.touches[0].clientX)
      slideDirectionCheck()
    }
  }
  function slideDirectionCheck() {
    console.log(endPosition - startPosition )
    //endPosition - startPosition < -100 ? slideRight() : 
    //endPosition - startPosition > 100 ? slideLeft() : console.log(`mini ${endPosition} - ${startPosition}` )
  }


  return(
<>
    <section className={styles.productPage+` bd__container`}>
      { isDone ?
      <>
      <h2 className={styles.productPage__title}>
        {product.productName[lang]}
      </h2>
      <div className={styles.productId}>
        { product.productMpn ? <p>product id: <span>{product.productMpn}</span></p> : null }
      </div>
              
        {/* {Math.random().toString(36).substring(2)} */}
      </>
      : null
      }
      <div className={styles.Product}>


        {
          isDone ?
            product !== null ?
              <>
      
                {
                    <>

                      {
                        isDone && isOfferImages ?
                          <div className={styles.product__thumbnail} >
                          
                            <img className={styles.product__thumbnail__main} src={ imgActiveSrc ? imgActiveSrc : currentOffer.images[0].url } />
                          
                            <div className={styles.product__thumbnail__slider}>
                              {/* <div className={styles.product__thumbnail__left__arrow} onClick={() => thumbSlides.current.scrollLeft -= 80 } >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm2.707 14.293-1.414 1.414L7.586 12l5.707-5.707 1.414 1.414L10.414 12l4.293 4.293z"></path></svg>
                              </div> */}

                              <div className={styles.product__thumbnail__slides} ref={thumbSlides} style={{scrollbarWidth: currentOffer.images.length < 4 ? 'none' : '0.2rem' }} >
                                {  
                                  currentOffer.images.map((image, index) => (
                                    
                                    <img key={index} src={image.url} onClick={(e) => setImgActiveSrc(e.target.src) } className={ image.url == imgActiveSrc || (index == 0 && !imgActiveSrc ) ? `img__active` : `img__inactive` } />
                                    
                                  ))
                                }
                              </div>
                              
                              {/* <div className={styles.product__thumbnail__right__arrow} onClick={() => thumbSlides.current.scrollLeft += 80 } >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.293 15.707-1.414-1.414L13.586 12 9.293 7.707l1.414-1.414L16.414 12l-5.707 5.707z"></path></svg>
                              </div> */}
                            </div>
                          </div>

                          : <></>
                      }

                      {
                        isDone && !isOfferImages ?
                        <div className={styles.product__thumbnail}  >
                        
                            <img className={styles.product__thumbnail__main} src={ imgActiveSrc ? imgActiveSrc : product.productImages[0].url } />
                          
                            <div className={styles.product__thumbnail__slider}>
                              {/* <div className={styles.product__thumbnail__left__arrow} onClick={() => thumbSlides.current.scrollLeft -= 80 } >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm2.707 14.293-1.414 1.414L7.586 12l5.707-5.707 1.414 1.414L10.414 12l4.293 4.293z"></path></svg>
                              </div> */}
                              <div className={styles.product__thumbnail__slides} ref={thumbSlides} style={{scrollbarWidth: product.productImages.length < 4 ? 'none' : '0.2rem' }} >
                                {
                                  product.productImages.map((image, index) => (
                                    
                                    <img key={index} src={image.url} onClick={(e) => setImgActiveSrc(e.target.src) } className={ image.url == imgActiveSrc || (index == 0 && !imgActiveSrc ) ? `img__active` : `img__inactive` } />
                                    
                                  ))
                                }
                              </div>
                              
                              {/* <div className={styles.product__thumbnail__right__arrow} onClick={() => thumbSlides.current.scrollLeft += 80 } >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.293 15.707-1.414-1.414L13.586 12 9.293 7.707l1.414-1.414L16.414 12l-5.707 5.707z"></path></svg>
                              </div> */}
                            </div>
                        </div>

                        : null
                      }
                    </>  
                }

                <div>
                  {
                    isDone ?
                      <ProductDetails
                        lang={lang}
                        isAdded={isAdded}
                        product={product}
                        isError={isError}
                        isMobile={isMobile}
                        newPrice={newPrice}
                        leftOvers={leftOvers}
                        isWishlist={isWishlist}
                        currentOffer={currentOffer}
                        isMaxQuantity={isMaxQuantity}
                        handleOptions={handleOptions}
                        handleAddToCart={handleAddToCart}
                        handleCurrentOffer={handleCurrentOffer}
                        handleAddWishlistItem={handleAddWishlistItem}
                      /> : null
                  }
                </div>
              </>: <></> : <></>
        }

      </div>



    { isDone ?
      product !== null ?

      <div className={styles.home__slider}>

        <a className={styles.home__slider__header} href={`/store/${product.store}`} >
          <h3>{`More From ${product.storeName}`}</h3>
          <div className={styles.home__slider__header__arrow}>
            <span>{t('viewAll.label')}</span>
            { lang !== 'ar' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
            }
          </div>
        </a>

        <div className={styles.home__slider__left__arrow} onClick={() => slideLeft()} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm2.707 14.293-1.414 1.414L7.586 12l5.707-5.707 1.414 1.414L10.414 12l4.293 4.293z"></path></svg>
        </div>
        
        <div className={styles.home__slides__wrapper}>
          <div className={styles.home__slides+` home__slides__transform${currentSlide}`} >
            { latestProducts.length > 0 ?
            latestProducts.map( (product, index) => { 
              
              return(
              <div key={index} className={ currentSlide == index  ? 'home__slide': 'hide__slide' } ref={slide}
              onTouchStart={(event) => touchStart(event)}
              onTouchEnd={() => touchEnd()}
              onTouchMove={(event) => touchMove(event)}

              onMouseDown={(event) => touchStart(event)}
              onMouseUp={() => touchEnd()}
              onMouseLeave={() => touchEnd()}
              onMouseMove={(event) => touchMove(event)}
               >
                 
                <img src={product.productImages.length > 0 ? product.productImages[0].url : 'noImage'} onDragStart={(e) => e.preventDefault()} onClick={() => window.location=`/details${toSlug(product.productName)}-${product.id}` } style={{ cursor: 'pointer' }} />
                <div className={styles.productDetails}>
                  <ProductItemHeader
                    supplier
                    lang={lang}
                    url={'/details' + toSlug(product.productName) + '-' + product.id}
                    product={product}
                  />
                  <ProductItemBody
                    lang={lang}
                    supplier
                    product={product}
                  />
                </div>
              </div>
              )
            }) : 
            <></>
            }
          </div>
        </div>
        
        <div className={styles.home__slider__right__arrow} onClick={() => slideRight()} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.293 15.707-1.414-1.414L13.586 12 9.293 7.707l1.414-1.414L16.414 12l-5.707 5.707z"></path></svg>
        </div>

      </div> : <></> : <></>
    }


    </section>
    
</>
  )

}

export default Product
