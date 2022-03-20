const functions = require('firebase-functions')
const admin = require('firebase-admin')
const request = require('request')
const moment = require('moment')
const readXlsxFile = require('read-excel-file/node')
const fs = require('fs')
const { google } = require('googleapis')
const express = require('express')
const cors = require('cors')
const app = express()
const ccav = require('./ccavutil.js')
const qs = require('querystring')
const fetch = require('node-fetch')
const axios = require('axios')
const bodyParser = require('body-parser')
const algoliasearch = require('algoliasearch')
const { deliveryRequest, deliveryApprove } = require('./delivery/utils')
const { updateProducts } = require('./utils/utils')
require('dotenv').config({ path: '.env' })

function rawBodySaver (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

function toCardFormat (card) {
  const cardArr = card.split('')
  cardArr.splice(6, 0, "******")
  return cardArr.join("").replace(/(.{4})/g, '$1 ')
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_K,
  authDomain: process.env.REACT_APP_AUTH_D,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJ_ID,
  storageBucket: process.env.REACT_APP_STRG_B,
  messagingSenderId: process.env.REACT_APP_MSG_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MSGR_ID
}

admin.initializeApp(firebaseConfig)

const firestore = admin.firestore()


// Stripe ///////////////////////////////////////////////////////////////////////////////////////////

// Set Up Stripe
const Stripe = require('stripe')
const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY)

exports.createStripeProductAndPrice = functions.firestore
  .document('suppliersSubscriptions/{id}')
  .onCreate(async (snap, context) => {

    const id = context.params.id
    const { name, description, subscription, unit_amount, currency, interval, interval_count, usage_type } = snap.data()

    // Create a new product object
    const product = await stripe.products.create({
      name: name,
      active: true,
      description: description.en,
      metadata: {
        subscription: subscription.en.toLowerCase()
      }
    })

    // Create a new price
    const price = await stripe.prices.create({
      unit_amount: unit_amount * 100,
      currency: currency.en.toLowerCase(),
      recurring: {
        interval: interval.en.toLowerCase(),
        interval_count: interval_count,
        usage_type: usage_type
      },
      product: product.id,
      active: true
    })

    await firestore
      .collection('suppliersSubscriptions')
      .doc(id)
      .update({
        stripe: {
          productId: product.id,
          priceId: price.id
        }
      })
      .then(() => {})

  })

exports.createStripeCustomer = functions.firestore
  .document('users/{userId}/stores/{storeId}')
  .onCreate(async (snap, context) => {

    const userId = context.params.userId
    const storeId = context.params.storeId

    const { companyEmail, storeName, companyPhone, address, storeDescription } = snap.data()

    const customer = await stripe.customers.create({
      email: companyEmail,
      name: storeName,
      phone: companyPhone,
      address: {
        city: address.city.en,
        country: 'AE',
        line1: address.customerAddress
      },
      description: storeDescription.en
    })

    await firestore
      .doc(`users/${userId}/stores/${storeId}`)
      .update({
        stripe: {
          customerId: customer.id
        }
      })

  })




// Algolia //////////////////////////////////////////////////////////////////////////////////////////

// Set up Algolia
const APP_ID = process.env.REACT_APP_ALGOLIA_APP_ID
const ADMIN_KEY = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

const algoliaClient = algoliasearch(APP_ID, ADMIN_KEY)

exports.algoliaBrandsOnUpdate = functions.firestore.document('users/{userId}/stores/{storeId}')
.onUpdate(async (change, context) => {

  const index = algoliaClient.initIndex('Brands')
  const data = change.after.data()
  const objectID = change.after.id
  const { userId } = context.params
  const before = change.before.data().approved
  const after = change.after.data().approved

  const record = {
    objectID,
    title: data.storeName,
    category: data.product,
    image: data.store.storeLogo.length > 0 ? data.store.storeLogo[0].url : '',
    description: data.storeDescription
  }

  // !approved + !isTrial + !isSubscribed
  // approved + isTrial + !isSubscribed +
  // approved + !isTrial + !isSubscribed +
  // approved + !isTrial + isSubscribed

  if (data.approved && data.isTrial && !data.isSubscribed) {
    if(data.store.country.en == 'UAE') {
      if (before !== after) {
        firestore.collection('users').doc(userId)
        .get()
        .then(doc => {
          const name = doc.data().displayName
          const email = doc.data().email
          firestore.collection('mail')
          .add({
            to: email,
            template: {
              name: 'storeApprovedUAE',
              data: {
                subject: 'Congratulation, your store is approved!',
                previewText: 'and you are now officially part of our community that includeds creative artists & independent entrepreneurs',
                displayName: name
              },
            },
          })
        })
      }
    } else if(data.store.country.en == 'Russia') {
      if (before !== after) {
        firestore.collection('users').doc(userId)
        .get()
        .then(doc => {
          const name = doc.data().displayName
          const email = doc.data().email
          firestore.collection('mail')
          .add({
            to: email,
            template: {
              name: 'storeApprovedRussia',
              data: {
                subject: 'Поздравляем, ваш магазин одобрен',
                previewText: 'Поздравляем, ваш магазин одобрен',
                displayName: name
              },
            },
          })
        })
      }
    } else {
    // store approved email
    if (before !== after) {
      firestore.collection('users').doc(userId)
      .get()
      .then(doc => {
        const name = doc.data().displayName
        const email = doc.data().email
        firestore.collection('mail')
        .add({
          to: email,
          template: {
            name: 'storeApproved',
            data: {
              subject: 'Congratulation, your store is approved!',
              previewText: 'and you are now officially part of our community that includeds creative artists & independent entrepreneurs',
              displayName: name
            },
          },
        })
      })
    }
    }
    return index.saveObject(record)

  } else if (data.approved && !data.isTrial && !data.isSubscribed) {
    if(data.store.country.en == 'UAE') {
    // trial expired
    firestore.collection('users').doc(userId)
    .get()
    .then(doc => {

      const name = doc.data().displayName
      const email = doc.data().email

      firestore.collection('mail')
      .add({
        to: email,
        template: {
          name: 'trialExpiredUAE',
          data: {
            subject: 'Trial Expired.',
            previewText: 'This email is to inform you that your free trial has ended and your store is now temporary stopped.',
            displayName: name
          },
        },
      })

    })

    firestore.collection('products')
    .where('store', '==', objectID)
    .onSnapshot(snap => {
      const index = algoliaClient.initIndex('Products')
      snap.forEach(doc => {
        index.deleteObject(doc.id)
      })
    })

    return index.deleteObject(objectID)
  }else if(data.store.country.en == 'Russia') {
    // trial expired
    firestore.collection('users').doc(userId)
    .get()
    .then(doc => {

      const name = doc.data().displayName
      const email = doc.data().email

      firestore.collection('mail')
      .add({
        to: email,
        template: {
          name: 'trialExpiredRussia',
          data: {
            subject: 'поскольку 3-дневный пробный период закончился',
            previewText: 'поскольку 3-дневный пробный период закончился, и работа временно приостановлена',
            displayName: name
          },
        },
      })

    })

    firestore.collection('products')
    .where('store', '==', objectID)
    .onSnapshot(snap => {
      const index = algoliaClient.initIndex('Products')
      snap.forEach(doc => {
        index.deleteObject(doc.id)
      })
    })

    return index.deleteObject(objectID)

  } else {
    firestore.collection('users').doc(userId)
    .get()
    .then(doc => {

      const name = doc.data().displayName
      const email = doc.data().email

      firestore.collection('mail')
      .add({
        to: email,
        template: {
          name: 'trialExpired',
          data: {
            subject: 'Trial Expired.',
            previewText: 'This email is to inform you that your free trial has ended and your store is now temporary stopped.',
            displayName: name
          },
        },
      })

    })

    firestore.collection('products')
    .where('store', '==', objectID)
    .onSnapshot(snap => {
      const index = algoliaClient.initIndex('Products')
      snap.forEach(doc => {
        index.deleteObject(doc.id)
      })
    })

    return index.deleteObject(objectID)
  }

  } else if (data.approved && !data.isTrial && data.isSubscribed) {

    firestore.collection('products')
    .where('store', '==', objectID)
    .onSnapshot(snap => {
      const index = algoliaClient.initIndex('Products')
      snap.forEach(doc => {

        const data = doc.data()
        const objectID = doc.id

        const record = updateProducts(data, objectID)

        if (data.isApproved) {
          return index.saveObject(record)
        }

        index.deleteObject(doc.id)

      })
    })

    return index.saveObject(record)

  }

})

exports.algoliaBrandsOnDelete = functions.firestore.document('users/{userId}/stores/{storeId}')
.onDelete(async (snapshot, context) => {
  const index = algoliaClient.initIndex('Brands')
  index.deleteObject(snapshot.id)
})

exports.algoliaProductsOnCreate = functions.firestore.document('products/{productId}')
.onCreate(async (snapshot, context) => {

  const index = algoliaClient.initIndex('Products')
  const data = snapshot.data()
  const objectID = snapshot.id

  const record = updateProducts(data, objectID)

  // send product email
  firestore.collectionGroup('stores')
  .where('storeName', '==', data.storeName)
  .onSnapshot(snap => {

    snap.forEach(doc => {
      if(doc.data().store.country.en == 'UAE') {
        let path = doc.ref.path
      let supplierId = path.split('/')[1]
      firestore.collection('users').doc(supplierId)
      .get()
      .then(doc => {
        const name = doc.data().displayName
        const email = doc.data().email
        firestore.collection('mail').add({
          to: email,
          template: {
            name: 'newProductAddedUAE',
            data: {
              subject: 'New Product Added',
              previewText: 'You have successfully added a new product. Your new activity now will go under review and you will be able to view it soon.',
              displayName: name,
              number: '1',
              plural: 'product',
              products: [data]
            },
          },
        })
        .then(r => {})
      })
      } else if(doc.data().store.country.en == 'Russia') {
        let path = doc.ref.path
      let supplierId = path.split('/')[1]
      firestore.collection('users').doc(supplierId)
      .get()
      .then(doc => {
        const name = doc.data().displayName
        const email = doc.data().email
        firestore.collection('mail').add({
          to: email,
          template: {
            name: 'newProductAddedRussia',
            data: {
              subject: 'Ваш товар будет рассмотрен, и вы сможете его увидеть в ближайшее время. Вы получите уведомление',
              previewText: 'Ваш товар будет рассмотрен, и вы сможете его увидеть в ближайшее время. Вы получите уведомление',
              displayName: name,
              number: '1',
              plural: 'product',
              products: [data]
            },
          },
        })
        .then(r => {})
      })
      } else {

      let path = doc.ref.path
      let supplierId = path.split('/')[1]
      firestore.collection('users').doc(supplierId)
      .get()
      .then(doc => {
        const name = doc.data().displayName
        const email = doc.data().email
        firestore.collection('mail').add({
          to: email,
          template: {
            name: 'newProductAdded',
            data: {
              subject: 'New Product Added',
              previewText: 'You have successfully added a new product. Your new activity now will go under review and you will be able to view it soon.',
              displayName: name,
              number: '1',
              plural: 'product',
              products: [data]
            },
          },
        })
        .then(r => {})
      })
      }
    })

  })

  if (data.isApproved) {
    if (data.status.en === 'Active') {
      return index.saveObject(record)
    }
  }

})

exports.algoliaProductsOnUpdate = functions.firestore.document('products/{productId}')
.onUpdate(async (change, context) => {

  const index = algoliaClient.initIndex('Products')
  const data = change.after.data()
  const objectID = change.after.id
  const before = change.before.data().isApproved
  const after = change.after.data().isApproved

  const record = updateProducts(data, objectID)

  if (before == false && after == true) {
    // send product email
    firestore.collectionGroup('stores')
    .where('storeName', '==', data.storeName)
    .onSnapshot(snap => {

      snap.forEach(doc => {
        if(doc.data().store.country.en == 'UAE') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'productApprovedUAE',
                data: {
                  subject: 'Products Approved',
                  previewText: 'Congratulation! Your products you have added is approved and now you can view them online on your store.',
                  displayName: name,
                  products: [data]
                },
              },
            })
            .then(r => {})
  
          })
        } else if(doc.data().store.country.en == 'Russia') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'productApprovedRussia',
                data: {
                  subject: 'Поздравляем! подтвержден и отображается в вашем магазине на',
                  previewText: 'Поздравляем! подтвержден и отображается в вашем магазине на ',
                  displayName: name,
                  products: [data]
                },
              },
            })
            .then(r => {})
  
          })
        } else {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]
        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {
          const name = doc.data().displayName
          const email = doc.data().email
          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'productApproved',
              data: {
                subject: 'Products Approved',
                previewText: 'Congratulation! Your products you have added is approved and now you can view them online on your store.',
                displayName: name,
                products: [data]
              },
            },
          })
          .then(r => {})

        })
        }
      })

    })
  }

  if(before == true && after == false) {
    firestore.collectionGroup('stores')
    .where('storeName', '==', data.storeName)
    .onSnapshot(snap => {

      snap.forEach(doc => {
        if(doc.data().store.country.en == 'UAE') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'productEdit',
                data: {
                  subject: 'You have recently edited product',
                  previewText: 'You have recently edited product. The product edit will go under review',
                  displayName: name,
                  products: [data]
                },
              },
            })
            .then(r => {})
  
          })
        } else if(doc.data().store.country.en == 'Russia') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'productEditRussia',
                data: {
                  subject: 'Вы успешно добавили товар',
                  previewText: 'Вы успешно добавили товар. Ваш товар будет рассмотрен, и вы сможете его увидеть в ближайшее время',
                  displayName: name,
                  products: [data]
                },
              },
            })
            .then(r => {})
  
          })
        } else {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]
        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {
          const name = doc.data().displayName
          const email = doc.data().email
          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'productEdit',
              data: {
                subject: 'You have recently edited product',
                previewText: 'You have recently edited product. The product edit will go under review',
                displayName: name,
                products: [data]
              },
            },
          })
          .then(r => {})

        })
        }
      })

    })
  }

  if (data.isApproved) {
    if (data.isBlocked) {
      return index.deleteObject(objectID)
    } else {
      if (data.status.en === 'Active') {
        return index.saveObject(record)
      } else {
        return index.deleteObject(objectID)
      }
    }
  }

})

exports.algoliaProductsOnDelete = functions.firestore.document('products/{productId}')
.onDelete(async (snapshot, context) => {
  const index = algoliaClient.initIndex('Products')
  index.deleteObject(snapshot.id)
})

// Algolia //////////////////////////////////////////////////////////////////////////////////////////



// send not approved products
exports.notApprovedProductsNotification = functions.pubsub.schedule('40 1 * * *')
.timeZone('Asia/Dubai')
.onRun( async(context) => {

  await admin.firestore().collection('products')
  .where('isApproved', '==', false)
  .onSnapshot(snapshot => {
    let products = []
    snapshot.forEach(doc => {
      products = [...products, {...doc.data()}]
    })

    let stores = products.map(m => m.storeName)

    for(const store of stores) {

      let storeProducts = products.filter(f => f.storeName === store)

      // send not approved product email
      firestore.collectionGroup('stores')
      .where('storeName', '==', store)
      .onSnapshot(snap => {

        snap.forEach(doc => {
          if(doc.data().store.country.en == 'UAE') {
            let path = doc.ref.path
            let supplierId = path.split('/')[1]
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
              const name = doc.data().displayName
              const email = doc.data().email
              firestore
              .collection('mail')
              .add({
                to: email,
                template: {
                  name: 'notApprovedProductsUAE',
                  data: {
                    subject: 'Your Products are not Approved',
                    previewText: 'Products you have added is not approved and now you can view them online on your store.',
                    displayName: name,
                    number: storeProducts.length,
                    plural: 'products',
                    products: storeProducts
                  },
                },
              })
              .then(r => {})
            })
          } else if(doc.data().store.country.en == 'Russia') {
            let path = doc.ref.path
            let supplierId = path.split('/')[1]
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
              const name = doc.data().displayName
              const email = doc.data().email
              firestore
              .collection('mail')
              .add({
                to: email,
                template: {
                  name: 'notApprovedProductsRussia',
                  data: {
                    subject: 'Мы с сожалением сообщаем вам, что товар ',
                    previewText: 'Мы с сожалением сообщаем вам, что товар ',
                    displayName: name,
                    number: storeProducts.length,
                    plural: 'products',
                    products: storeProducts
                  },
                },
              })
              .then(r => {})
            })
          } else {

          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore
            .collection('mail')
            .add({
              to: email,
              template: {
                name: 'notApprovedProducts',
                data: {
                  subject: 'Your Products are not Approved',
                  previewText: 'Products you have added is not approved and now you can view them online on your store.',
                  displayName: name,
                  number: storeProducts.length,
                  plural: 'products',
                  products: storeProducts
                },
              },
            })
            .then(r => {})
          })
          }
        })

      })

    }

  })

})


// Idempotent functions
const alreadyTriggered = eventId => {

  const validEventId = eventId.replace('/', '')

  const firestore = admin.firestore()
  return firestore.runTransaction(async transaction => {
    const ref = firestore.doc(`eventIds/${validEventId}`)
    const doc = await transaction.get(ref)
    if (doc.exists) {
      console.error(`Already triggered function for event: ${validEventId}`)
      return false
    } else {
      transaction.set(ref, {})
      return true
    }
  })
}


exports.onUserStatusChanged = functions.database
.ref('/status/{uid}')
.onUpdate(async (change, context) => {

  const eventStatus = change.after.val()

  const userStatusFirestoreRef = firestore.collection('users')
  .doc(context.params.uid)

  const statusSnapshot = await change.after.ref.once('value')
  const status = statusSnapshot.val()

  if (status.last_changed > eventStatus.last_changed) {
    return null
  }

  eventStatus.last_changed = Math.round(eventStatus.last_changed / 1000)

  return userStatusFirestoreRef.update({
    status: eventStatus
  })

})


exports.addMultipleProductsTask = functions.https.onCall((data, context) => {

  const schema = {
    'status': {
      prop: 'status',
      type: String
    },
    'productQuantity': {
      prop: 'productQuantity',
      type: Number
    },
    'productName': {
      prop: 'productName',
      type: String
    },
    'productNameAr': {
      prop: 'productNameAr',
      type: String
    },
    'productNameRu': {
      prop: 'productNameRu',
      type: String
    },
    'productDescription': {
      prop: 'productDescription',
      type: String
    },
    'productDescriptionAr': {
      prop: 'productDescriptionAr',
      type: String
    },
    'productDescriptionRu': {
      prop: 'productDescriptionRu',
      type: String
    },
    'productMpn': {
      prop: 'productMpn',
      type: String
    },
    'productHScode': {
      prop: 'productHScode',
      type: Number
    },
    'productWeight': {
      prop: 'productWeight',
      type: Number
    },
    'productWidth': {
      prop: 'productWidth',
      type: Number
    },
    'productHeight': {
      prop: 'productHeight',
      type: Number
    },
    'productLength': {
      prop: 'productLength',
      type: Number
    },
    'productPrice': {
      prop: 'productPrice',
      type: Number
    },
    'discount': {
      prop: 'discount',
      type: Number
    },
    'productType': {
      prop: 'productType',
      type: String
    }
  }

  const csvFile = data.file
  const userId = data.userId
  const taskId = data.taskId
  const store = data.store
  const storeName = data.storeName
  const homeCategory = data.category

  let categories = []

  admin.firestore()
  .collection('productTypes')
  .where('title.en', '==', homeCategory)
  .get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      categories = [...categories, {id: doc.id, ...doc.data()}]
    })
  })
  .then(() => {

    readXlsxFile(request.get(csvFile), { schema })
    .then((data) => {

      return data.rows.map(json => {

        let arrLen = data.rows.length
        let len = 0

        let amount = Number(json.productPrice - (json.productPrice * 13 / 100)).toFixed(2)
        let discountPrice = Number(json.productPrice - (json.productPrice * json.discount / 100)).toFixed(2)
        let oldDiscountPrice = Number(discountPrice - (discountPrice * 13 / 100)).toFixed(2)

        admin.firestore().collection('products')
        .add({
          store: store,
          storeName: storeName,
          status: json.status,
          statusOptions: [
            {
              id: 'active',
              title: {
                en: 'Active',
                ar: 'نشيط'
              }
            },
            {
              id: 'inactive',
              title: {
                en: 'Inactive',
                ar: 'غير نشط'
              }
            }
          ],
          productQuantity: json.productQuantity,
          productName: {
            en: json.productName,
            ar: json.productNameAr,
            ru: json.productNameRu
          },
          productNameAr: json.productNameAr,
          productNameRu: json.productNameRu,
          productDescription: {
            en: json.productDescription,
            ar: json.productDescriptionAr,
            ru: json.productDescriptionRu
          },
          productDescriptionAr: json.productDescriptionAr,
          productDescriptionRu: json.productDescriptionRu,
          productMpn: json.productMpn,
          productHScode: json.productHScode,
          productWeight: json.productWeight,
          productHeight: json.productHeight,
          productWidth: json.productWidth,
          productLength: json.productLength,
          productPrice: json.productPrice,
          collectedAmount: json.discount > 0 ? oldDiscountPrice : amount,
          isDiscount: json.discount > 0,
          discount: json.discount,
          discountPrice: json.discount > 0 ? discountPrice : '',
          createdAt: moment().unix(),
          productImages: [],
          productType: [
            {
              radioName: {
                en: 'Handmade',
                ar: 'صنع يدوي'
              },
              selected: json.productType === 'Handmade' || json.productType === 'صنع يدوي'
            },
            {
              radioName: {
                en: 'Factory made',
                ar: 'صنع مصنعي'
              },
              selected: json.productType === 'Factory made' || json.productType === 'صنع مصنعي'
            }
          ],
          categoryPicker: {
            category: '',
            categoryOptions: categories,
            categorySelectors: ['category'],
            path: '',
            productCategories: [],
            isComplete: false
          },
          characteristics: [],
          offers: []
        })
        .then(() => {
          len = len + 1
        })

        if (arrLen === len) {
          return true
        }

      })

    })
    .then((result) => {

      if (result) {

        admin.firestore().collection('users')
        .doc(userId).collection('tasks')
        .doc(taskId)
        .update({
          processed: true
        })
        .then(() => {})

      }

    })
    .catch(e => {

      admin.firestore().collection('users')
      .doc(userId).collection('tasks')
      .doc(taskId)
      .update({
        isError: true,
        error: e
      })
      .then(() => {})

    })

  })

})


exports.customerDashboard = functions.firestore
.document('users/{userId}')
.onCreate((snap, context) => {

  const { uid, type } = snap.data()

  if (type === 'customer') {

    admin.firestore().collection('users').doc(uid)
    .update({
      dashboard: [
        {
          title: 'Purchases',
          description: 'Overall purchases',
          value: 0
        },
        {
          title: 'Last transaction',
          description: 0,
          value: 0
        },
        {
          title: 'Purchased',
          description: 'Av. number of products',
          value: 0
        },
        {
          title: 'Basket',
          description: 'Av. price of purchases',
          value: 0
        },
        {
          title: 'LTV',
          description: 'Customer Life Time Value',
          value: 0
        },
        {
          title: 'ARPU',
          description: 'Average revenue per customer',
          value: 0
        }
      ]
    })
    .then(() => {})

  }

})


exports.supplierDashboard = functions.firestore
.document('users/{userId}')
.onCreate((snap, context) => {

  const { uid, type } = snap.data()

  if (type === 'supplier') {

    admin.firestore().collection('users').doc(uid)
    .update({
      dashboard: [
        {
          title: 'Sales',
          description: 'Overall sales',
          value: 0
        },
        {
          title: 'Last sale',
          description: 0,
          value: 0
        },
        {
          title: 'Products',
          description: 'Av. number of products sold',
          value: 0
        },
        {
          title: 'Basket',
          description: 'Av. price of sale',
          value: 0
        },
        {
          title: 'LTV',
          description: 'Customer Life Time Value',
          value: 0
        },
        {
          title: 'ARPU',
          description: 'Average revenue per customer',
          value: 0
        }
      ]
    })
    .then(() => {})

  }

})


// calculate trial days
exports.updateTrialDays = functions.pubsub.schedule('0 1 * * *')
.timeZone('Asia/Dubai')
.onRun( async(context) => {

  await admin.firestore().collectionGroup('stores')
  .where('isTrial', '==', true)
  .onSnapshot(snapshot => {
    snapshot.forEach(doc => {



      let a = moment()
      let b = moment.unix(doc.data().createdAt)
      let diff = a.diff(b, 'days')
      let path = doc.ref.path
      let supplierId = path.split('/')[1]

      if (diff >= 3) {

        admin.firestore().doc(doc.ref.path)
        .update({
          isTrial: false,
          trialExpiresIn: 0
        })
        .then(r => {

          if (3 - diff === -1) {

            if(admin.firestore().doc(doc.ref.path).store.country.en == 'UAE') {
            // send email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {

              const name = doc.data().displayName
              const email = doc.data().email

              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialEndedUAE',
                  data: {
                    subject: 'Your online store is now on temporary paused',
                    previewText: 'This email is a reminder that your online store is now on temporary paused because no plan was selected for subscription to be able to access your store select a plan HERE',
                    displayName: name
                  },
                },
              })
              .then(r => {})

            })
            } else if(admin.firestore().doc(doc.ref.path).store.country.en == 'Russia') {
              // send email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {

              const name = doc.data().displayName
              const email = doc.data().email

              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialEndedRussia',
                  data: {
                    subject: 'Это письмо является напоминанием о том',
                    previewText: 'Это письмо является напоминанием о том, что работа в вашем магазине временно приостановлена',
                    displayName: name
                  },
                },
              })
              .then(r => {})

            })
            } else {
              // send email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {

              const name = doc.data().displayName
              const email = doc.data().email

              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialEnded',
                  data: {
                    subject: 'Your online store is now on temporary paused',
                    previewText: 'This email is a reminder that your online store is now on temporary paused because no plan was selected for subscription to be able to access your store select a plan HERE',
                    displayName: name
                  },
                },
              })
              .then(r => {})
            })
            }
          }

        })

      } else {
        admin.firestore().doc(doc.ref.path)
        .update({
          trialExpiresIn: 3 - diff
        }).then(r => {

          if (3 - diff === 1) {

            if(admin.firestore().doc(doc.ref.path).store.country.en == 'UAE') {
            // send 3 days email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
              const name = doc.data().displayName
              const email = doc.data().email
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialExpiresInOneDayUAE',
                  data: {
                    subject: 'Trial Expires in 1 day',
                    previewText: 'You have remaining a 1 day in your 3 days free trial and your store will be paused temporary.',
                    displayName: name
                  },
                },
              })
              .then(r => {})
            })
            } else if(admin.firestore().doc(doc.ref.path).store.country.en == 'Russia') {
              // send 3 days email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
              const name = doc.data().displayName
              const email = doc.data().email
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialExpiresInOneDayRussia',
                  data: {
                    subject: 'У вас остался 1 день из бесплатного 3-дневного пробного периода',
                    previewText: 'У вас остался 1 день из бесплатного 3-дневного пробного периода, и работа в вашем магазине будет временно приостановлена',
                    displayName: name
                  },
                },
              })
              .then(r => {})
            })
            } else {
              // send 3 days email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
              const name = doc.data().displayName
              const email = doc.data().email
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialExpiresInOneDay',
                  data: {
                    subject: 'Trial Expires in 1 day',
                    previewText: 'You have remaining a 1 day in your 3 days free trial and your store will be paused temporary.',
                    displayName: name
                  },
                },
              })
              .then(r => {})
            })
            }

          } else if (3 - diff === 1) {

            // trial expires in 1 day email
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {

              const name = doc.data().displayName
              const email = doc.data().email

              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'trialExpiresInOneDay',
                  data: {
                    subject: 'Trial Expires in 1 day',
                    previewText: 'You have remaining a 1 day in your free trial and your store is will be temporary paused',
                    displayName: name
                  },
                },
              })
              .then(r => {})

            })

          }

        })
      }

    })
  })

})


// check order approve and delivery !!!
exports.orderStatusCheck = functions.pubsub.schedule('0 * * * *')
.timeZone('Asia/Dubai')
.onRun( async(context) => {

  await admin.firestore().collectionGroup('orders')
  .where('isDelivered', '==', false)
  .onSnapshot(snapshot => {
    snapshot.forEach(doc => {

      let id = doc.id
      let path = doc.ref.path
      let order = doc.data()
      let a = moment()
      let b = moment.unix(order.createdAt)
      let diff = a.diff(b, 'hours')

      if (!order.isAccepted) {

        if (diff > 24) {

          firestore.doc(path)
          .update({
            isCanceled: true
          })
          .then(() => {

            firestore.collectionGroup('supplierOrders')
            .onSnapshot(snap => {
              snap.forEach(doc => {

                if (doc.id === id) {

                  firestore.doc(doc.ref.path)
                  .update({
                    isCanceled: true
                  })
                  .then(() => {
                    // email to the customer
                    // your order has been canceled due to inactivity of the supplier
                    // update supplier penalty
                    // refund customer's transaction
                  })

                }

              })

            })

          })

        }

      } else {

        if (diff > 120 && !order.isDeliveryPlaced) {

          firestore.doc(path)
          .update({
            isCanceled: true
          })
          .then(() => {

            firestore.collectionGroup('supplierOrders')
            .onSnapshot(snap => {
              snap.forEach(doc => {

                if (doc.id === id) {

                  firestore.doc(doc.ref.path)
                  .update({
                    isCanceled: true
                  })
                  .then(() => {
                    // email to the customer
                    // your order has been canceled due to inactivity of the supplier
                    // update supplier penalty
                    // refund customer's transaction
                  })

                }

              })

            })

          })

        }

      }

    })
  })

})


// set delivery, update isDeliveryPlaced status to order
// exports.setDelivery = functions.https.onCall(async (data, context) => {

//   let {
//     orderUid,
//     merchantId,
//     boxOption,
//     quantity,
//     deliveryAddress,
//     user,
//     paymentOptions,
//     pickupTime,
//     deliveryTime
//   } = data




//   fetch(`${url}?subscriptionkey=${key}`,{
//     method:'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Cache-Control': 'no-cache',
//       'Ocp-Apim-Subscription-Key': key
//     },
//     body: {
//       "pickupLocationId": merchantId,
//       "isAhoyBox": boxOption.value === 'medium',
//       "orderLargeBoxQuantity": 0,
//       "orderMidBoxQuantity": quantity,
//       "orderSmallBoxQuantity": 0,
//       "customerLatitude": deliveryAddress.lat,
//       "customerLongitude": deliveryAddress.lng,
//       "isCashPayment": paymentOptions.radioName.en === 'Cash on Delivery',
//       "isCardPayment": paymentOptions.radioName.en === 'Card on Delivery',
//       "paymentAmount": 0,
//       "companyOrderTrackId": 1,
//       "largeBoxTempMin": 0,
//       "largeBoxTempMax": 0,
//       "midBoxTempMin": 0,
//       "midBoxTempMax": 0,
//       "smallBoxTempMin": 0,
//       "smallBoxTempMax": 0,
//       "customerName": user.firstName + ' ' + user.lastName,
//       "customerPhone": user.phone,
//       "customerEmail": user.email,
//       "customerAddress": deliveryAddress.customerAddress,
//       "customerAddressTypeId": deliveryAddress.customerAddressTypeId,
//       "customerAddressNote": deliveryAddress.customerAddressNote,
//       "area": deliveryAddress.area,
//       "building": deliveryAddress.building,
//       "floor": deliveryAddress.floor,
//       "unit": deliveryAddress.unit,
//       "temperatureTypeId": 1
//     }
//   })
//   .then(response => {

//     console.log('response', response)

//     // let url = 'https://ahoyapis.azure-api.net/FlexDelivery/CreateOrderFromFlexPreOrderFunction'
//     // let data = response.json()
//     // let { preOrderId } = data
//     //
//     // fetch(`${url}?subscriptionkey=${key}`,{
//     //   method:'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //     'Cache-Control': 'no-cache',
//     //     'Ocp-Apim-Subscription-Key': key
//     //   },
//     //   body: JSON.stringify({
//     //     "preOrderId": preOrderId,
//     //     "timeSlot": {
//     //       "pickupTime": pickupTime,
//     //       "deliveryTime": deliveryTime
//     //     }
//     //   })
//     // })
//     // .then(response => {
//     //
//     //   let data = response.json()
//     //   let { orderId } = data
//     //
//     //   if (orderId !== undefined) {
//     //
//     //     // update order data
//     //     if (user.uid !== undefined) {
//     //
//     //       firestore.collection('users').doc(user.uid)
//     //       .collection('orders').doc(orderUid)
//     //       .update({
//     //         deliveryOrderId: orderId,
//     //         isDeliveryPlaced: true
//     //       })
//     //       .then(() => {
//     //         return {message: 'done'}
//     //       })
//     //       .catch(() => {
//     //         return {error: 'Some error appeared. Please, try again later!'}
//     //       })
//     //
//     //     } else {
//     //
//     //       firestore.collection('orders').doc(orderUid)
//     //       .update({
//     //         deliveryOrderId: orderId,
//     //         isDeliveryPlaced: true
//     //       })
//     //       .then(() => {
//     //         return {message: 'done'}
//     //       })
//     //       .catch(() => {
//     //         return {error: 'Some error appeared. Please, try again later!'}
//     //       })
//     //
//     //     }
//     //
//     //   }
//     //
//     // })

//   })

// })


// check subscription and update store status
exports.updateStoreSubscription = functions.firestore
.document('subscriptions/{subscriptionsId}')
.onCreate((snapshot, context) => {

  const document = snapshot.data()
  const { stripe } = document

  const ref = admin.firestore().collectionGroup('stores')
    .where('stripe.customerId', '==', stripe.customerId)

  const unsubscribe = ref
    .onSnapshot(snapshot => {

      snapshot.forEach(doc => {

        admin.firestore().doc(doc.ref.path)
          .update({
            isTrial: false,
            isSubscribed: true
          })
          .then(r => {

            // subscriptionCreated
            let path = doc.ref.path
            let supplierId = path.split('/')[1]

            firestore.collection('users').doc(supplierId)
              .get()
              .then(doc => {

                const name = doc.data().displayName
                const email = doc.data().email

                firestore.collection('mail').add({
                  to: email,
                  template: {
                    name: 'subscriptionCreated',
                    data: {
                      subject: 'Thanks for joining Mansa Musa!',
                      previewText: 'You\'re all set to start enjoying selling. We\'re here to help if you need it. Visit the Help Center for more info or contact us.',
                      displayName: name
                    },
                  },
                })
                  .then(r => {
                    unsubscribe()
                  })

              })

          })

      })

    })

})

exports.removeStoreSubscription = functions.firestore
  .document('subscriptions/{subscriptionsId}')
  .onCreate(async (snapshot, context) => {

    const document = snapshot.data()
    const { stripe } = document

    const ref = firestore
      .collectionGroup('stores')
      .where('stripe.customerId', '==', stripe.customerId)

    const unsubscribe = ref
      .onSnapshot(snapshot => {

        snapshot.forEach(doc => {

          if(doc.data().store.country.en == 'UAE') {
          admin.firestore().doc(doc.ref.path)
            .update({
              isTrial: true,
              isSubscribed: false,
              trialExpiresIn: 3
            })
            .then(r => {

              // subscriptionCreated
              let path = doc.ref.path
              let supplierId = path.split('/')[1]

              firestore.collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  const name = doc.data().displayName
                  const email = doc.data().email
                    firestore.collection('mail').add({
                      to: email,
                      template: {
                        name: 'subscriptionCancelledUAE',
                        data: {
                          subject: 'Subscription Cancelled',
                          previewText: 'We\'re so sad you decided to leave us.',
                          displayName: name
                        },
                      },
                    })
                      .then(r => {
                        unsubscribe()
                      })
                  
                })

            })
          } else if(doc.data().store.country.en == 'Russia') {
            admin.firestore().doc(doc.ref.path)
            .update({
              isTrial: true,
              isSubscribed: false,
              trialExpiresIn: 3
            })
            .then(r => {

              // subscriptionCreated
              let path = doc.ref.path
              let supplierId = path.split('/')[1]

              firestore.collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  const name = doc.data().displayName
                  const email = doc.data().email
                  
                    firestore.collection('mail').add({
                      to: email,
                      template: {
                        name: 'subscriptionCancelledRussia',
                        data: {
                          subject: 'Мы заметили, что вы отменили подписку ',
                          previewText: 'Мы заметили, что вы отменили подписку ',
                          displayName: name
                        },
                      },
                    })
                      .then(r => {
                        unsubscribe()
                      })

                })

            })
          } else {
            admin.firestore().doc(doc.ref.path)
            .update({
              isTrial: true,
              isSubscribed: false,
              trialExpiresIn: 3
            })
            .then(r => {

              // subscriptionCreated
              let path = doc.ref.path
              let supplierId = path.split('/')[1]

              firestore.collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  const name = doc.data().displayName
                  const email = doc.data().email

                  firestore.collection('mail').add({
                    to: email,
                    template: {
                      name: 'subscriptionCancelled',
                      data: {
                        subject: 'Subscription Cancelled',
                        previewText: 'We\'re so sad you decided to leave us.',
                        displayName: name
                      },
                    },
                  })
                    .then(r => {
                      unsubscribe()
                    })

                })

            })
          }
        })

      })

  })


// create supplier delivery id
exports.createSupplierLocationId = functions.firestore
.document('users/{userId}/stores/{storeId}')
.onCreate(async (snap, context) => {

  const { customerAddress, lat, lng } = snap.data().address
  const { companyPhone, companyEmail, storeName, id } = snap.data()

  await fetch(`https://ahoyapis.azure-api.net/merchant/merchantlocations?subscriptionkey=05fd96fdb448401aa2207e681802df0b`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '05fd96fdb448401aa2207e681802df0b'
    },
    body: JSON.stringify({
      "locationName": storeName,
      "Address": customerAddress,
      "latitude": lat,
      "longitude": lng,
      "locationType": 5,
      "PhoneNumber": companyPhone,
      "Email": companyEmail
    })
  })
  .then((response) => {
    return response.json()
  })
  .then((data) => {

    const ref = admin.firestore().collectionGroup('stores')
    .where('id', '==', id)

    const unsubscribe = ref
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        admin.firestore().doc(doc.ref.path)
        .update({
          merchantId: data.id
        })
        .then(r => {
          console.log('result', r)
          unsubscribe()
        })
      })
    })

  })

})


// any product changes
exports.productChangeEvents = functions.firestore
.document('products/{productId}')
.onWrite(async (change, context) => {

  const document = change.after.exists ? change.after.data() : change.before.data()

  // await alreadyTriggered(context.eventId)
  // .then(proceed => {
  //
  //   const { store } = document
  //
  //   const ref = admin.firestore().collectionGroup('stores')
  //   .where('id', '==', store)
  //
  //   const unsubscribe = ref
  //   .onSnapshot(snapshot => {
  //     snapshot.forEach(doc => {
  //
  //       admin.firestore().collection('products')
  //       .where('store', '==', store)
  //       .onSnapshot(snap => {
  //
  //         let products = []
  //
  //         snap.forEach(doc => {
  //           products = [...products, doc.data()]
  //         })
  //
  //         let total = products.length
  //         let pending = products.filter(f => !f.isApproved).length
  //         let approved = products.filter(f => f.isApproved).length
  //         let average = products.reduce((a, b) => a + b.productPrice, 0) / products.length
  //         let dashboard = doc.data().dashboard.map(m => {
  //           if (m.title === 'Products' && proceed) {
  //             m.value = total
  //           } else if (m.title === 'Approved' && proceed) {
  //             m.value = approved
  //           } else if (m.title === 'Pending' && proceed) {
  //             m.value = pending
  //           } else if (m.title === 'Price' && proceed) {
  //             m.value = average
  //           }
  //           return m
  //         })
  //
  //         // write to dashboard
  //         admin.firestore().doc(doc.ref.path)
  //         .update({
  //           dashboard
  //         })
  //         .then(r => {
  //           unsubscribe()
  //         })
  //
  //       })
  //
  //     })
  //
  //   })
  //
  // })

})

// registered user orders listener REMOVED
exports.orderChangeEvents = functions.firestore
.document('users/{userId}/orders/{orderId}')
.onWrite(async (change, context) => {

  const document = change.after.exists ? change.after.data() : change.before.data()

  const lastTransactionDate = document.createdAt
  const lastTransactionPrice = document.total
  const { uid } = document.user

  if (!document.isDeliveryPlaced) {

    await alreadyTriggered(context.eventId)
    .then(proceed => {

      if (document.paymentOptions.radioName.en === 'Pay Now') {

        // update user dashboard
        admin.firestore().collection('users').doc(uid)
        .collection('orders')
        .where('isCanceled', '==', false)
        .get()
        .then(snapshot => {

          let orders = []
          snapshot.forEach(async doc => {
            orders = [...orders, {id: doc.id, ...doc.data()}]
          })

          let totalPurchases = orders.reduce((a, b) => a + b.total, 0)
          let totalProductsNumber = orders.reduce((a, b) => a + b.items.length, 0)
          let basket = orders.reduce((a, b) => a + b.total, 0) / totalProductsNumber
          let ltv = orders.reduce((a, b) => a + b.total, 0) - 367 / orders.length
          let arpu = orders.reduce((a, b) => a + b.total, 0) / orders.length

          // write to user dashboard
          const unsubscribe = admin.firestore().collection('users').doc(uid)
          .onSnapshot(doc => {

            let dashboard = doc.data().dashboard.map(m => {
              if (m.title === 'Purchases' && proceed) {
                m.value = totalPurchases
              } else if (m.title === 'Last transaction' && proceed) {
                m.value = lastTransactionPrice
                m.description = lastTransactionDate
              } else if (m.title === 'Purchased' && proceed) {
                m.value = totalProductsNumber
              } else if (m.title === 'Basket' && proceed) {
                m.value = basket <= 0 || isNaN(basket) ? 0 : basket
              } else if (m.title === 'LTV' && proceed) {
                m.value = ltv <= 0 ? 0 : ltv
              } else if (m.title === 'ARPU' && proceed) {
                m.value = arpu <= 0 || isNaN(arpu) ? 0 : arpu
              }
              return m
            })

            admin.firestore().collection('users').doc(uid)
            .update({
              dashboard
            })
            .then(() => {
              if (proceed) {
                unsubscribe()
              }
            })

          })

        })

      } else {

        // getting current order
        const unsubscribe = admin.firestore().collectionGroup('orders')
        .where('orderId', '==', document.orderId)
        .onSnapshot(snapshot => {

          let order = {}
          snapshot.forEach(doc => {
            order = {...doc.data()}
          })

          let stores = [...new Set(order.items.map(m => m.store))]

          let ordersBySuppliers = stores.map(s => {
            return {
              id: s,
              products: order.items.filter(f => f.store === s)
            }
          })

          // map orders by suppliers
          ordersBySuppliers.forEach(async store => {

            // get store from map
            admin.firestore().collectionGroup('stores')
            .where('id', '==', store.id)
            .get()
            .then(snapshot => {

              snapshot.forEach(async doc => {

                let path = doc.ref.path
                let supplierId = path.split('/')[1]
                let storeName = doc.data().storeName

                // update dashboard and orders for supplier
                admin.firestore().collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  let sales = store.products.reduce((a, b) => a + (b.price * b.quantity), 0)
                  let products = store.products.reduce((a, b) => a + b.quantity, 0)
                  let basket = 0
                  // let ltv = 0
                  // let arpu = 0

                  let dashboard = doc.data().dashboard.map(m => {

                    if (m.title === 'Sales' && proceed) {
                      m.value = m.value + sales
                      basket = m.value + sales
                      // ltv = m.value + sales
                    } else if (m.title === 'Last sale' && proceed) {
                      m.value = sales
                      m.description = order.createdAt
                    } else if (m.title === 'Products' && proceed) {
                      m.value = m.value + products
                      basket = basket / (m.value + products)
                    } else if (m.title === 'Basket' && proceed) {
                      m.value = basket
                    } else if (m.title === 'LTV' && proceed) {
                      // m.value = ltv - 950 <= 0 ? 0 : ltv - 950
                    } else if (m.title === 'ARPU' && proceed) {
                      // m.value = average
                    }
                    return m
                  })

                  let supplierOrder = {
                    ...order,
                    storeId: store.id,
                    storeName,
                    items: order.items.filter(f => f.store === store.id),
                    total: order.items.filter(f => f.store === store.id)
                    .reduce((a, b) => a + (b.price * b.quantity), 0) + (order.delivery / ordersBySuppliers.length)
                  }

                  admin.firestore().collection('users').doc(supplierId)
                  .update({
                    dashboard
                  })
                  .then(() => {

                    admin.firestore().collection('users').doc(supplierId)
                    .collection('supplierOrders').doc(order.orderId)
                    .set({
                      ...supplierOrder
                    })
                    .then(() => {
                      unsubscribe()
                    })

                  })

                })

              })

            })

          })

        })

        // update user dashboard
        admin.firestore().collection('users').doc(uid)
        .collection('orders')
        .where('isCanceled', '==', false)
        .get()
        .then(snapshot => {

          let orders = []
          snapshot.forEach(async doc => {
            orders = [...orders, {id: doc.id, ...doc.data()}]
          })

          let totalPurchases = orders.reduce((a, b) => a + b.total, 0)
          let totalProductsNumber = orders.reduce((a, b) => a + b.items.length, 0)
          let basket = orders.reduce((a, b) => a + b.total, 0) / totalProductsNumber
          let ltv = orders.reduce((a, b) => a + b.total, 0) - 367 / orders.length
          let arpu = orders.reduce((a, b) => a + b.total, 0) / orders.length

          // write to user dashboard
          const unsubscribe = admin.firestore().collection('users').doc(uid)
          .onSnapshot(doc => {

            let dashboard = doc.data().dashboard.map(m => {
              if (m.title === 'Purchases' && proceed) {
                m.value = totalPurchases
              } else if (m.title === 'Last transaction' && proceed) {
                m.value = lastTransactionPrice
                m.description = lastTransactionDate
              } else if (m.title === 'Purchased' && proceed) {
                m.value = totalProductsNumber
              } else if (m.title === 'Basket' && proceed) {
                m.value = basket <= 0 || isNaN(basket) ? 0 : basket
              } else if (m.title === 'LTV' && proceed) {
                m.value = ltv <= 0 ? 0 : ltv
              } else if (m.title === 'ARPU' && proceed) {
                m.value = arpu <= 0 || isNaN(arpu) ? 0 : arpu
              }
              return m
            })

            admin.firestore().collection('users').doc(uid)
            .update({
              dashboard
            })
            .then(() => {
              if (proceed) {
                unsubscribe()
              }
            })

          })

        })

      }

    })

  }

})

// unregistered user orders listener REMOVED
exports.unregOrderChangeEvents = functions.firestore
.document('orders/{orderId}')
.onWrite(async (change, context) => {

  const document = change.after.exists ? change.after.data() : null
  const orderId = context.params.orderId

  if (document !== null) {

    if (document.paymentOptions.radioName.en !== 'Pay Now') {

      if (!document.isDeliveryPlaced) {

        await alreadyTriggered(context.eventId)
        .then(proceed => {

          if (proceed) {

            // getting current order
            const unsubscribe = admin.firestore().collectionGroup('orders')
            .where('orderId', '==', orderId)
            .onSnapshot(snapshot => {

              let order = {}
              snapshot.forEach(doc => {
                order = {...doc.data()}
              })

              let stores = [...new Set(order.items.map(m => m.store))]

              let ordersBySuppliers = stores.map(s => {
                return {
                  id: s,
                  products: order.items.filter(f => f.store === s)
                }
              })

              // map orders by suppliers
              ordersBySuppliers.forEach(async store => {

                // get store from map
                admin.firestore().collectionGroup('stores')
                .where('id', '==', store.id)
                .get()
                .then(snapshot => {

                  snapshot.forEach(async doc => {

                    let path = doc.ref.path
                    let supplierId = path.split('/')[1]
                    let storeName = doc.data().storeName

                    // update dashboard and orders for supplier
                    admin.firestore().collection('users').doc(supplierId)
                    .get()
                    .then(doc => {

                      let sales = store.products.reduce((a, b) => a + (b.price * b.quantity), 0)
                      let products = store.products.reduce((a, b) => a + b.quantity, 0)
                      let basket = 0
                      // let ltv = 0
                      // let arpu = 0

                      let dashboard = doc.data().dashboard.map(m => {

                        if (m.title === 'Sales' && proceed) {
                          m.value = m.value + sales
                          basket = m.value + sales
                          // ltv = m.value + sales
                        } else if (m.title === 'Last sale' && proceed) {
                          m.value = sales
                          m.description = order.createdAt
                        } else if (m.title === 'Products' && proceed) {
                          m.value = m.value + products
                          basket = basket / (m.value + products)
                        } else if (m.title === 'Basket' && proceed) {
                          m.value = basket
                        } else if (m.title === 'LTV' && proceed) {
                          // m.value = ltv - 950 <= 0 ? 0 : ltv - 950
                        } else if (m.title === 'ARPU' && proceed) {
                          // m.value = average
                        }
                        return m
                      })

                      let supplierOrder = {
                        ...order,
                        storeId: store.id,
                        storeName,
                        items: order.items.filter(f => f.store === store.id),
                        total: order.items.filter(f => f.store === store.id)
                        .reduce((a, b) => a + (b.price * b.quantity), 0) + (order.delivery / ordersBySuppliers.length)
                      }

                      admin.firestore().collection('users').doc(supplierId)
                      .update({
                        dashboard
                      })
                      .then(() => {

                        admin.firestore().collection('users').doc(supplierId)
                        .collection('supplierOrders').doc(order.orderId)
                        .set({
                          ...supplierOrder
                        })
                        .then(() => {
                          unsubscribe()
                        })

                      })

                    })

                  })

                })

              })

            })

          }

        })

      }

    }

  }

})

exports.supplierOrderChangeEvents = functions.firestore
.document('users/{userId}/supplierOrders/{orderId}')
.onWrite(async (change, context) => {

  const order = change.after.exists ? change.after.data() : null
  const before = change.before.data().isDeliveryPlaced
  const after = change.after.data().isDeliveryPlaced
  const isCancelledBefore = change.before.data().isCanceled
  const isCancelledAfter = change.after.data().isCanceled

  const products = order.items
  const email = order.user.email
  const orderNumber = context.params.orderId
  const phoneNumber = order.user.phone
  const deliveryTime = order.deliveryTime / 1000
  const deliveryDate = moment.unix(deliveryTime).format('LLLL')
  const productsPrice = products.reduce((a, b) => a + b.quantity * b.price, 0)
  const deliveryPrice = order.delivery
  let total = 0
  const payed = order.isPayed
  const deliveryAddress = order.deliveryAddress.customerAddress
  const deliveryCountry = order.deliveryAddress.country
  const displayName = `${order.user.firstName} ${order.user.lastName}`
  let feeTotal

  if (order.paymentOptions.type !== 'fixed') {
    feeTotal = (productsPrice + deliveryPrice) * order.paymentOptions.fee / 100
    total = (productsPrice + deliveryPrice) + feeTotal
  } else {
    feeTotal = order.paymentOptions.fee
    total = (productsPrice + deliveryPrice) + feeTotal
  }

  const cardName = ''
  const cardNumber = ''

  if (order !== null) {

    await alreadyTriggered(context.eventId)
    .then(proceed => {

      if (proceed) {

        if (before !== after) {

          if (order.user.uid !== undefined) {

            if(deliveryCountry == 'United Arab Emirates') {
              firestore.collection('mail')
              .add({
                to: email,
                template: {
                  name: 'customerOrderDeliveryScheduled',
                  data: {
                    subject: 'Your order is on its way!',
                    previewText: 'You can track the delivery by clicking on this link. If you want to manage your order, proceed to your personal account.',
                    orderNumber,
                    phoneNumber,
                    deliveryDate,
                    productsPrice,
                    deliveryPrice,
                    total,
                    payed,
                    cardName,
                    cardNumber,
                    deliveryAddress,
                    products,
                    displayName,
                    feeTotal,
                    deliveryLink: '#'
                  },
                },
              })
              .then(r => {})
            } else if(deliveryCountry == 'Russia') {
              firestore.collection('mail')
              .add({
                to: email,
                template: {
                  name: 'customerOrderDeliveryScheduled',
                  data: {
                    subject: 'Your order is on its way!',
                    previewText: 'You can track the delivery by clicking on this link. If you want to manage your order, proceed to your personal account.',
                    orderNumber,
                    phoneNumber,
                    deliveryDate,
                    productsPrice,
                    deliveryPrice,
                    total,
                    payed,
                    cardName,
                    cardNumber,
                    deliveryAddress,
                    products,
                    displayName,
                    feeTotal,
                    deliveryLink: '#'
                  },
                },
              })
              .then(r => {})
            } else {
            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'customerOrderDeliveryScheduled',
                data: {
                  subject: 'Your order is on its way!',
                  previewText: 'You can track the delivery by clicking on this link. If you want to manage your order, proceed to your personal account.',
                  orderNumber,
                  phoneNumber,
                  deliveryDate,
                  productsPrice,
                  deliveryPrice,
                  total,
                  payed,
                  cardName,
                  cardNumber,
                  deliveryAddress,
                  products,
                  displayName,
                  feeTotal,
                  deliveryLink: '#'
                },
              },
            })
            .then(r => {})
            }
          } else {

            if(deliveryCountry == 'United Arab Emirates') {
              firestore.collection('mail')
              .add({
                to: email,
                template: {
                  name: 'guestOrderDeliveryScheduledUAE',
                  data: {
                    subject: 'Your order has been shipped!',
                    previewText: 'Your order has been shipped',
                    orderNumber,
                    phoneNumber,
                    deliveryDate,
                    productsPrice,
                    deliveryPrice,
                    total,
                    payed,
                    cardName,
                    cardNumber,
                    deliveryAddress,
                    products,
                    displayName,
                    feeTotal,
                    deliveryLink: '#'
                  },
                },
              })
              .then(r => {})
            } else if(deliveryCountry == 'Russia') {
              firestore.collection('mail')
              .add({
                to: email,
                template: {
                  name: 'guestOrderDeliveryScheduledRussia',
                  data: {
                    subject: 'Ваш заказ был отправлен!',
                    previewText: 'Ваш заказ был отправлен',
                    orderNumber,
                    phoneNumber,
                    deliveryDate,
                    productsPrice,
                    deliveryPrice,
                    total,
                    payed,
                    cardName,
                    cardNumber,
                    deliveryAddress,
                    products,
                    displayName,
                    feeTotal,
                    deliveryLink: '#'
                  },
                },
              })
              .then(r => {})
            } else {
            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'guestOrderDeliveryScheduled',
                data: {
                  subject: 'Your order has been shipped!',
                  previewText: 'Your order has been shipped',
                  orderNumber,
                  phoneNumber,
                  deliveryDate,
                  productsPrice,
                  deliveryPrice,
                  total,
                  payed,
                  cardName,
                  cardNumber,
                  deliveryAddress,
                  products,
                  displayName,
                  feeTotal,
                  deliveryLink: '#'
                },
              },
            })
            .then(r => {})
            }
          }

        }

        if (isCancelledBefore !== isCancelledAfter) {

          let cancellationReason = order.cancellationReason

          if (order.user.uid !== undefined) {

            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'customerOrderCancelled',
                data: {
                  subject: 'Your order has been cancelled',
                  previewText: 'That\'s sad your order has been cancelled. We appreciate you are shopping with us and will be waiting for you to get back soon!',
                  orderNumber,
                  phoneNumber,
                  deliveryDate,
                  productsPrice,
                  deliveryPrice,
                  total,
                  payed,
                  cardName,
                  cardNumber,
                  deliveryAddress,
                  products,
                  displayName,
                  feeTotal,
                  deliveryLink: '#',
                  cancellationReason
                },
              },
            })
            .then(r => {})

          } else {

            firestore.collection('mail')
            .add({
              to: email,
              template: {
                name: 'guestOrderCancelled',
                data: {
                  subject: 'Your order has been cancelled',
                  previewText: 'That\'s sad your order has been cancelled. We appreciate you are shopping with us and will be waiting for you to get back soon!\n',
                  orderNumber,
                  phoneNumber,
                  deliveryDate,
                  productsPrice,
                  deliveryPrice,
                  total,
                  payed,
                  cardName,
                  cardNumber,
                  deliveryAddress,
                  products,
                  displayName,
                  feeTotal,
                  deliveryLink: '#',
                  cancellationReason
                },
              },
            })
            .then(r => {})

          }

        }

      }

    })

  }

})

exports.transactionChangeEvents = functions.firestore
.document('transactions/{transactionsId}')
.onWrite(async (change, context) => {

  const document = change.after.exists ? change.after.data() : change.before.data()

  const { orderId, orderStatus } = document

  if (orderStatus === 'Success') {

    await alreadyTriggered(context.eventId)
    .then(proceed => {

      if (proceed) {

        // getting current order
        const unsubscribe = admin.firestore().collectionGroup('orders')
        .where('orderId', '==', orderId)
        .onSnapshot(snapshot => {

          let order = {}
          snapshot.forEach(doc => {
            order = {...doc.data()}
          })

          let stores = [...new Set(order.items.map(m => m.store))]

          let ordersBySuppliers = stores.map(s => {
            return {
              id: s,
              products: order.items.filter(f => f.store === s)
            }
          })

          // map orders by suppliers
          ordersBySuppliers.forEach(async store => {

            // get store from map
            admin.firestore().collectionGroup('stores')
            .where('id', '==', store.id)
            .get()
            .then(snapshot => {

              snapshot.forEach(async doc => {

                let path = doc.ref.path
                let supplierId = path.split('/')[1]
                let storeName = doc.data().storeName

                // update dashboard and orders for supplier
                admin.firestore().collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  let sales = store.products.reduce((a, b) => a + (b.price * b.quantity), 0)
                  let products = store.products.reduce((a, b) => a + b.quantity, 0)
                  let basket = 0
                  // let ltv = 0
                  // let arpu = 0

                  let dashboard = doc.data().dashboard.map(m => {

                    if (m.title === 'Sales' && proceed) {
                      m.value = m.value + sales
                      basket = m.value + sales
                      // ltv = m.value + sales
                    } else if (m.title === 'Last sale' && proceed) {
                      m.value = sales
                      m.description = order.createdAt
                    } else if (m.title === 'Products' && proceed) {
                      m.value = m.value + products
                      basket = basket / (m.value + products)
                    } else if (m.title === 'Basket' && proceed) {
                      m.value = basket
                    } else if (m.title === 'LTV' && proceed) {
                      // m.value = ltv - 950 <= 0 ? 0 : ltv - 950
                    } else if (m.title === 'ARPU' && proceed) {
                      // m.value = average
                    }
                    return m
                  })

                  let supplierOrder = {
                    ...order,
                    storeId: store.id,
                    storeName,
                    items: order.items.filter(f => f.store === store.id),
                    total: order.items.filter(f => f.store === store.id)
                    .reduce((a, b) => a + (b.price * b.quantity), 0) + (order.delivery / ordersBySuppliers.length)
                  }

                  admin.firestore().collection('users').doc(supplierId)
                  .update({
                    dashboard
                  })
                  .then(() => {

                    admin.firestore().collection('users').doc(supplierId)
                    .collection('supplierOrders').doc(order.orderId)
                    .set({
                      ...supplierOrder
                    })
                    .then(() => {
                      unsubscribe()
                    })

                  })

                })

              })

            })

          })

        })

      }

    })

  } else {

    await alreadyTriggered(context.eventId)
    .then(proceed => {

      if (proceed) {

        const unsubscribe = admin.firestore().collectionGroup('orders')
        .where('orderId', '==', orderId)
        .onSnapshot(snapshot => {

          snapshot.forEach(doc => {

            let path = doc.ref.path

            admin.firestore()
            .doc(path).delete()
            .then(() => {
              unsubscribe()
            })

          })

        })

      }

    })

  }

})


// Main App Functions

app.use(cors({ origin: true }))

app.use(bodyParser.urlencoded({
  extended: true,
  verify: rawBodySaver
}))

app.post('/subscription-status', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = process.env.REACT_APP_WORK_KEY
  let accessCode = process.env.REACT_APP_AC_CODE
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=getSIStatus&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/subscription-cancel', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = process.env.REACT_APP_WORK_KEY
  let accessCode = process.env.REACT_APP_AC_CODE
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=cancelSI&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)
    let data = JSON.parse(encResponse)

    if (data.si_cancel_status === 0) {

      const ref = firestore.collection('subscriptions')
      .where('subscriptionNumber', '==', req.body.si_sub_ref_no)

      const unsubscribe = ref
      .onSnapshot(snap => {
        snap.forEach(doc => {

          firestore.doc(doc.ref.path)
          .update({
            status: 'CANC'
          })
          .then(() => {

            let { store } = doc.data()

            const storeRef = firestore.collectionGroup('stores')
            .where('storeName', '==', store)

            const storeUnsubscribe = storeRef
            .onSnapshot(snap => {
              snap.forEach(doc => {

                firestore.doc(doc.ref.path)
                .update({
                  isSubscribed: false,
                  isTrial: true,
                  trialExpiresIn: 3
                })
                .then(() => {

                  storeUnsubscribe()
                  unsubscribe()

                  res.send(JSON.parse(encResponse))

                })

              })

            })

          })

        })

      })

    } else {

      res.send(JSON.parse(encResponse))

    }

  }, (error) => {
    console.log(error)
  })

})

app.post('/subscription-charges', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = process.env.REACT_APP_WORK_KEY
  let accessCode = process.env.REACT_APP_AC_CODE
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=getSIChargeList&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/supplier/plan/payment', (request, response) => {

  if(!request.body) return response.sendStatus(400)

  let body = '',
    workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A',
    accessCode = 'AVLY03HD39AD78YLDA',
    encRequest = '',
    formBody = '';

  body += request.rawBody;
  encRequest = ccav.encrypt(body, workingKey);
  formBody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

  response.send(formBody)

})

app.post('/supplier/plan/payment/response',  (request, response) => {

  let ccavEncResponse='',
    ccavResponse='',
    workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A',
    ccavPOST = '';

  ccavEncResponse += request.rawBody;
  ccavPOST = qs.parse(ccavEncResponse);
  var encryption = ccavPOST.encResp;
  ccavResponse = ccav.decrypt(encryption, workingKey);

  let obj = JSON.parse('{"' + decodeURI(ccavResponse).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

  console.log('ccavResponse', ccavResponse)
  console.log('obj', obj)

  if (obj.status_message === 'Approved') {

    admin
      .auth()
      .setCustomUserClaims(obj.merchant_param4, {
        subscription: { id: obj.merchant_param2, subscribed: true }
      })
      .then(() => {

        admin.firestore().collection('subscriptions')
          .doc(obj.order_id.toString())
          .set({
            orderId: obj.order_id,
            store: obj.merchant_param1,
            subscriptionId: obj.merchant_param2,
            isSpecialApprove: obj.merchant_param3,
            createdAt: new Date().getTime(),
            // subscriptionNumber: obj.si_ref_no,
            // status: obj.si_status,
            isProcessed: obj.status_message === 'Approved',
            restData: {
              ...obj
            }
          })
          .then(() => {

            let htmlCode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>MansaMusa — Payment</title></head><body><script language="javascript">window.location.href = "https://mansamusa.ae/supplier/plan";</script></body></html>';
            response.send(htmlCode)

          })

      })

  } else {

    let htmlCode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>MansaMusa — Payment</title></head><body><script language="javascript">window.location.href = "https://mansamusa.ae/supplier/plan/?status=failed";</script></body></html>';
    response.send(htmlCode)

  }

})

app.post('/checkout/payment', (request, response) => {

  if(!request.body) return response.sendStatus(400)

  let body = ''
  let workingKey = process.env.REACT_APP_WORK_KEY
  let accessCode = process.env.REACT_APP_AC_CODE
  let  encRequest = ''
  let  formbody = ''

  body += request.rawBody;
  encRequest = ccav.encrypt(body, workingKey);
  formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';

  response.send(formbody)

})

app.post('/checkout/payment/response',  (request, response) => {

  let ccavEncResponse='',
    ccavResponse='',
    workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A',
    ccavPOST = '';

  ccavEncResponse += request.rawBody;
  ccavPOST = qs.parse(ccavEncResponse);
  var encryption = ccavPOST.encResp;
  ccavResponse = ccav.decrypt(encryption, workingKey);

  let obj = JSON.parse('{"' + decodeURI(ccavResponse).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')


  admin.firestore().collection('transactions')
  .add({
    createdAd: moment().unix(),
    orderId: obj.order_id,
    trackingId: obj.tracking_id,
    bankRefNumber: obj.bank_ref_no,
    orderStatus: obj.order_status,
    statusMessage: obj.status_message,
    amount: obj.amount,
    bankReceiptNumber: obj.bank_receipt_no,
    bank_qsi_no: obj.bank_qsi_no,
    isProcessed: obj.order_status === 'Success',
    rest: {
      ...obj
    }
  })
  .then(() => {

    if (obj.merchant_param2 !== 'anonymous') {

      admin.firestore().collection('users')
      .doc(obj.merchant_param2)
      .collection('orders')
      .doc(obj.merchant_param1)
      .update({
        isPayed: obj.order_status === 'Success',
        orderId: obj.order_id
      })
      .then(() => {})

    } else {

      admin.firestore().collection('orders')
      .doc(obj.merchant_param1)
      .update({
        isPayed: obj.order_status === 'Success',
        orderId: obj.order_id
      })
      .then(() => {

        // firestore.collection('orders')
        // .doc(obj.merchant_param1)
        // .get()
        // .then(doc => {
        //
        //   const order = doc.data()
        //   const products = order.items
        //   const email = order.user.email
        //   const orderNumber = order.orderId
        //   const phoneNumber = order.user.phone
        //   const deliveryDate = moment.unix(order.createdAt).add(5, 'days').format('LLLL')
        //   const productsPrice = products.reduce((a, b) => a + b.quantity * b.price, 0)
        //   const deliveryPrice = order.delivery
        //   let total = 0
        //   const payed = order.isPayed
        //   const deliveryAddress = order.deliveryAddress.customerAddress
        //   const displayName = `${order.user.firstName} ${order.user.lastName}`
        //   let feeTotal
        //
        //   if (order.paymentOptions.type !== 'fixed') {
        //     feeTotal = (productsPrice + deliveryPrice) * order.paymentOptions.fee / 100
        //     total = (productsPrice + deliveryPrice) + feeTotal
        //   } else {
        //     feeTotal = order.paymentOptions.fee
        //     total = (productsPrice + deliveryPrice) + feeTotal
        //   }
        //
        //   firestore.collection('transactions')
        //   .where('orderId', '==', orderNumber)
        //   .onSnapshot(snap => {
        //
        //     snap.forEach(doc => {
        //
        //       axios.post('https://mansamusa.ae/payment/status', {
        //         reference_no: doc.data().trackingId
        //       })
        //       .then(r => {
        //
        //         const cardName = r.data.order_card_name
        //         const number = r.data.card_no
        //         const cardNumber = toCardFormat(number)
        //
        //         firestore.collection('mail')
        //         .add({
        //           to: email,
        //           template: {
        //             name: 'guestOrderNotification',
        //             data: {
        //               subject: 'Thank you for your purchase!',
        //               previewText: 'We will send you another email when the order status will updated.',
        //               orderNumber,
        //               phoneNumber,
        //               deliveryDate,
        //               productsPrice,
        //               deliveryPrice,
        //               total,
        //               payed,
        //               cardName,
        //               cardNumber,
        //               deliveryAddress,
        //               products,
        //               displayName,
        //               feeTotal
        //             },
        //           },
        //         })
        //         .then(r => {})
        //
        //       })
        //
        //     })
        //
        //   })
        //
        // })

      })

    }

  })
  .then(() => {
    let htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>MansaMusa — Payment</title></head><body><script language="javascript">window.location.href = "https://mansamusa.ae/checkout/delivery/?status=' + obj.order_status + '&orderId=' + obj.order_id + '";</script></body></html>';
    response.send(htmlcode)
  })

})

app.post('/delivery/set', async (request, response) => {

  if(!request.body) return response.sendStatus(400)

  let {
    orderUid,
    merchantId,
    boxOption,
    quantity,
    deliveryAddress,
    user,
    paymentOptions,
    pickupTime,
    deliveryTime,
    price,
    storeName
  } = request.body

  let body = {
    "pickupLocationId": merchantId,
    "isAhoyBox": boxOption.value === 'medium',
    "orderLargeBoxQuantity": 0,
    "orderMidBoxQuantity": quantity > 0 ? quantity : 1,
    "orderSmallBoxQuantity": 0,
    "customerLatitude": deliveryAddress.lat,
    "customerLongitude": deliveryAddress.lng,
    "isCashPayment": paymentOptions.radioName.en === 'Cash on Delivery',
    "isCardPayment": paymentOptions.radioName.en === 'Card on Delivery',
    "paymentAmount": price,
    "companyOrderTrackId": 1,
    "largeBoxTempMin": 0,
    "largeBoxTempMax": 0,
    "midBoxTempMin": 0,
    "midBoxTempMax": 0,
    "smallBoxTempMin": 0,
    "smallBoxTempMax": 0,
    "customerName": user.firstName + ' ' + user.lastName,
    "customerPhone": user.phone,
    "customerEmail": user.email,
    "customerAddress": deliveryAddress.customerAddress,
    "customerAddressTypeId": deliveryAddress.customerAddressTypeId.toString(),
    "customerAddressNote": deliveryAddress.customerAddressNote,
    "area": deliveryAddress.area.length > 0 ? deliveryAddress.area : ' ',
    "building": deliveryAddress.building,
    "floor": deliveryAddress.floor,
    "unit": deliveryAddress.unit,
    "temperatureTypeId": 1
  }

  await deliveryRequest(body)
  .then(data => {

    let { preOrderId } = data

    deliveryApprove(preOrderId, pickupTime, deliveryTime)
    .then(data => {

      let { orderId } = data

      if (orderId !== undefined) {

        firestore.collectionGroup('orders')
        .where('orderId', '==', orderUid)
        .onSnapshot(snap => {

          snap.forEach(doc => {

            firestore.doc(doc.ref.path)
            .update({
              isDeliveryPlaced: true
            })
            .then(() => {

              firestore.collectionGroup('supplierOrders')
              .where('orderId', '==', orderUid)
              .where('storeName', '==', storeName)
              .onSnapshot(snap => {

                snap.forEach(doc => {

                  firestore.doc(doc.ref.path)
                  .update({
                    isDeliveryPlaced: true,
                    deliveryId: orderId,
                    pickupTime,
                    deliveryTime
                  })
                  .then(() => {

                    response.send({
                      status: 'success',
                      error: ''
                    })

                  })

                })

              })

            })

          })

        })

      } else {

        response.send({
          status: 'failed',
          error: 'Something went wrong. Please, try again later!'
        })

      }

    })

  })

})

app.post('/delivery/cancel', async (request, response) => {

  if(!request.body) return response.sendStatus(400)

  let { id } = request.body

  let body = {
    "OrderId": id,
    "CancellationReason": " "
  }

  let url = 'https://ahoyapis.azure-api.net/DeliveryIntegrationAPIProd/CancelOrderFunction?subscriptionkey=05fd96fdb448401aa2207e681802df0b'

  fetch(url,{
    method:'post',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '05fd96fdb448401aa2207e681802df0b'
    }
  })
  .then(response => response.json())
  .then(data => {

    if (data.orderStatusId === 5) {

      firestore.collectionGroup('supplierOrders')
      .where('deliveryId', '==', id)
      .onSnapshot(snap => {

        snap.forEach(doc => {

          firestore.doc(doc.ref.path)
          .update({
            isCanceled: true,
            cancellationReason: 'Canceled by the customer.'
          })
          .then(() => {})

        })

      })

      response.send({
        status: 'success',
        error: ''
      })
    } else {
      response.send({
        status: 'failed',
        error: 'Something went wrong while  canceling your delivery. Please, try again later.'
      })
    }
  })

})

app.post('/payment/refund', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=refundOrder&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/confirm', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=confirmOrder&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/cancel', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=cancelOrder&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/status', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=orderStatusTracker&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/charge', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=chargeSI&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/create', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=createSI&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/go', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://secure.ccavenue.ae/transaction/transaction.do?'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?command=initiateTransaction&enc_request=${encRequest}&access_code=${accessCode}`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

app.post('/payment/option/get', async (req, res) => {

  if(!req.body) return res.sendStatus(400)

  let api = 'https://login.ccavenue.ae/apis/servlet/DoWebTrans'
  let workingKey = '9C0C1EB38BE8952244AC8587DB5A8F2A'
  let accessCode = 'AVLY03HD39AD78YLDA'
  let encRequest = ccav.encrypt(req.rawBody, workingKey)
  let url = `${api}?enc_request=${encRequest}&access_code=${accessCode}&command=getCustomerPaymentOptions&request_type=JSON&version=1.1`

  await axios.post(url)
  .then((response) => {

    let avPost = qs.parse(response.data)
    let encryption = avPost.enc_response
    let encResponse = ccav.decrypt(encryption, workingKey)

    res.send(JSON.parse(encResponse))

  }, (error) => {
    console.log(error)
  })

})

exports.app = functions.https.onRequest(app)

// Subscription Start. Add next billing date to subscription
exports.siStart = functions.pubsub.schedule('0 1 * * *')
.onRun(async (context) => {

  let now = moment()
  let startDate = moment(now).subtract(1, 'day').startOf('day').unix()
  let endDate = moment(now).subtract(1, 'day').endOf('day').unix()


  const getSub = async subscriptionId => {

    return await firestore
    .collection('suppliersSubscriptions')
    .doc(subscriptionId)
    .get()
    .then(doc => {
      return doc.data()
    })

  }

  const getDocs = async (startDate, endDate) => {

    let docs = await firestore
    .collection('subscriptions')
    .where('createdAt', '>=', startDate)
    .where('createdAt', '<=', endDate)
    .where('status', '==', 'ACTI')
    .where('isSpecialApprove', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    for (const doc of docs) {

      let sub = await getSub(doc.subscriptionId)

      let nextBillingDate = moment
      .unix(doc.createdAt)
      .add(sub.frequency, 'month')
      .unix()

      axios.post('https://mansamusa.ae/payment/status', {
        reference_no: doc.restData.tracking_id
      })
      .then(r => {

        if (r.data.order_status === 'Shipped') {

          firestore.doc(doc.path)
          .update({
            nextBillingDate,
            tries: 0
          })
          .then(() => {

            // subscriptionCreated Next Payment
            const cardName = r.data.order_card_name
            const cardNumber = r.data.card_no
            const date = moment(r.data.order_date_time).format('LLLL')
            const number = toCardFormat(cardNumber)

            firestore.collectionGroup('stores')
            .where('storeName', '==', doc.data().store)
            .onSnapshot(snap => {

              snap.forEach(doc => {

                // subscriptionCreated
                let path = doc.ref.path
                let supplierId = path.split('/')[1]

                firestore.collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  const name = doc.data().displayName
                  const email = doc.data().email

                  firestore.collection('mail').add({
                    to: email,
                    template: {
                      name: 'subscriptionNextPayment',
                      data: {
                        subject: 'Subscription Payment',
                        previewText: 'Thank you for staying with Mansa Musa. We appreciate your trust!',
                        displayName: name,
                        cardName: cardName,
                        date: date,
                        cardNumber: number
                      },
                    },
                  })
                  .then(r => {})

                })

              })

            })

          })

        } else if (r.data.order_status === 'Fraud') {

          axios.post('https://mansamusa.ae/subscription-cancel', {
            si_sub_ref_no: doc.data().subscriptionNumber
          })
          .then(() => {

            // Cancelled Email
            firestore.collectionGroup('stores')
            .where('storeName', '==', doc.data().store)
            .onSnapshot(snap => {

              snap.forEach(doc => {

                // subscriptionCreated
                let path = doc.ref.path
                let supplierId = path.split('/')[1]

                firestore.collection('users').doc(supplierId)
                .get()
                .then(doc => {

                  const name = doc.data().displayName
                  const email = doc.data().email

                  firestore.collection('mail').add({
                    to: email,
                    template: {
                      name: 'subscriptionCancelled',
                      data: {
                        subject: 'Subscription Cancelled',
                        previewText: 'We\'re having some trouble with your current billing information. Retry running your card again or try a new one.',
                        displayName: name
                      },
                    },
                  })
                  .then(r => {})

                })

              })

            })

          })

        }

      })

    }

  }

  await getDocs(startDate, endDate)

})

// Subscription Next Payment. Update next billing to subscription
exports.siNextPayment = functions.pubsub.schedule('10 1 * * *')
.onRun(async (context) => {

  let now = moment()
  let startDate = moment(now).startOf('day').unix()
  let endDate = moment(now).endOf('day').unix()

  const getSub = async subscriptionId => {

    return await firestore
    .collection('suppliersSubscriptions')
    .doc(subscriptionId)
    .get()
    .then(doc => {
      return doc.data()
    })

  }

  const getDocs = async (startDate, endDate) => {

    let docs = await firestore
    .collection('subscriptions')
    .where('nextBillingDate', '>=', startDate)
    .where('nextBillingDate', '<=', endDate)
    .where('status', '==', 'ACTI')
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    for (const doc of docs) {

      let sub = await getSub(doc.subscriptionId)

      let nextBillingDate = moment
      .unix(doc.nextBillingDate)
      .add(sub.frequency, 'month')
      .unix()

      let nextDay = moment
      .unix(doc.nextBillingDate)
      .add(1, 'day')
      .unix()

      axios.post('https://mansamusa.ae/payment/charge', {
        si_sub_ref_no: doc.subscriptionNumber,
        si_mer_charge_ref_no: "NEXTPAY001",
        si_amount: Number(doc.restData.amount).toFixed(2),
        si_currency: "AED"
      })
      .then(r => {

        if (r.data.si_charge_status === '0') {

          firestore.doc(doc.path)
          .update({
            nextBillingDate,
            tries: 0
          })
          .then(() => {

            axios.post('https://mansamusa.ae/payment/status', {
              reference_no: r.data.reference_no
            })
            .then(result => {

              // subscriptionCreated Next Payment
              const cardName = result.data.order_card_name
              const cardNumber = result.data.card_no
              const date = moment(result.data.order_date_time).format('LLLL')
              const number = toCardFormat(cardNumber)

              firestore.collectionGroup('stores')
              .where('storeName', '==', doc.data().store)
              .onSnapshot(snap => {

                snap.forEach(doc => {

                  // subscriptionCreated
                  let path = doc.ref.path
                  let supplierId = path.split('/')[1]

                  firestore.collection('users').doc(supplierId)
                  .get()
                  .then(doc => {

                    const name = doc.data().displayName
                    const email = doc.data().email

                    firestore.collection('mail').add({
                      to: email,
                      template: {
                        name: 'subscriptionNextPayment',
                        data: {
                          subject: 'Subscription Payment',
                          previewText: 'Thank you for staying with Mansa Musa. We appreciate your trust!',
                          displayName: name,
                          cardName: cardName,
                          date: date,
                          cardNumber: number
                        },
                      },
                    })
                    .then(r => {})

                  })

                })

              })

            })

          })

        } else {

          if (doc.tries !== 0) {

            if (doc.tries <= 3) {

              firestore.doc(doc.path)
              .update({
                nextBillingDate: nextDay,
                tries: doc.tries + 1
              })
              .then(() => {

                // subscriptionCreated Next Try Email
                axios.post('https://mansamusa.ae/payment/status', {
                  reference_no: r.data.reference_no
                })
                .then(result => {

                  const cardName = result.data.order_card_name
                  const cardNumber = result.data.card_no
                  const number = toCardFormat(cardNumber)

                  firestore.collectionGroup('stores')
                  .where('storeName', '==', doc.data().store)
                  .onSnapshot(snap => {

                    snap.forEach(doc => {

                      let path = doc.ref.path
                      let supplierId = path.split('/')[1]

                      firestore.collection('users').doc(supplierId)
                      .get()
                      .then(doc => {

                        const name = doc.data().displayName
                        const email = doc.data().email

                        firestore.collection('mail').add({
                          to: email,
                          template: {
                            name: 'subscriptionNextTry',
                            data: {
                              subject: 'Subscription Payment Problem',
                              previewText: 'Thank you for staying with Mansa Musa. Unfortunately, we were not able to charge',
                              displayName: name,
                              cardName: cardName,
                              cardNumber: number
                            },
                          },
                        })
                        .then(r => {})

                      })

                    })

                  })

                })

              })

            } else {

              axios.post('https://mansamusa.ae/subscription-cancel', {
                si_sub_ref_no: doc.subscriptionNumber
              })
              .then(() => {

                // subscriptionCreated Last Try Email
                axios.post('https://mansamusa.ae/payment/status', {
                  reference_no: r.data.reference_no
                })
                .then(result => {

                  const cardName = result.data.order_card_name
                  const cardNumber = result.data.card_no
                  const number = toCardFormat(cardNumber)

                  firestore.collectionGroup('stores')
                  .where('storeName', '==', doc.data().store)
                  .onSnapshot(snap => {

                    snap.forEach(doc => {

                      let path = doc.ref.path
                      let supplierId = path.split('/')[1]

                      firestore.collection('users').doc(supplierId)
                      .get()
                      .then(doc => {

                        const name = doc.data().displayName
                        const email = doc.data().email

                        firestore.collection('mail').add({
                          to: email,
                          template: {
                            name: 'subscriptionLastTry',
                            data: {
                              subject: 'Subscription Cancelled',
                              previewText: 'Unfortunately, we were not able to charge for your subscription for the last three days.',
                              displayName: name,
                              cardName: cardName,
                              cardNumber: number
                            },
                          },
                        })
                        .then(r => {})

                      })

                    })

                  })

                })

              })

            }


          } else {

            firestore.doc(doc.path)
            .update({
              nextBillingDate: nextDay,
              tries: 1
            })
            .then(() => {

              // subscriptionCreated Next Try Email
              axios.post('https://mansamusa.ae/payment/status', {
                reference_no: r.data.reference_no
              })
              .then(result => {

                const cardName = result.data.order_card_name
                const cardNumber = result.data.card_no
                const number = toCardFormat(cardNumber)

                firestore.collectionGroup('stores')
                .where('storeName', '==', doc.data().store)
                .onSnapshot(snap => {

                  snap.forEach(doc => {

                    let path = doc.ref.path
                    let supplierId = path.split('/')[1]

                    firestore.collection('users').doc(supplierId)
                    .get()
                    .then(doc => {

                      const name = doc.data().displayName
                      const email = doc.data().email

                      firestore.collection('mail').add({
                        to: email,
                        template: {
                          name: 'subscriptionNextTry',
                          data: {
                            subject: 'Subscription Payment Problem',
                            previewText: 'Thank you for staying with Mansa Musa. Unfortunately, we were not able to charge',
                            displayName: name,
                            cardName: cardName,
                            cardNumber: number
                          },
                        },
                      })
                      .then(r => {})

                    })

                  })

                })

              })

            })

          }

        }

      })

    }

  }

  await getDocs(startDate, endDate)

})

// Supplier Approve Penalty
exports.siApprovePenalty = functions.pubsub.schedule('20 1 * * *')
.onRun(async (context) => {

  const getDocs = async () => {

    let docs = await firestore
    .collectionGroup('supplierOrders')
    .where('isAccepted', '==', false)
    .where('isCanceled', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    return docs

  }

  const docs = await getDocs()

  docs.forEach(doc => {

    let { createdAt, orderId } = doc
    let now = moment()
    let created = moment.unix(createdAt)
    let diff = now.diff(created, 'hours')

    if (diff > 24) {

      firestore.doc(doc.path).update({
        isCanceled: true,
        cancellationReason: 'Canceled due supplier inactivity for 24 hours since order was placed.'
      })
      .then(() => {

        const getSubscription = async () => {

          let subscription = await firestore
          .collection('subscriptions')
          .where('store', '==', doc.storeName)
          .where('status', '==', 'ACTI')
          .get()
          .then(querySnapshot => {
            let sub = {}
            querySnapshot.forEach(doc => {
              sub = {
                ...doc.data()
              }
            })
            return sub
          })

          return subscription

        }

        getSubscription()
        .then(data => {

          axios.post('https://mansamusa.ae/payment/charge', {
            si_sub_ref_no: data.subscriptionNumber,
            si_mer_charge_ref_no: "PENALTY001",
            si_amount: Number(doc.total * 10 / 100).toFixed(2),
            si_currency: "AED"
          })
          .then(r => {

            if (r.data.si_charge_status === '0') {

              // Supplier 15% Penalty
              firestore.collectionGroup('stores')
              .where('storeName', '==', doc.data().storeName)
              .onSnapshot(snap => {

                snap.forEach(doc => {

                  let path = doc.ref.path
                  let supplierId = path.split('/')[1]

                  firestore.collection('users').doc(supplierId)
                  .get()
                  .then(doc => {

                    const name = doc.data().displayName
                    const email = doc.data().email

                    firestore.collection('mail').add({
                      to: email,
                      template: {
                        name: 'penalty15',
                        data: {
                          subject: '15% penalty is charged',
                          previewText: `Your order #${orderId} is cancelled, prior to 24 hours of inactivity. 15% penalty is charged.`,
                          displayName: name,
                          orderNumber: orderId
                        },
                      },
                    })
                    .then(r => {})

                  })

                })

              })

            } else {

              // axios.post('https://mansamusa.ae/subscription-cancel', {
              //   si_sub_ref_no: doc.subscriptionNumber
              // })
              // .then(() => {
              //
              //   // EMAIL
              //   // Dear supplier, we cant charged you 15% penalty
              //   // Store blocked
              //   // your subscription was cancelled
              //   // due to payment problem
              //
              // })

            }

          })

        })

      })

    }

  })

})

// Supplier Delivery Penalty
exports.siDeliveryPenalty = functions.pubsub.schedule('30 1 * * *')
.onRun(async (context) => {

  const getDocs = async (startDate, endDate) => {

    let docs = await firestore
    .collectionGroup('supplierOrders')
    .where('isAccepted', '==', true)
    .where('isDeliveryPlaced', '==', false)
    .where('isCanceled', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    return docs

  }

  const docs = await getDocs()

  docs.forEach(doc => {

    let { createdAt, orderId } = doc
    let now = moment()
    let created = moment.unix(createdAt)
    let diff = now.diff(created, 'days')

    if (diff > 6) {

      firestore.doc(doc.path).update({
        isCanceled: true,
        cancellationReason: 'Canceled due supplier inactivity for 5 days since order was accepted.'
      })
      .then(() => {

        const getSubscription = async () => {

          let subscription = await firestore
          .collection('subscriptions')
          .where('store', '==', doc.storeName)
          .where('status', '==', 'ACTI')
          .get()
          .then(querySnapshot => {
            let sub = {}
            querySnapshot.forEach(doc => {
              sub = {
                ...doc.data()
              }
            })
            return sub
          })

          return subscription

        }

        getSubscription()
        .then(data => {

          axios.post('https://mansamusa.ae/payment/charge', {
            si_sub_ref_no: data.subscriptionNumber,
            si_mer_charge_ref_no: "PENALTY001",
            si_amount: Number(doc.total * 10 / 100).toFixed(2),
            si_currency: "AED"
          })
          .then(r => {

            if (r.data.si_charge_status === '0') {

              // Supplier 30% Penalty
              firestore.collectionGroup('stores')
              .where('storeName', '==', doc.data().storeName)
              .onSnapshot(snap => {

                snap.forEach(doc => {

                  let path = doc.ref.path
                  let supplierId = path.split('/')[1]

                  firestore.collection('users').doc(supplierId)
                  .get()
                  .then(doc => {

                    const name = doc.data().displayName
                    const email = doc.data().email

                    firestore.collection('mail').add({
                      to: email,
                      template: {
                        name: 'penalty30',
                        data: {
                          subject: '15% penalty is charged',
                          previewText: `Your order #${orderId} is cancelled, prior to 5 days of inactivity. 30% penalty is charged.`,
                          displayName: name,
                          orderNumber: orderId
                        },
                      },
                    })
                    .then(r => {})

                  })

                })

              })

            } else {

              // axios.post('https://mansamusa.ae/subscription-cancel', {
              //   si_sub_ref_no: doc.subscriptionNumber
              // })
              // .then(() => {
              //
              //   // EMAIL
              //   // Dear supplier, we cant charged you 15% penalty
              //   // Store blocked
              //   // your subscription was cancelled
              //   // due to payment problem
              //
              // })

            }

          })

        })

      })

    }

  })

})

// Check orders notification
exports.orderApproveNotification = functions.pubsub.schedule('0 * * * *')
.onRun(async (context) => {

  const getDocs = async () => {

    let docs = await firestore
    .collectionGroup('supplierOrders')
    .where('isAccepted', '==', false)
    .where('isCanceled', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    return docs

  }

  const docs = await getDocs()

  docs.forEach(doc => {

    let { createdAt, orderId, items } = doc
    let now = moment()
    let created = moment.unix(createdAt)
    let diff = now.diff(created, 'hours')

    if (diff >= 22 && diff <= 24) {

      // Supplier notify
      firestore.collectionGroup('stores')
      .where('storeName', '==', doc.data().storeName)
      .onSnapshot(snap => {

        snap.forEach(doc => {
          if(doc.data().store.country.en == 'UAE') {

            let path = doc.ref.path
            let supplierId = path.split('/')[1]
  
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
  
              const name = doc.data().displayName
              const email = doc.data().email
  
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'acceptOrderUAE',
                  data: {
                    subject: `You order #${orderId} is pending & waiting for approval`,
                    previewText: `You order #${orderId} is pending & waiting for approval, you have 2 hours remaining to accept the order*`,
                    displayName: name,
                    orderNumber: orderId,
                    products: items
                  },
                },
              })
              .then(r => {})
            })
          } else if(doc.data().store.country.en == 'Russia') {

            let path = doc.ref.path
            let supplierId = path.split('/')[1]
  
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
  
              const name = doc.data().displayName
              const email = doc.data().email
  
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'acceptOrderRussia',
                  data: {
                    subject: `Ваш заказ номер #${orderId} ожидает подтверждения принятия`,
                    previewText: `у вас остается два часа на принятие заказа, у Вас есть максимум 3 дня с даты подтверждения заказа на подтверждение доставки`,
                    displayName: name,
                    orderNumber: orderId,
                    products: items
                  },
                },
              })
              .then(r => {})
            })
          } else {

          let path = doc.ref.path
          let supplierId = path.split('/')[1]

          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {

            const name = doc.data().displayName
            const email = doc.data().email

            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'acceptOrder',
                data: {
                  subject: `You order #${orderId} is pending & waiting for approval`,
                  previewText: `You order #${orderId} is pending & waiting for approval, you have 2 hours remaining to accept the order*`,
                  displayName: name,
                  orderNumber: orderId,
                  products: items
                },
              },
            })
            .then(r => {})

          })
          }

        })

      })

    }

  })

})

// Check delivery notification
exports.deliveryApproveNotification = functions.pubsub.schedule('0 1 * * *')
.onRun(async (context) => {

  const getDocs = async (startDate, endDate) => {

    let docs = await firestore
    .collectionGroup('supplierOrders')
    .where('isAccepted', '==', true)
    .where('isDeliveryPlaced', '==', false)
    .where('isCanceled', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    return docs

  }

  const docs = await getDocs()

  docs.forEach(doc => {

    let { createdAt, orderId, items } = doc
    let now = moment()
    let created = moment.unix(createdAt)
    let diff = now.diff(created, 'days')

    if (diff == 2) {

      // Supplier notify
      firestore.collectionGroup('stores')
      .where('storeName', '==', doc.data().storeName)
      .onSnapshot(snap => {

        snap.forEach(doc => {
          if(doc.data().store.country.en == 'UAE') {
            let path = doc.ref.path
            let supplierId = path.split('/')[1]
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
  
              const name = doc.data().displayName
              const email = doc.data().email
  
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'acceptDeliveryTwoDaysBeforeUAE',
                  data: {
                    subject: `You order #${orderId} is pending & waiting for delivery approval`,
                    previewText: `You order #${orderId} is pending & waiting for delivery approval, you have 2 days remaining for order pick up.`,
                    displayName: name,
                    orderNumber: orderId,
                    products: items
                  },
                },
              })
              .then(r => {})
  
            })
          } else if(doc.data().store.country.en == 'Russia') {
            let path = doc.ref.path
            let supplierId = path.split('/')[1]
            firestore.collection('users').doc(supplierId)
            .get()
            .then(doc => {
  
              const name = doc.data().displayName
              const email = doc.data().email
  
              firestore.collection('mail').add({
                to: email,
                template: {
                  name: 'acceptDeliveryTwoDaysBeforeRussia',
                  data: {
                    subject: `Ваш заказ номер #${orderId} ожидает подтверждения доставки, у Вас остается два дня для отправки`,
                    previewText: `Ваш заказ номер #${orderId} ожидает подтверждения доставки, у Вас остается два дня для отправки, В противном случае заказ будет отменен`,
                    displayName: name,
                    orderNumber: orderId,
                    products: items
                  },
                },
              })
              .then(r => {})
  
            })
          } else {

          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {

            const name = doc.data().displayName
            const email = doc.data().email

            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'acceptDeliveryTwoDaysBefore',
                data: {
                  subject: `You order #${orderId} is pending & waiting for delivery approval`,
                  previewText: `You order #${orderId} is pending & waiting for delivery approval, you have 2 days remaining for order pick up.`,
                  displayName: name,
                  orderNumber: orderId,
                  products: items
                },
              },
            })
            .then(r => {})

          })
          }
        })

      })

    }

  })

})

// Check orders notification 2 hours before
exports.deliveryApproveNotificationTwoHoursBefore = functions.pubsub.schedule('0 * * * *')
.onRun(async (context) => {

  const getDocs = async () => {

    let docs = await firestore
    .collectionGroup('supplierOrders')
    .where('isAccepted', '==', false)
    .where('isCanceled', '==', false)
    .get()
    .then(querySnapshot => {
      let docs = []
      querySnapshot.forEach(doc => {
        docs = [...docs, {path: doc.ref.path, ...doc.data()}]
      })
      return docs
    })

    return docs

  }

  const docs = await getDocs()

  docs.forEach(doc => {

    let { createdAt, orderId, items } = doc
    let now = moment()
    let created = moment.unix(createdAt)
    let diff = now.diff(created, 'hours')

    if (diff >= 142 && diff <= 144) {

      // Supplier notify
      firestore.collectionGroup('stores')
      .where('storeName', '==', doc.data().storeName)
      .onSnapshot(snap => {

        snap.forEach(doc => {

          if(doc.data().store.country.en == 'UAE') {
            let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'acceptDeliveryTwoHoursBeforeUAE',
                data: {
                  subject: `This is the last reminder email, your order #${orderId} is pending & waiting for delivery approval.`,
                  previewText: `This is the last reminder email, your order #${orderId} is pending & waiting for delivery approval. Order will be canceled in 2 hours in case of supplier inability to approve delivery.`,
                  displayName: name,
                  orderNumber: orderId,
                  products: items
                },
              },
            })
            .then(r => {})
          })
          } else if(doc.data().store.country.en == 'Russia') {
            let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'acceptDeliveryTwoHoursBeforeRussia',
                data: {
                  subject: `Направляем Вам последнее электронное письмо с напоминанием о том, что Ваш заказ номер #${orderId} ожидает подтверждения доставки. Заказ будет отменен через 2 часа в случае неспособности поставщика подтвердить доставку.`,
                  previewText: `Направляем Вам последнее электронное письмо с напоминанием о том, что Ваш заказ номер #${orderId} ожидает подтверждения доставки. Заказ будет отменен через 2 часа в случае неспособности поставщика подтвердить доставку.`,
                  displayName: name,
                  orderNumber: orderId,
                  products: items
                },
              },
            })
            .then(r => {})
          })
          } else {

          let path = doc.ref.path
          let supplierId = path.split('/')[1]
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
            const name = doc.data().displayName
            const email = doc.data().email
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'acceptDeliveryTwoHoursBefore',
                data: {
                  subject: `This is the last reminder email, your order #${orderId} is pending & waiting for delivery approval.`,
                  previewText: `This is the last reminder email, your order #${orderId} is pending & waiting for delivery approval. Order will be canceled in 2 hours in case of supplier in ability to approve delivery.`,
                  displayName: name,
                  orderNumber: orderId,
                  products: items
                },
              },
            })
            .then(r => {})
          })
          }

        })

      })

    }

  })

})

// New Reg User Order Notification
exports.newOrderRegNotification = functions.firestore
.document('users/{userId}/orders/{orderId}')
.onCreate(async (snap, context) => {

  const order = snap.data()
  const products = snap.data().items
  const orderId = context.params.orderId
  const stores = products.map(f => f.store)

  for(const store of stores) {

    firestore.collectionGroup('stores')
    .where('id', '==', store)
    .onSnapshot(snap => {

      snap.forEach(doc => {
        if(doc.data().store.country.en == 'UAE') {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]

        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {

          const name = doc.data().displayName
          const email = doc.data().email
          const storeProducts = products.filter(f => f.store === store)

          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'supplierNewOrderUAE',
              data: {
                subject: `Congratulation! You have received a new order`,
                previewText: `You now have 24 hours to accept the order*, you are given a maximum of 3 days from the date of accepting order to accept the delivery pick up*`,
                displayName: name,
                orderNumber: orderId,
                products: storeProducts
              },
            },
          })
          .then(r => {})

        })
        } else if(doc.data().store.country.en == 'Russia') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
  
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
  
            const name = doc.data().displayName
            const email = doc.data().email
            const storeProducts = products.filter(f => f.store === store)
  
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'supplierNewOrderRussia',
                data: {
                  subject: `Примите наши поздравления! Вы получили новый заказ`,
                  previewText: `У Вас есть 24 часа на то, чтобы принять заказ*, у Вас есть максимум 3 дня с даты принятия заказа на то, чтобы принять доставку `,
                  displayName: name,
                  orderNumber: orderId,
                  products: storeProducts
                },
              },
            })
            .then(r => {})
  
          })
        } else {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]

        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {

          const name = doc.data().displayName
          const email = doc.data().email
          const storeProducts = products.filter(f => f.store === store)

          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'supplierNewOrder',
              data: {
                subject: `Congratulation! You have received a new order`,
                previewText: `You now have 24 hours to accept the order*, you are given a maximum of 3 days from the date of accepting order to accept the delivery pick up**`,
                displayName: name,
                orderNumber: orderId,
                products: storeProducts
              },
            },
          })
          .then(r => {})

        })
        }
      })

    })

  }

  // user email
  const email = order.user.email
  const orderNumber = context.params.orderId
  const phoneNumber = order.user.phone
  const deliveryDate = moment.unix(order.createdAt).add(5, 'days').format('LLLL')
  const productsPrice = products.reduce((a, b) => a + b.quantity * b.price, 0)
  const deliveryPrice = order.delivery
  let total = 0
  const payed = order.isPayed
  const deliveryAddress = order.deliveryAddress.customerAddress
  const deliveryCountry = order.deliveryAddress.country
  const displayName = `${order.user.firstName} ${order.user.lastName}`
  let feeTotal
  if (order.paymentOptions.type !== 'fixed') {
    feeTotal = (productsPrice + deliveryPrice) * order.paymentOptions.fee / 100
    total = (productsPrice + deliveryPrice) + feeTotal
  } else {
    feeTotal = order.paymentOptions.fee
    total = (productsPrice + deliveryPrice) + feeTotal
  }
  const cardName = ''
  const cardNumber = ''

  if(deliveryCountry == 'United Arab Emirates') {
    firestore.collection('mail')
    .add({
      to: email,
      template: {
        name: 'guestOrderNotificationUAE',
        data: {
          subject: 'Thank you for your purchase!',
          previewText: 'We will send you another email when the order status will updated.',
          orderNumber,
          phoneNumber,
          deliveryDate,
          productsPrice,
          deliveryPrice,
          total,
          payed,
          cardName,
          cardNumber,
          deliveryAddress,
          products,
          displayName,
          feeTotal
        },
      },
    })
    .then(r => {})
  } else if(deliveryCountry == 'Russia') {
    firestore.collection('mail')
    .add({
      to: email,
      template: {
        name: 'guestOrderNotificationRussia',
        data: {
          subject: 'Благодарим вас за покупку!',
          previewText: 'МЫ НАПРАВИМ ВАМ ОТДЕЛЬНОЕ ПИСЬМО, КОГДА ЗАКАЗ БУДЕТ ОТПРАВЛЕН ВАМ',
          orderNumber,
          phoneNumber,
          deliveryDate,
          productsPrice,
          deliveryPrice,
          total,
          payed,
          cardName,
          cardNumber,
          deliveryAddress,
          products,
          displayName,
          feeTotal
        },
      },
    })
    .then(r => {})
  } else {
  firestore.collection('mail')
  .add({
    to: email,
    template: {
      name: 'guestOrderNotification',
      data: {
        subject: 'Thank you for your purchase!',
        previewText: 'We will send you another email when the order status will updated.',
        orderNumber,
        phoneNumber,
        deliveryDate,
        productsPrice,
        deliveryPrice,
        total,
        payed,
        cardName,
        cardNumber,
        deliveryAddress,
        products,
        displayName,
        feeTotal
      },
    },
  })
  .then(r => {})
  }
})

// New Order Notification
exports.newOrderNotification = functions.firestore
.document('orders/{orderId}')
.onCreate(async (snap, context) => {

  const order = snap.data()
  const products = snap.data().items
  const orderId = context.params.orderId
  const stores = products.map(f => f.store)

  for(const store of stores) {

    firestore.collectionGroup('stores')
    .where('id', '==', store)
    snap.forEach(doc => {
        if(doc.data().country.en == 'UAE') {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]

        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {

          const name = doc.data().displayName
          const email = doc.data().email
          const storeProducts = products.filter(f => f.store === store)

          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'supplierNewOrderUAE',
              data: {
                subject: `Congratulation! You have received a new order`,
                previewText: `You now have 24 hours to accept the order*, you are given a maximum of 3 days from the date of accepting order to accept the delivery pick up*`,
                displayName: name,
                orderNumber: orderId,
                products: storeProducts
              },
            },
          })
          .then(r => {})

        })
        } else if(doc.data().country.en == 'Russia') {
          let path = doc.ref.path
          let supplierId = path.split('/')[1]
  
          firestore.collection('users').doc(supplierId)
          .get()
          .then(doc => {
  
            const name = doc.data().displayName
            const email = doc.data().email
            const storeProducts = products.filter(f => f.store === store)
  
            firestore.collection('mail').add({
              to: email,
              template: {
                name: 'supplierNewOrderRussia',
                data: {
                  subject: `Примите наши поздравления! Вы получили новый заказ`,
                  previewText: `У Вас есть 24 часа на то, чтобы принять заказ*, у Вас есть максимум 3 дня с даты принятия заказа на то, чтобы принять доставку `,
                  displayName: name,
                  orderNumber: orderId,
                  products: storeProducts
                },
              },
            })
            .then(r => {})
  
          })
        } else {

        let path = doc.ref.path
        let supplierId = path.split('/')[1]

        firestore.collection('users').doc(supplierId)
        .get()
        .then(doc => {

          const name = doc.data().displayName
          const email = doc.data().email
          const storeProducts = products.filter(f => f.store === store)

          firestore.collection('mail').add({
            to: email,
            template: {
              name: 'supplierNewOrder',
              data: {
                subject: `Congratulation! You have received a new order`,
                previewText: `You now have 24 hours to accept the order*, you are given a maximum of 3 days from the date of accepting order to accept the delivery pick up**`,
                displayName: name,
                orderNumber: orderId,
                products: storeProducts
              },
            },
          })
          .then(r => {})

        })
        }
      })

  }

  // user email
  const email = order.user.email
  const orderNumber = context.params.orderId
  const phoneNumber = order.user.phone
  const deliveryDate = moment.unix(order.createdAt).add(5, 'days').format('LLLL')
  const productsPrice = products.reduce((a, b) => a + b.quantity * b.price, 0)
  const deliveryPrice = order.delivery
  let total = 0
  const payed = order.isPayed
  const deliveryAddress = order.deliveryAddress.customerAddress
  const displayName = `${order.user.firstName} ${order.user.lastName}`
  let feeTotal

  if (order.paymentOptions.type !== 'fixed') {
    feeTotal = (productsPrice + deliveryPrice) * order.paymentOptions.fee / 100
    total = (productsPrice + deliveryPrice) + feeTotal
  } else {
    feeTotal = order.paymentOptions.fee
    total = (productsPrice + deliveryPrice) + feeTotal
  }

  const cardName = ''
  const cardNumber = ''

  firestore.collection('mail')
  .add({
    to: email,
    template: {
      name: 'guestOrderNotification',
      data: {
        subject: 'Thank you for your purchase!',
        previewText: 'We will send you another email when the order status will updated.',
        orderNumber,
        phoneNumber,
        deliveryDate,
        productsPrice,
        deliveryPrice,
        total,
        payed,
        cardName,
        cardNumber,
        deliveryAddress,
        products,
        displayName,
        feeTotal
      },
    },
  })
  .then(r => {})

})

exports.returnRequest = functions.https.onCall((data, context) => {

  const displayName = data.name
  const productName = data.productName
  const productQuantity = data.productQuantity
  const returnNumber = data.returnNumber
  const deliveryAddress = data.deliveryAddress

  firestore.collection('mail').add({
    to: email,
    template: {
      name: 'returnRequest',
      data: {
        subject: 'Return Request',
        previewText: 'We have received your return request',
        displayName,
        productName,
        productQuantity,
        returnNumber,
        deliveryAddress
      }
    }
  })

  // const returnReqEmail = firebase.functions().httpsCallable('returnRequest')
  // onClick={() => returnReqEmail(returnData, context)}
})
