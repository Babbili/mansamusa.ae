import React from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import { firestore } from '../../../../firebase/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import styles from './TableBody.module.scss'


const TableBody = ({ lang, items, schema, currentPage, limit, collection, ...props }) => {

  moment.locale(lang)

  let { t } = useTranslation()

  const removeProduct = id => {
    firestore.collection(collection)
    .doc(id).delete()
    .then(r => {})
  }

  return(

    <tbody className={styles.TableBody}>
      {
        items.map((item, index) => {

          if (index + 1 >= ((currentPage - 1) * limit) + 1 && index <= (currentPage * limit)) {

            return(

              <tr key={index}>
                <td>
                  { index + 1 }
                </td>

                {
                  Object.keys(schema).map((el, i) => (
                    <td
                      key={i}
                      style={{
                        textAlign: lang === 'ar' ? 'right' : 'left'
                      }}
                    >
                      {
                        typeof item[el] === 'boolean' ?
                          item[el] ? 'Yes' : 'No' :
                          typeof item[el] === 'object' ?
                            item[el][lang] : item[el]
                      }
                    </td>
                  ))
                }

                {
                  collection === 'products' ?
                    <td>
                      <div className={styles.buttonsWrapper}>
                        <div
                          className={styles.btn}
                          onClick={() => removeProduct(item.uid)}
                        >
                          <FontAwesomeIcon icon={'trash'} fixedWidth />
                          <div style={{width: '5px'}} />
                          { t('delete.label') }
                        </div>
                        {/*<div*/}
                        {/*  className={styles.btn}*/}
                        {/*  onClick={() => props.history.push(`/supplier/products/edit-product/${item.id}`)}*/}
                        {/*>*/}
                        {/*  <FontAwesomeIcon icon={'edit'} fixedWidth />*/}
                        {/*  <div style={{width: '5px'}} />*/}
                        {/*  { t('edit.label') }*/}
                        {/*</div>*/}
                      </div>
                    </td> : null
                }

              </tr>

            )

          }

          return null

        })
      }
    </tbody>

  )

}

export default TableBody
