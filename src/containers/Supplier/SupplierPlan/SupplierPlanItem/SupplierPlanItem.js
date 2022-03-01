import React, { useContext } from 'react'
import moment from 'moment'
import 'moment/locale/ar'
import 'moment/locale/en-gb'
import AppContext from '../../../../components/AppContext'
import { useTranslation } from 'react-i18next'
import styles from './SupplierPlanItem.module.scss'


const SupplierPlanItem = ({ selected, current, selectPlan, subscription, subscriptionData, isSpecialApprove, selectedByClick }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()
  // let ratio = ((subscription.oldPrice - subscription.unit_amount) / subscription.oldPrice * 100).toFixed(0)

  moment.locale(lang)

  return (

    <div
      className={`col-md-4 col-sm-6 col-sm-12 mb-4 mb-lg-0`}
      style={{
        pointerEvents: subscription.id !== selected.id && subscriptionData ? 'none' : 'all',
      }}
    >

      <div
        className={`
          ${styles.SupplierPlanItem}
          ${subscription.id === selected.id || selectedByClick ? styles.selected : ''}
        `}
        style={{
          minHeight: isSpecialApprove ? '0px' : '345px'
        }}
        onClick={() => {
          if (!current) {
            selectPlan(subscription)
          }
        }}
      >

        <div className={styles.title}>
          { lang === 'en' ?
          `${ subscription.name } `:
          lang === 'ar' ?
          'أساسي' : 'План продаж'
          }
        </div>

        {
          !isSpecialApprove ?
            <div className={styles.priceBlock}>

              <div className={styles.price}>
                <div className={styles.currency}>
                  AED
                </div>
                { subscription.unit_amount }
              </div>

            </div> 

            : 
            <>
              <div className={styles.speacialApproved__sub}>
                <p>{t('specialApproved.label')}<br />{t('oneYsub.label')}</p>
              </div>
              
              <div className={styles.priceBlock}>
              
              <div className={styles.price}>
                <div className={styles.currency}>
                {subscription.currency}
                </div>
                { subscription.unit_amount }
              </div>
              
              </div> 
            </>
        }

        <div className={styles.benefits}>

          <div dangerouslySetInnerHTML={{__html: subscription.additionalDescriptionHtml[lang]}} />
        </div>

      </div>
    </div>

  )

}

export default SupplierPlanItem
