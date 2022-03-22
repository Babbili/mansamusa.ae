import React from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import { firestore } from '../../../../../../firebase/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'
import styles from './SupplierViewProductsTableBody.module.scss'


const SupplierViewProductsTableBody = ({ lang, products, currentPage, limit, ...props }) => {

  moment.locale(lang)

  let { t } = useTranslation()

  const removeProduct = id => {
    firestore.collection('products')
    .doc(id).delete()
    .then(r => {})
  }

  return(

    <tbody className={styles.SupplierViewProductsTableBody}>
      {
        products.map((product, index) => {

          if (index + 1 >= ((currentPage - 1) * limit) + 1 && index <= (currentPage * limit)) {

            return(

              <tr key={index}>
                <td>
                  { index + 1 }
                </td>
                <td
                  style={{textAlign: lang === 'ar' ? 'right' : 'left'}}
                >
                  { product.productName[lang] }
                </td>
                <td
                  style={{textAlign: lang === 'ar' ? 'right' : 'left'}}
                >
                  {
                    product.productImages.length > 0 ?
                      <img
                        width='50'
                        src={product.productImages[0].url}
                        alt={product.productName.en}
                      /> : t('notSet.label')
                  }
                </td>
                <td>
                  { product.productQuantity }
                </td>
                <td
                  style={{textAlign: lang === 'ar' ? 'right' : 'left'}}
                >
                  { moment.unix(product.createdAt).format('LLLL') }
                </td>
                <td
                  style={{textAlign: lang === 'ar' ? 'right' : 'left'}}
                >
                  {
                    product.statusOptions.map(m => {
                      if (m.title.en === product.status) {
                        return m.title[lang]
                      }
                      return null
                    })
                  }
                </td>
                <td>
                  { product.productPrice }
                </td>
                <td
                  style={{textAlign: lang === 'ar' ? 'right' : 'left'}}
                >
                  {
                    product.isDiscount ?
                      product.discount : t('notSet.label')
                  }
                </td>
                <td>
                  { product.collectedAmount }
                </td>
                <td>
                  <div className={styles.buttonsWrapper}>
                    <div
                      className={styles.btn}
                      onClick={() => removeProduct(product.id)}
                    >
                      <FontAwesomeIcon icon={'trash'} fixedWidth />
                      <div style={{width: '5px'}} />
                      { t('delete.label') }
                    </div>
                    <div
                      className={styles.btn}
                      onClick={() => props.history.push(`/supplier/products/edit-product/${product.id}`)}
                    >
                      <FontAwesomeIcon icon={'edit'} fixedWidth />
                      <div style={{width: '5px'}} />
                      { t('edit.label') }
                    </div>
                  </div>
                </td>
              </tr>

            )

          }

          return null

        })
      }
    </tbody>

  )

}

export default SupplierViewProductsTableBody
