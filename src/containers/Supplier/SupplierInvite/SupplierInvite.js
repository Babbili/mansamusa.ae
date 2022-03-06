import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import Input from '../../../components/UI/Input/Input'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'

import styles from './SupplierInvite.module.scss'


const SupplierInvite = ({ isTrial, approved, currentStore, isSubscribed }) => {

  const context = useContext(AppContext)
  let { lang } = context
  let { t } = useTranslation()

  const [link, setLink] = useState('')
  const [copy, setCopy] = useState('')

  const copyToClipBoard = async copyMe => {
    try {
      await navigator.clipboard.writeText(copyMe)
      setCopy('Copied!')
      setTimeout(() => {
        setCopy('')
      }, 500)
    } catch (err) {
      setCopy('Failed to copy!')
    }
  }

  useEffect(() => {
    const link = 'https://mansamusa.ae/invite?store=' + currentStore.id
    setLink(link)
  }, [currentStore])


  return(

    <div className={styles.SupplierInvite}>

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

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        { t('inviteFriends.label') }
      </div>

      <div className='container-fluid'>

        <div className='row'>
          <div className='col-12'>
            <h3>
              { t('inviteYourFriends.label') }
            </h3>
          </div>
        </div>

        <div className='row justify-content-center'>
          <div className='col-lg-8 col-12'>
            <div className={styles.copyLink}>
              <Input
                defaultValue={link}
                type={'text'}
                label={link}
                disabled
              />
              <div
                className={styles.button}
                onClick={() => copyToClipBoard(link)}
              >
                {
                  copy.length > 0 ? copy : t('copyLink.label')
                }
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path><path d="M6 12h6v2H6zm0 4h6v2H6z"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className='row mt-4'>
          <div className='col-12'>
            <h3>
              { t('shareOnSocialMediaAlso.label') }
            </h3>
          </div>
          <div className='col-12 d-flex justify-content-center'>
            <div className={styles.socialIcons}>
              <div className={styles.fb}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${link}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path></svg>
                </a>
              </div>
              <div className={styles.tw}>
                <a href={`https://twitter.com/intent/tweet?text=Join me on Mansa Musa by clicking this link — ${link}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path></svg>
                </a>
              </div>
              <div className={styles.env}>
                <a href={`mailto:?subject=Join me on Mansa Musa&body=Join me on Mansa Musa by clicking this link — ${link}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

  )

}

export default SupplierInvite
