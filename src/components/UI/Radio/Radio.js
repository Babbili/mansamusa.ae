import React from 'react'
import styles from './Radio.module.scss'


const Radio = ({ index, title, selected, disable, handleInputChange }) => {

  return(

    <div
      className={styles.Radio}
      style={{
        pointerEvents: disable ? 'none' : 'all'
      }}
    >
      <input
        id={index + title}
        name={title}
        type='radio'
        checked={selected}
        onChange={handleInputChange}
      />
      <label htmlFor={index + title}>
        <span /> { title }
      </label>
    </div>

  )

}

export default Radio
