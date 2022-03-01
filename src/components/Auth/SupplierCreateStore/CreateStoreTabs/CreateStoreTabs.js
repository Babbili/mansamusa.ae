import React, { useContext } from 'react'
import AppContext from '../../../AppContext'
import styles from './CreateStoreTabs.module.scss'
import login from './../../../../assets/profile.png'
import country from './../../../../assets/globe.png'
import store from './../../../../assets/shop.png'
import document from './../../../../assets/document.png'
import bank from './../../../../assets/bank.png'
import vat from './../../../../assets/vat.png'


const CreateStoreTabs = ({ index, newStore }) => {

  const context = useContext(AppContext)
  const { lang, isMobile } = context

  const tabs = [
    {
      title: {
        en: 'Login',
        ar: 'تسجيل الدخول',
        ru: 'Войти'
      },
      icon: login
    },
    {
      title: {
        en: 'Country',
        ar: 'البلد',
        ru: 'Страна'
      },
      icon: country
    },
    {
      title: {
        en: 'Store',
        ar: 'متجر',
        ru: 'Магазин'
      },
      icon: store
    },
    {
      title: {
        en: 'Documents',
        ar: 'مستندات',
        ru: 'Документы'
      },
      icon: document
    },
    {
      title: {
        en: 'Bank',
        ar: 'مصرف',
        ru: 'банк'
      },
      icon: bank
    },
    {
      title: {
        en: 'VAT',
        ar: 'ضريبة القيمة المضافة',
        ru: 'НДС'
      },
      icon: vat
    }
  ]

  // useEffect(() => {
  //   if (newStore) {
  //     setTabs(prevState => {
  //       prevState.shift()
  //       return prevState
  //     })
  //   }
  // }, [newStore])


  return(

    <div className={styles.CreateStoreTabs}>
      <div className={styles.wrapper}>

        {
          tabs.map((tab, i) => {

            return(

              <div
                key={i}
                className={`${styles.tab} ${i === index ? styles.active : ''} ${i < index ? styles.prev : ''} ${lang === 'ar' ? styles.ar : ''}`}
                style={{
                  display: isMobile && index !== i ? 'none' : ''
                }}
              >
                <img src={tab.icon} alt={tab.title.en} />
                <div style={{minWidth: '5px'}} />
                { tab.title[lang] }
              </div>

            )

          })
        }

      </div>
    </div>

  )

}

export default CreateStoreTabs
