import React from 'react'
import { Link } from 'react-router-dom'
import { toSlug } from '../../utils/toSlug'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
          <FontAwesomeIcon icon={icon} fixedWidth />
        </span>
      </Link>
    </div>

  )

}

export default ArrowButton
