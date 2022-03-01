import React from 'react'
import styles from './Separator.module.scss'


const Separator = ({ title, color, margin }) => {

  return(

    <div
      className={styles.Separator}
      style={{
        marginBottom: margin ? 15 : 0
      }}
    >
      <div
        className={styles.line}
        style={{
          backgroundColor: color !== undefined ? color : '#000'
        }}
      />
      {
        title !== undefined ?
          <>
            <div className={styles.title}>{ title }</div>
            <div
              className={styles.line}
              style={{
                backgroundColor: color !== undefined ? color : '#000'
              }}
            />
          </> : null
      }
    </div>

  )

}

export default Separator
