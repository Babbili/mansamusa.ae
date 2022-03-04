import React, {useContext, useEffect, useState} from 'react'
import AppContext from '../AppContext'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import logo from '../../assets/logo.png'
import styles from './Footer.module.scss'
import {firestore} from "../../firebase/config";
import {Link} from "react-router-dom";
import { toSlug } from '../utils/toSlug'
import {scrollToTop} from "../../utils/utils";


const Footer = props => {

  const context = useContext(AppContext)
  const { lang } = context
  let { t } = useTranslation()

  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  useEffect(() => {

    return firestore.collection('productTypes')
    .where('isTop', '==', true)
    .onSnapshot(snapshot => {
      let categories = []
      snapshot.forEach(doc => {
        categories = [...categories, {id: doc.id, title: doc.data().title}]
      })
      setCategories(categories)
    })

  }, [])

  useEffect(() => {

    return firestore.collectionGroup('stores')
    .where('isTop', '==', true)
    .onSnapshot(snapshot => {
      let stores = []
      snapshot.forEach(doc => {
        stores = [...stores, {id: doc.id, title: doc.data().storeName}]
      })
      setBrands(stores)
    })

  }, [])


  return(

    <footer className={styles.Footer}>
      <div className={styles.line} />

      <div className={styles.footer__wrap} style={{ textAlign: lang === 'ar' ? 'right' : 'left' }} >
            <a className={styles.footer__logo} href="/">
                <img src={logo} />
            </a>

            <div className={styles.footer__content}>
                <h3>{t('categories.label')}</h3>
                <ul className={styles.footer__content__list}>
                  {
                    categories.length > 0 ?
                      categories.map((c, i) => (
                        <li className={styles.footer__content__list__item} key={i} >
                          <Link to={`/categories${toSlug(c.title.en)}`} onClick={() => scrollToTop(0, 'auto')}>
                            { c.title[lang] }
                          </Link>
                        </li>
                      )) : null
                  }
                </ul>
            </div>

            <div className={styles.footer__content}>
                <h3>{t('company.label')}</h3>
                <ul className={styles.footer__content__list}>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location="/page/about-us"}>{t('about.label')}</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location = '/contact-us'} >{t('contactUs.label')}</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location="/page/faq"}>FQA</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location='/page/shipping-&-delivery'}>{t('shippingNdelivery.label')}</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location="/page/returns-&-refunds"}>{t('returnsNrefunds.label')}</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location="/page/privacy-&-cookie-policy"}>{t('privacyPolicy.label')}</div></li>
                    <li className={styles.footer__content__list__item}><div onClick={() => window.location="/page/terms-&-conditions"}>{t('termsNconditions.label')}</div></li>
                </ul>
            </div>

            <div className={styles.footer__content}>
              <h3>{t('sellOn.label')}</h3>
              <ul className={styles.footer__content__list} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} >
                  <li className={styles.footer__content__list__item}>
                    <div onClick={() => window.location='/login'} >
                      { t('signInVirtualShop.label') }
                    </div>
                  </li>
                  <li className={styles.footer__content__list__item}>
                    <Link
                      to={{
                        pathname: '/signup',
                        state: {
                          isSupplierSignUp: true
                        }
                      }}
                    >
                      { t('signUpVirtualShop.label') }
                    </Link>
                  </li>
                  <li className={styles.footer__content__list__item}>
                    <Link to={'/page/terms-&-conditions-for-traders'}>{t('tnsTraders.label')}</Link>
                  </li>
              </ul>
            </div>

            <div className={styles.footer__content}>
              <h3>{t('followMansaMusa.label')}</h3>
              <div className={styles.social__icons}>
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z"></path><circle cx="11.994" cy="11.979" r="3.003"></circle>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
            </svg>
            </div>
            </div>

        </div>

      <div className={styles.footerPart}>
        © { moment().format('YYYY') } { t('copyRight.label') }
      </div>
    </footer>

  )

}

export default Footer
