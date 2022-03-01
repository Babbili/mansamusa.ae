import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { firestore } from '../../../firebase/config'
import AppContext from '../../../components/AppContext'
import SignUpButton from '../../../components/UI/SignUpButton/SignUpButton'
import { scrollToTop } from '../../../utils/utils'
import { Redirect } from 'react-router-dom'
import styles from './SupplierPlan.module.scss'
import f1 from '../../../assets/start.png'
import f2 from '../../../assets/customer.png'
import f3 from '../../../assets/money.png'
import f4 from '../../../assets/delivery.png'
import f5 from '../../../assets/service.png'
import SupplierPaymentForm from './SupplierPaymentForm/SupplierPaymentForm'
import SupplierPlanItems from './SupplierPlanItems/SupplierPlanItems'
import SupplierPlanCurrent from './SupplierPlanCurrent/SupplierPlanCurrent'


const SupplierPlan = ({ isTrial, approved, isSubscribed, currentStore, ...props }) => {

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  let { t } = useTranslation()
  const bottom = useRef()

  const [loading, setLoading] = useState(false)
  const [subscriptions, setSubscriptions] = useState([])
  const [current, setCurrent] = useState(null)
  const [selected, setSelected] = useState({})
  const [isUnsubscribe] = useState(false)
  const [isError] = useState(false)
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [selectedByClick, setSelectedByClick] = useState(false)

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollToTop(bottom.current.clientHeight, 'smooth')
    }, 100)
  }

  useEffect(() => {

    return firestore.collection('mmProducts')
    .where('stripe_metadata_country', '==', currentStore.address.country.en)
    .where('stripe_metadata_isSpecialApprove', '==', currentStore.isSpecialApprove)
    .onSnapshot(snapshot => {
      let subscription = []
      snapshot.forEach(doc => {
        subscription = [...subscription, {id: doc.id, ...doc.data()}]
      })
      setSubscriptions(subscription)
    })

  }, [currentStore])

  useEffect(() => {

    return firestore.collection('subscriptions')
      .where('stripe.customerId', '==', currentStore.stripe.customerId)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          setCurrent({id: doc.id, ...doc.data()})
        })
      })

  }, [currentStore])

  // useEffect(() => {
  //   firestore.collection('users')
  //     .doc(currentUser.uid)
  //     .collection('stores').doc(currentStore.id).update({
  //     isSubscribed : false,
  //     isTrial: true,
  //     trialExpiresIn: 3
  //   })
    

  // })

  const [msg, setMsg] = useState('Select a plan then subscribe')
  const handleSubscribe = async (priceId, customerId) => {
    setSelectedByClick(true)
    setLoading(true)
    
    const { subscriptionId, clientSecret } = await fetch('https://subscriptions.mansamusa.ae/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId, customerId
      }),
    }).then(r => r.json())

    setSubscriptionData({ subscriptionId, clientSecret })
    setLoading(false)
  }

  const handleCancel = async (subscriptionId) => {

    setLoading(true)

    await fetch('https://subscriptions.mansamusa.ae/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId
      }),
    }).then(r => r.json())

    setSubscriptionData(null)
    setLoading(false)
    scrollToBottom()

  }

  // console.log('currentUser', currentUser)
   console.log('subscriptions', subscriptions)
   console.log('currentStore', currentStore)
   console.log('current', current)
   console.log('selected', selected)
   console.log('subscriptionData', subscriptionData)

  return(

    isUnsubscribe ?
      <div className={styles.SupplierPlan} ref={bottom}>
      </div> :
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
                  null : null
        }

        {
          (approved && isTrial && !isSubscribed) || (approved && !isTrial && isSubscribed)
          || (approved && !isTrial && !isSubscribed) ?
            <div className={styles.SupplierPlan} ref={bottom}>

              <div
                className={styles.title}
                style={{
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}
              >
                { t('SubscriptionPlan.label')}
              </div>

              {
                currentStore ?
                currentStore.store.country.en == 'Russia' ?
                <p className={styles.sellinDubai} >{t('sellInDubai.label')}</p>
                : <></> : <></>
              }

              <div className='container-fluid'>

                {
                  current ?
                    <div className='row'>
                      <div className='col-12'>
                        <h3
                          style={{
                            textAlign: lang === 'ar' ? 'right' : 'left'
                          }}
                        >
                          Current Plan
                        </h3>
                      </div>
                    </div> :
                    <div className='row'>
                      <div className='col-12'>
                        <h3
                          style={{
                            textAlign: 'center'
                          }}
                        >
                          { t('subscribeWithUsNow.label') }
                        </h3>
                      </div>
                    </div>
                }

                {
                  subscriptions.length > 0 && current === null ?
                    <SupplierPlanItems
                      current={current}
                      selected={selected}
                      setSelected={setSelected}
                      subscriptions={subscriptions}
                      subscriptionData={subscriptionData}
                      isSpecialApprove={currentStore.isSpecialApprove}
                      selectedByClick={selectedByClick}
                    /> :
                    <SupplierPlanCurrent
                      isError={isError}
                      current={current}
                      setCurrent={setCurrent}
                      currentUser={currentUser}
                      currentStore={currentStore}
                    />
                }

                {
                  subscriptionData ?
                    <SupplierPaymentForm
                      isLoading={loading}
                      selected={selected}
                      currentUser={currentUser}
                      currentStore={currentStore}
                      handleCancel={handleCancel}
                      subscriptionData={subscriptionData}
                    /> : null
                }


                {
                  !subscriptionData && !current && subscriptions[0] ?
                    <div className={`${styles.subBtn} row`}>
                      <div className='col-6'>
                        <SignUpButton
                          type={'custom'}
                          loading={loading}
                          title={'Subscribe Now'}
                          onClick={ () => handleSubscribe(subscriptions[0].stripe.priceId, currentStore.stripe.customerId) }
                          disabled={false}
                          isWide={true}
                        />
                      </div>
                    </div> : null
                }

                {
                  current ? null :
                    <>
                      <div className='row'>
                        <div className='col-12'>
                          <h3
                            style={{
                              textAlign: lang === 'ar' ? 'right' : 'left'
                            }}
                          >
                            { t('virtualShopsSubscription.label') }
                          </h3>
                        </div>
                      </div>
                      <div className={`${styles.subscriptionFeatures} row justify-content-center`}>
                        <div className={`${styles.item} col-lg-4 col-12`}>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url(${f1})`
                            }}
                          />
                          <h5>
                            {
                              lang === 'ar' ?
                                'ابدأ البيع اليوم' : 
                                lang === 'en' ?
                                'Get started selling today' :
                                'Начните продавать сегодня'
                            }
                          </h5>
                          <div className={styles.description}>
                            {
                              lang === 'ar' ?
                                'عندما تبيع على  منسى موسى، لا حاجة لدفع ميزانيات تسويق كبيرةللوصول لجمهورك المستهدف. البيع مع منسى موسى يتيح لك الوصول لجمهورك المستهدف الذي يبحث عن مشتريات مميزة بطرق أسهل للشراء من خلال منصة تجمع المنتجات المميزة, السهولة في الشراء وتوفير الدفع الآمن.' :
                                lang == 'en' ?
                                'When you sell on MansaMusa, you make your products easier to find and easier to buy by secured payment methods. No need to pay big marketing budgets' :
                                'Когда вы продаете на MansaMusa, ваши товары проще найти и купить, используя безопасные способы оплаты. Вам не потребуется большой маркетинговый бюджет'
                            }
                          </div>
                        </div>
                        <div className={`${styles.item} col-lg-4 col-12`}>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url(${f2})`
                            }}
                          />
                          <h5>
                            {
                              lang === 'ar' ?
                                'الوصول إلى المزيد من العملاء' :
                                lang === 'en' ?
                                'Reach more customers' :
                                'Найдите больше клиентов'
                            }
                          </h5>
                          <div className={styles.description}>
                            {
                              lang === 'ar' ?
                                'سواء كنت شركة ناشئة جديدة أو كنت ترغب في زيادة مبيعات عملك الحالي ولكنك تحتاج إلى أن يكون عملك جزءًا من مجتمع الأعمال التجارية المحلية عبر الإنترنت ، فإن العمل عبر الإنترنت مع MansaMusa يساعدك على تحقيق أهدافك.' :
                                lang === 'en' ?
                                'Whether you are a new business start-up or you want to increase your existing business sales, working online with MansaMusa helps you achieve your goals' :
                                'Независимо от того, являетесь ли ваш бизнес стартапом, или вы просто хотите увеличить продажи существующего бизнеса, работа онлайн с MansaMusa помогает вам достичь ваших целей'
                            }
                          </div>
                        </div>
                        <div className={`${styles.item} col-lg-4 col-12`}>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url(${f3})`
                            }}
                          />
                          <h5>
                            {
                              lang === 'ar' ?
                                'جني المال' :
                                lang ==='en' ?
                                'Make money' :
                                'Зарабатывайте'
                            }
                          </h5>
                          <div className={styles.description}>
                            {
                              lang === 'ar' ?
                                'الخيارات مرنة في منسى موسى ، لذا يمكنك العثور على المجموعة التي حسب الياقة التي تختارها و التي تناسبك وتناسب أهدافك.' :
                                lang === 'en' ?
                                'The cost to sell in MansaMusa stores depends on which package you subscribe, and you will access all the MansaMusa business tools. The options are flexible, so you can find the combo that works best for you and your goals' :
                                'Стоимость продаж в магазинах MansaMusa зависит от того, какой пакет подписки и соответствующий набор бизнес-инструментов MansaMusa вы выберите. Варианты настроены гибко, поэтому вы можете найти комбинацию, которая работает лучше всего именно для вас и ваших целей'
                            }
                          </div>
                        </div>
                        <div className={`${styles.item} col-lg-4 col-12`}>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url(${f4})`
                            }}
                          />
                          <h5>
                            {
                              lang === 'ar' ?
                                'تحقيق الرضا' :
                                lang === 'en' ?
                                'Deliver satisfaction' :
                                'Доставляет удовольствие'
                            }
                          </h5>
                          <div className={styles.description}>
                            {
                              lang === 'ar' ?
                                'لا تقلق بشأن الشحن والإرجاع وخدمة العملاء ، اترك الأمر لنا علينا.' :
                                lang === 'en' ?
                                'Don’t worry about the shipping, returns and customer service leave it to us with Fulfillment by MansaMusa' :
                                'Не беспокойте о доставке, возврате и обслуживание клиентов, оставьте это нам с помощью сервиса Fulfillment от MansaMusa'
                            }
                          </div>
                        </div>
                        <div className={`${styles.item} col-lg-4 col-12`}>
                          <div
                            className={styles.img}
                            style={{
                              backgroundImage: `url(${f5})`
                            }}
                          />
                          <h5>
                            {
                              lang === 'ar' ?
                                'دع عملك ينمو بسرعة' :
                                lang === 'en' ?
                                'Let your business grow quickly' :
                                'Дайте возможность быстрого роста вашему бизнесу'
                            }
                          </h5>
                          <div className={styles.description}>
                            {
                              lang === 'ar' ?
                                'تم تصميم منصات البائع لدينا مع وضع مخزونك في الاعتبار ، ولا يوجد حد أدنى لعدد المنتجات التي تضيفها. نتعامل مع التفاصيل لتوفير الوقت ، حتى تتمكن انت من التركيز على عملك.' :
                                lang === 'en' ?
                                'Our fulfillment platforms are built with your inventory in mind, and there\'s no minimum for the number of products you add. We handle the details to save you time, so you can focus on your business.' :
                                'Наши платформы построены с учетом ваших потребностей, и нет минимального количества товаров, которые вы хотите добавить. Мы берём на себя детали, чтобы сэкономить ваше время и дать вам возможность сосредоточиться на своем бизнесе'
                            }
                          </div>
                        </div>
                      </div>
                    </>
                }

              </div>

            </div> 
             : null
         }

      </>

  )

}

export default SupplierPlan
