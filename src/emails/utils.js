import firebase from '../firebase/config'

export const supplierWelcomeEmail = async (email, firstName, lastName, country) => {

  country == 'UAE'?
  await firebase.firestore()
  .collection('mail')
  .add({
    to: email,
    template: {
      name: 'welcomeSupplierUAE',
      data: {
        subject: 'Congratulations on joining Mansa Musa!',
        previewText: 'You now have 3 days trial experience as a store owner on Mansa Musa platform.',
        displayName: `${firstName} ${lastName}`
      },
    },
  })
  : country == 'Russia' ?
  await firebase.firestore()
  .collection('mail')
  .add({
    to: email,
    template: {
      name: 'welcomeSupplierRussia',
      data: {
        subject: 'Поздравляем вас, вы присоединились к Mansa Musa!',
        previewText: 'У вас есть 3 дня пробного периода в качестве владельца ...',
        displayName: `${firstName} ${lastName}`
      },
    },
  })
  :
  await firebase.firestore()
  .collection('mail')
  .add({
    to: email,
    template: {
      name: 'welcomeSupplier',
      data: {
        subject: 'Congratulations on joining Mansa Musa!',
        previewText: 'You now have 3 days trial experience as a store owner on Mansa Musa platform',
        displayName: `${firstName} ${lastName}`
      },
    },
  })

}

export const customerWelcomeEmail = async (email, firstName, lastName) => {

  await firebase.firestore()
  .collection('mail')
  .add({
    to: email,
    template: {
      name: 'welcomeCustomer',
      data: {
        subject: 'Welcome to Mansa Musa!',
        previewText: 'You\'re all set to start enjoying shopping!',
        displayName: `${firstName} ${lastName}`
      },
    },
  })

}

export const contactFormEmail = async (email, name, message) => {

  await firebase.firestore()
  .collection('mail')
  .add({
    to: 'info@mansamusa.ae',
    template: {
      name: 'contactFormEmail',
      data: {
        subject: 'Contact form message',
        previewText: ` message from ${email} ${name} ${message}`,
        displayName: `${name}`
      },
    },
  })

}