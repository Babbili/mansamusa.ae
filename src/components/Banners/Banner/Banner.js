import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { useTranslation } from 'react-i18next'
import { gridBuilder } from '../../utils/gridBuilder'
import Button from '../../UI/Button/Button'

import styles from './Banner.module.scss'



const Banner = ({ url, banner, isHome, isEven, isSlim, length, index }) => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context
  let { t } = useTranslation()
  const col = gridBuilder(length, index)


  return(

    <div
      className={styles.Banner} >
      <div
        className={styles.content}
        style={{
          backgroundImage: `url(${banner.imgUrl})`
          
          // backgroundPosition: isSlim ? 'center top' : ''
        }}
      >
        {
          isHome ?
            <>
              <h4>{ banner.title[lang] }</h4>
              <Button
                url={url}
                title={t('shopNow.label')}
                link={banner.title.en}
              />
              <div className={styles.mask} />
            </> : null
        }
      </div>
      {
        isHome ? null :
          // isSlim ? null :
          <div
            className={styles.description}
            style={{
              width: length === 1 ? '50%' : ''
            }}
          >
            <h4>{ banner.title[lang] }</h4>
            <p>
              {
                banner.description !== undefined ?
                  banner.description[lang] : ''
              }
            </p>
            <Button
              url={url}
              isBorder={true}
              title={t('shopNow.label')}
              link={banner.title.en}
            />
          </div>
      }
    </div>

  )

}

export default Banner
