import React from 'react'
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
      {
      icon == 'arrow-right' ?
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
      :
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
    }

    </div>

  )

}

export default SliderArrow
