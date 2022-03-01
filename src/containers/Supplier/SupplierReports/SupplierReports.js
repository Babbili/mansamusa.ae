import React, { useContext } from 'react'
import Chart from 'react-google-charts'
import AppContext from '../../../components/AppContext'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import styles from './SupplierReports.module.scss'


const SupplierReports = ({ isTrial, approved, isSubscribed }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  return(

    <>

      {
        !approved && !isTrial && !isSubscribed ?
          <Redirect
            to={'/supplier/stores'}
          /> :
          approved && isTrial && !isSubscribed ?
            null :
            approved && !isTrial && isSubscribed ?
              null :
              approved && !isTrial && !isSubscribed ?
                <Redirect
                  to={'/supplier/stores'}
                /> : null
      }

      {
        (approved && isTrial && !isSubscribed) || (approved && !isTrial && isSubscribed) ?
          <div className={styles.SupplierReports}>

            <div
              className={styles.title}
              style={{
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}
            >
              { t('mySalesReport.label') }
            </div>

            <div className='container-fluid'>

              <div className={`${styles.dashboard} row`}>

                <div
                  className={`${styles.item} col-lg-4 col-12`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('newOrders.label') }
                    </div>
                    <div className={styles.description}>
                      0% (last 30 days)
                      {/*New orders for chosen period of time from 01.11.2020 to 30.11.2020*/}
                    </div>
                    <div className={styles.total}>
                      0
                      <div style={{width: '5px'}} />
                      <small>{ t('orders.label') }</small>
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.item} col-lg-4 col-12 mt-4 mt-lg-0`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('income.label') }
                    </div>
                    <div className={styles.description}>
                      { t('increasedBy.label') } 0% (last 30 days)
                    </div>
                    <div className={styles.total}>
                      <small>AED</small>
                      <div style={{width: '5px'}} />
                      0.00
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.item} col-lg-4 col-12 mt-4 mt-lg-0`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('newUsers.label') }
                    </div>
                    <div className={styles.description}>
                      0% { t('lessEarnings.label') } (last 30 days)
                    </div>
                    <div className={styles.total}>
                      0
                      <div style={{width: '5px'}} />
                      <small>{ t('users.label') }</small>
                    </div>
                  </div>
                </div>

              </div>

              <div className={`${styles.dashboard} row mt-4`}>

                <div
                  className={`${styles.item} col-lg-6 col-12 mb-4`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>

                    <div className={styles.itemTitle}>
                      { t('summary.label') }
                    </div>

                    <div className='row'>

                      <div className='col-3'>
                        AED 0<br/>
                        <small>{ t('products.label') }</small>
                      </div>

                      <div className='col-3'>
                        AED 0<br/>
                        <small>{ t('sales.label') }</small>
                      </div>

                      <div className='col-3'>
                        AED 0<br/>
                        <small>{ t('cost.label') }</small>
                      </div>

                      <div className='col-3'>
                        AED 0<br/>
                        <small>{ t('revenue.label') }</small>
                      </div>

                    </div>

                    <div className='row'>

                      <div className='col-12'>

                        <Chart
                          width={'100%'}
                          height={'300px'}
                          chartType="LineChart"
                          loader={<div>Loading Chart</div>}
                          data={[
                            ['x', t('products.label')],
                            [0, 0],
                            [1, 10],
                            [2, 23],
                            [3, 17],
                            [4, 18],
                            [5, 9],
                            [6, 11],
                            [7, 27],
                            [8, 33],
                            [9, 40],
                            [10, 32],
                            [11, 35],
                          ]}
                          options={{
                            hAxis: {
                              title: t('time.label'),
                            },
                            vAxis: {
                              title: t('products.label'),
                            },
                            series: {
                              0: { curveType: 'function' },
                            },
                            colors: ["#ffb93f"]
                          }}
                          rootProps={{ 'data-testid': '1' }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

                <div
                  className={`${styles.item} col-lg-6 col-12 mb-4`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>

                    <div className={styles.itemTitle}>
                      { t('topSellingProducts.label') }
                    </div>

                  </div>
                </div>

              </div>

              <div className={`${styles.dashboard} row mt-4`}>

                <div
                  className={`${styles.item} col-lg-4 col-12`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('orderActivity.label') }
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.item} col-lg-4 col-12 mt-4 mt-lg-0`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('recentProducts.label') }
                    </div>
                  </div>
                </div>

                <div
                  className={`${styles.item} col-lg-4 col-12 mt-4 mt-lg-0`}
                  style={{
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}
                >
                  <div className={styles.wrapper}>
                    <div className={styles.itemTitle}>
                      { t('recentBuyers.label') }
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div> : null
      }

      {/*<div className={`${styles.emptyData} row`}>*/}
      {/*  <div className='col-12 text-center'>*/}
      {/*    <img src={noProducts} alt={'Nothing Here Yet'} />*/}
      {/*    <h3>*/}
      {/*      No reports yet*/}
      {/*    </h3>*/}
      {/*    <div className={styles.description}>*/}
      {/*      Your reports will be shown here as soon as sales start.*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

    </>

  )

}

export default SupplierReports
