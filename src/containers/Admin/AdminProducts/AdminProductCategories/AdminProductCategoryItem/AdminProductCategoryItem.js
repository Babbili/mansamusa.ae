import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AdminProductCategoryItem.module.scss'


const AdminProductCategoryItem = ({ index, setBc, url, category, handleEdit, handleRemove }) => {

  const context = useContext(AppContext)
  let { lang } = context


  return(

    <div
      className={`${styles.AdminProductCategoryItem} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      style={{
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >

      <div className={styles.wrapper}>

        <div className={styles.itemTitle}>

          <div className={styles.titleWrapper}>

            <Link
              to={{
                pathname: `${url}/${category.id}`,
                params: {
                  title: {
                    en: category.title.en,
                    ar: category.title.ar,
                    ru: category.title.ru,
                    tr: category.title.tr,
                  }
                }
              }}
              onClick={() => {
                setBc(prevState => {
                  return [...prevState, {
                    title: category.title,
                    id: category.id,
                    path: `${url}/${category.id}`
                  }]
                })
              }}
            >

              <div
                className={styles.image}
                style={{
                  backgroundImage: `url(${category.imgUrl})`
                }}
              />

              <div className={styles.left}>
                <h3>
                  { category.title[lang] }
                </h3>
                {
                  category.description !== undefined ?
                    <div className={styles.description}>
                      {
                        typeof category.description === 'object' ?
                        category.description[lang] : category.description
                      }
                    </div> : null
                }
              </div>

            </Link>

            <div
              className={styles.right}
              style={{
                margin: lang !== 'en' ? '0 auto 0 0' : '0 0 0 auto'
              }}
            >
              <span>
                <FontAwesomeIcon
                  icon="edit"
                  fixedWidth
                  onClick={() => handleEdit(category)}
                />
                <div style={{width: 5}} />
                <FontAwesomeIcon
                  icon="times-circle"
                  fixedWidth
                  onClick={() => handleRemove(category.id)}
                />
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default AdminProductCategoryItem
