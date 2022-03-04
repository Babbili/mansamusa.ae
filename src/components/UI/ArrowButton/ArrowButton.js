import React from 'react'
import { Link } from 'react-router-dom'
import { toSlug } from '../../utils/toSlug'
import { scrollToTop } from '../../../utils/utils'

import styles from './ArrowButton.module.scss'


const ArrowButton = ({ lang, title, icon, color, link, url, isMobile }) => {

  return(

    <div
      className={styles.ArrowButton}
      onClick={() => scrollToTop(0, 'smooth')}
    >
      <Link to={`${url}${link === '/' ? '' : toSlug(link)}`}>
        { title }
        <span
          style={{
            color: color,
            transform: lang !== 'en' ? 'rotate(180deg)' : '',
            marginRight: lang !== 'en' ? isMobile ? '15px' : '30px' : '0',
            marginLeft: lang !== 'en' ? '0' : isMobile ? '15px' : '30px',
            marginBottom: lang !== 'en' ? isMobile ? '0' : '4px' : '4px'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 2H8C4.691 2 2 4.691 2 8v13a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm-2 13H7v-2h7v2zm3-4H7V9h10v2z"></path></svg>
        </span>
      </Link>
    </div>

  )

}

export default ArrowButton
