import React, { useContext } from 'react'
import AppContext from '../../../../../../components/AppContext'
import { useTranslation } from 'react-i18next'
import styles from './AdminViewProductsItemOffers.module.scss'


const AdminViewProductsItemOffers = ({ offers, price, discount, isDiscount }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  return(

    <div className='col-12'>

      <div className={styles.title}>
        { t('productVariants.label') }
      </div>

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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z"></path><path d="m10 14-1-1-3 4h12l-5-7z"></path></svg>
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

      {/*<div className={styles.AdminViewProductsItemOffers}>*/}


      {/*  */}

      {/*</div>*/}

    </div>

  )

}

export default AdminViewProductsItemOffers
