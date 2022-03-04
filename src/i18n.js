import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

i18n
.use(Backend)
.use(initReactI18next)
.init({
  lng: 'en',
  backend: {
    /* translation file path */
    // loadPath: 'https://mansamusa.ae/assets/i18n/{{ns}}/{{lng}}.json',
    loadPath: '/assets/i18n/{{ns}}/{{lng}}.json',
    // loadPath: 'https://46a8fb884962.ngrok.io/assets/i18n/{{ns}}/{{lng}}.json'
  },
  fallbackLng: 'en',
  debug: false,
  /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ','
  },
  react: {
    useSuspense: true
  }
})
.then(() => {})

export default i18n