import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../AppContext'

import { signOut } from '../../firebase/config.js'
import { useTranslation } from 'react-i18next'
import styles from './User.module.scss'

function User() {

    const context = useContext(AppContext)
    const [hover, setHover] = useState(false)
    const [hovere, setHovere] = useState(false)
    const [userName, setUserName] = useState('')
    const [userType, setUserType] = useState('')
    let { t } = useTranslation()

    useEffect(() => {
    if (context.currentUser !== null) {
      setUserName(context.currentUser.displayName)
      setUserType(context.currentUser.type)
    }
  }, [context.currentUser])

  const [active, setActive] = useState(false)
  const [keyActive, setKeyActive] = useState(false)

    return(
        <section className={styles.user}>
            <h2>Account</h2>
            {
            context.currentUser &&

            userType === 'admin' ?
                <div className={styles.user__card}>
                    <div className={styles.user__card__avatar}>    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                    </div>
    
                    <Link to={`/${userType}`}>
                    <div className={`${styles.user__card__login} svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>Admin Panel
                    </div>
                    </Link>
                    <div className={`${styles.user__card__signup} svg${keyActive}`} onClick={() => signOut()}  onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                    </div>
                </div> 
            :
            userType === 'supplier' ?
                <div className={styles.user__card}>
                    <div className={styles.user__card__avatar}>    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                    </div>
    
                    <Link to={`/${userType}`}>
                    <div className={`${styles.user__card__login} svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>{t('profile.label')}
                    </div>
                    </Link>
                    <div className={`${styles.user__card__signup} svg${keyActive}`} onClick={() => signOut()}  onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                    </div>
                </div>
            :
            userType === 'customer' ?
                <div className={styles.user__card}>
                <div className={styles.user__card__avatar}>    
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                    </div>
    
                    <Link to={`/${userType}`}>
                    <div className={`${styles.user__card__login} svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>{t('profile.label')}
                    </div>
                    </Link>
                    <div className={`${styles.user__card__signup} svg${keyActive}`} onClick={() => signOut()}  onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logOut.label') }
                    </div>
                </div>
            :
            <div className={styles.user__card}>
                <div className={styles.user__card__avatar}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="var(--text-color)"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path></svg>
                </div>

                <Link to={'/login'}>
                <div className={`${styles.user__card__login} svg${keyActive}`}
                onMouseEnter={()=> setKeyActive(true) } onMouseLeave={()=> setKeyActive(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={ hover ? '#fff' : 'var(--text-color)'} ><path d="M7 17a5.007 5.007 0 0 0 4.898-4H14v2h2v-2h2v3h2v-3h1v-2h-9.102A5.007 5.007 0 0 0 7 7c-2.757 0-5 2.243-5 5s2.243 5 5 5zm0-8c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z"></path></svg>{ t('logIn.label') }
                </div>
                </Link>

                <Link to={{
                    pathname: '/signup',
                    state: {
                     isUserSignUp: true
                    }
                }}> 
                <div className={styles.user__card__signup}
                className={`${styles.user__card__login} svg${active}`} onMouseEnter={()=> setActive(true) } onMouseLeave={()=> setActive(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={ hovere ? '#fff' : 'var(--text-color)'}  ><path d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"></path></svg>{ t('signUp.label') }
                </div>
                </Link>
            </div>
            }
        </section>
    )
}
export default User