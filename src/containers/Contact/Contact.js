import React, { useRef, useState } from 'react'
import Input from '../../components/UI/Input/Input'
import TextArea from '../../components/UI/TextArea/TextArea'
import { useTranslation } from 'react-i18next'
import styles from './Contact.module.scss'
import SignUpButton from '../../components/UI/SignUpButton/SignUpButton'
import { contactFormEmail } from '../../emails/utils'

function Contact() {

    const { t } = useTranslation()
    const [nameValue, setNameValue] = useState('')
    const [emailValue, setEmailValue] = useState('')
    const [messageValue, setMessageValue] = useState('')
    const tyMsg = useRef()
    const contactForm = useRef()
    const cnTh = useRef()

    function submitForm() {
        console.log('submitted')
        tyMsg.current.classList.remove('hide')
        cnTh.current.classList.add('hide')
        contactFormEmail(emailValue, nameValue, messageValue)
        contactForm.current.classList.add('hide')
        console.log(emailValue, nameValue, messageValue)
        setTimeout(()=> {
            setNameValue('')
            setEmailValue('')
            setMessageValue('')
        }, 9000)
    }

    function backHome() {
        window.location = '/'
    }

    return(
        <section className={`${styles.contact} bd__container`}>
            <h2>{t('contactUs.label')}</h2>
            <p ref={cnTh} >{t('contactUsTh.label')}</p>
            <form method='POST'  className={styles.form} onSubmit={()=> submitForm()} ref={contactForm} >
                <Input index='1' handleChange={(e)=> setNameValue(e.target.value) } label='name' text='name' type='name' value={nameValue} />
                <Input index='1' handleChange={(e)=> setEmailValue(e.target.value) } label='email' text='email' type='email' value={emailValue} />
                <TextArea name='message' value={messageValue} rows={4} placeholder='message' handleChange={(e)=> setMessageValue(e.target.value)} hideSwitch={true} />
                <SignUpButton title='Send' type={'custom'} formType={'submit'} onClick={() => submitForm()} disabled={false} isWide={true} />
            </form>
            <div className={`${styles.ty__msg} hide`} ref={tyMsg} >
                <p>{t('tyContactUS.label')}</p>
                <SignUpButton title={t('backToHome.label')} type={'custom'} onClick={() => backHome()} disabled={false} />
            </div>
            <p className={styles.contact__info} >Mansamusa FZE, address, <br />email: <a href="mailto:info@mansamusa.ae">info@mansamusa.ae</a></p>
        </section>
    )
}
export default Contact