import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './SliderArrow.module.scss'


const SliderArrow = ({ icon, position, onClick, isOpacity }) => {

  return(

    <div
      className={`${styles.SliderArrow} ${position === 'left' ? styles.left : styles.right}`}
      onClick={onClick}
      style={{
        opacity: isOpacity ? .1 : 1
      }}
    >
      <FontAwesomeIcon icon={icon} fixedWidth />
    </div>

  )

}

export default SliderArrow
