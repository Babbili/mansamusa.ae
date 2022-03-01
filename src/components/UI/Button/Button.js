import React from 'react'
import { Link } from 'react-router-dom'
import urlSlug from 'url-slug'
import { scrollToTop } from '../../../utils/utils'


import styles from './Button.module.scss'


const Button = ({ url, title, isBorder, link }) => {

  const slug = urlSlug(link, () => link.split(' ').join('-').toLowerCase())

  return(

    <div
      className={`${styles.Button} ${styles.btn}`}
      style={{
        border: isBorder ? '2px solid #be9534' : ''
      }}
      onClick={() => scrollToTop(0, 'smooth')}
    >
      <Link
        to={`${url !== undefined ? url : 'categories'}/${slug}`}
      >
        { title }
      </Link>
    </div>

  )

}

export default Button
