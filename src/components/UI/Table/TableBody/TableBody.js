import React from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import { firestore } from '../../../../firebase/config'
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg>
                          <div style={{width: '5px'}} />
                          { t('delete.label') }
                        </div>
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
