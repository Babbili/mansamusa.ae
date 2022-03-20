import React from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import { firestore } from '../../../../../../firebase/config'
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
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>
                      <div style={{width: '5px'}} />
                      { t('delete.label') }
                    </div>
                    <div
                      className={styles.btn}
                      onClick={() => props.history.push(`/supplier/products/edit-product/${product.id}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>
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
