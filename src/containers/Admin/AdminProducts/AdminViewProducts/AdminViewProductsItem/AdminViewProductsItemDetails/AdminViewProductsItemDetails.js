import React from 'react'
import styles from './AdminViewProductsItemDetails.module.scss'


const AdminViewProductsItemDetails = ({ lang, product }) => {

  return(

    <div className={`${styles.AdminViewProductsItemDetails} col-12 mb-4`}>

      <div className={styles.prName}>
        <div
          className={styles.big}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          {
            product.productName[lang].length > 0 ?
              product.productName[lang] :
              lang !== 'en' ?
                'لم يتم تقديم عنوان' : 'No title provided'
          }&nbsp;/&nbsp;
        </div>
        <div
          className={styles.small}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          {
            lang === 'en' ?
              product.productName['ar'].length > 0 ?
                product.productName['ar'] : 'لم يتم تقديم عنوان' :
              product.productName['en'].length > 0 ?
                product.productName['en'] : 'No title provided'
          }
        </div>
      </div>

      <div className={styles.prDesc}>
        <div
          className={styles.small}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          {
            product.productDescription[lang].length > 0 ?
              product.productDescription[lang] :
              lang !== 'en' ?
                'لم يتم تقديم وصف' : 'No description provided'
          }
        </div>
        <div
          className={styles.small}
          style={{
            textAlign: lang === 'ar' ? 'right' : 'left'
          }}
        >
          {
            lang === 'en' ?
              product.productDescription['ar'].length > 0 ?
                product.productDescription['ar'] : 'لم يتم تقديم وصف' :
              product.productDescription['en'].length > 0 ?
                product.productDescription['en'] : 'No description provided'
          }
        </div>

      </div>

    </div>

  )

}

export default AdminViewProductsItemDetails
