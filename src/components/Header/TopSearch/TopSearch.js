import React, { useContext } from 'react'
import AppContext from '../../AppContext'
import { useTranslation } from 'react-i18next'
import SearchBar from '../../Algolia/SearchBar/SearchBar'
import styles from './TopSearch.module.scss'


const TopSearch = props => {

  const { t } = useTranslation()
  const context = useContext(AppContext)
  let { lang } = context



  return(

    <div className={styles.TopSearch}>
      <div className={styles.TopSearch__container+` bd__container`}>
        <div className={styles.inputGroup}>


          <SearchBar
            lang={lang}
            class={styles.suggest}
            placeholder={ t('searchForProductsAndBrands.label') }
          />

        </div>
      </div>
    </div>

  )

}

export default TopSearch
