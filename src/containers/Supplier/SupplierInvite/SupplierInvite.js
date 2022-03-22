import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../components/AppContext'
import Input from '../../../components/UI/Input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                <FontAwesomeIcon icon="clone" fixedWidth />
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
                  <FontAwesomeIcon icon={['fab', 'facebook-square']} fixedWidth />
                </a>
              </div>
              <div className={styles.tw}>
                <a href={`https://twitter.com/intent/tweet?text=Join me on Mansa Musa by clicking this link — ${link}`}>
                  <FontAwesomeIcon icon={['fab', 'twitter-square']} fixedWidth />
                </a>
              </div>
              {/*<div className={styles.in}>*/}
              {/*  <FontAwesomeIcon icon={['fab', 'instagram-square']} fixedWidth />*/}
              {/*</div>*/}
              <div className={styles.env}>
                <a href={`mailto:?subject=Join me on Mansa Musa&body=Join me on Mansa Musa by clicking this link — ${link}`}>
                  <FontAwesomeIcon icon="envelope" fixedWidth />

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
