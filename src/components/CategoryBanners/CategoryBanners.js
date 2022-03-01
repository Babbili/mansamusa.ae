import React, {useContext} from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../UI/Button/Button'

import styles from './CategoryBanners.module.scss'
import AppContext from "../AppContext";


const CategoryBanners = ({ promo, isMobile, isSubCategory, isMenu }) => {

  const context = useContext(AppContext)
  const { lang } = context
  const { t } = useTranslation()

  return(

    <div
      className={`${styles.CategoryBanners} col-12`}
      style={{
        padding: isSubCategory ? '0' : '',
        margin: isSubCategory ? '0.25rem 0 30px 0' : ''
      }}
    >
      <div
        className={styles.wrapper}
        style={{
          backgroundImage: `url(${promo.imgUrl})`,
          alignItems: `${promo.align}`
        }}
      >
        <div
          className={styles.textWrapper}
          style={{
            width: isMenu !== undefined || isMobile ? '100%' : '',
            padding: isMobile ? '0' : '0 100px',
          }}
        >
          <h1>
            {
              typeof promo.title === 'object' ?
              promo.title[lang] : promo.title
            }
          </h1>
          <p>
            {
              typeof promo.subTitle === 'object' ?
              promo.subTitle[lang] : promo.subTitle
            }
          </p>
          <Button title={ t('shopNow.label') } link={'/'} />
        </div>
      </div>
    </div>

  )

}

export default CategoryBanners
