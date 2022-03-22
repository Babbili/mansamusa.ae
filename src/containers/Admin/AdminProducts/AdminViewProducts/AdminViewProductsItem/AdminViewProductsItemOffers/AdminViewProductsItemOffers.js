import React, { useContext, useState } from 'react'
import AppContext from '../../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import styles from './AdminViewProductsItemOffers.module.scss'
import PopUpImageSlider from '../../../../../../components/UI/PopUpImageSlider/PopUpImageSlider';


const AdminViewProductsItemOffers = ({ offers, price, discount, isDiscount }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(null)
  const [toggleImagePreview, setToggleImagePreview] = useState({})

  const handleToggle = index => {
    setCurrentIndex(index)
    setToggleImagePreview(prevState => {
      return {
        ...prevState,
        [index]: !prevState[index]
      }
    })
  }


  return(

    <div className='col-12'>

      <div className={styles.title}>
        { t('productVariants.label') }
      </div>

      {
        currentIndex !== null && toggleImagePreview[currentIndex] ?
          <div className={styles.sliderPopUp}>
            <div className={styles.wrapper}>
              <div
                className={styles.close}
                onClick={() => setToggleImagePreview(!toggleImagePreview)}
              >
                <FontAwesomeIcon icon={'times'} fixedWidth />
              </div>
              <PopUpImageSlider
                lang={lang}
                images={offers[currentIndex].images}
              />
            </div>
          </div> : null
      }

      <table>

        <thead>
        <tr>
          <th>Main Picture</th>

          {
            offers[0].options.map((option, index) => {
              return(
                <th key={index}>
                  { option.title[lang] }
                </th>
              )
            })
          }

          <th>Price</th>
          <th>Discount</th>
          <th>Quantity</th>
        </tr>
        </thead>

        <tbody>

        {
          offers.map((offer, index) => {

            let offerQuantity = offer.options
              .map(f => f.items.map(m => m.quantity)).flat(1)
              .reduce((a, b) => a + Number(b), 0)

            return(

              <tr key={index}>

                <td
                  data-label={'Main Picture'}
                  onClick={() => {
                    if (offer.images.length > 0) handleToggle(index)
                  }}
                  // style={{
                  //   paddingRight: lang !== 'en' ? '0px' : '5px',
                  //   paddingLeft: lang !== 'en' ? '5px' : '0px',
                  //   width: '60px'
                  // }}
                >
                  {
                    offer.images.length > 0 ?
                      <div className={styles.offer}>
                        <div
                          className={styles.img}
                          style={{
                            backgroundImage: `url(${offer.images[0].url})`
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

                {
                  offer.options.map((option, index) => {

                    return(

                      <td data-label={option.title[lang]} key={index}>
                        {
                          option.items.map((item, index) => {

                            return(

                              <React.Fragment key={index}>
                                { typeof item.value === 'object' ? item.value[lang] : item.value }
                                { item.quantity > 0 ? ` (${item.quantity})` : '' }
                                { index !== option.items.length - 1 ? ', ' : '' }
                              </React.Fragment>

                            )

                          })
                        }
                      </td>

                    )

                  })

                }

                <td data-label={'Price'}>
                  AED { price }
                </td>

                <td data-label={'Discount'}>
                  {
                    isDiscount ?
                      <React.Fragment>
                        { discount } %
                      </React.Fragment>
                      : '—'
                  }
                </td>

                <td
                  data-label={'Quantity'}
                  // style={{
                  //   paddingRight: lang !== 'en' ? '0px' : '5px',
                  //   paddingLeft: lang !== 'en' ? '5px' : '0px'
                  // }}
                >
                  <div className={styles.offer}>
                    { offerQuantity }
                  </div>
                </td>

              </tr>

            )

          })
        }

        </tbody>

      </table>

    </div>

  )

}

export default AdminViewProductsItemOffers
