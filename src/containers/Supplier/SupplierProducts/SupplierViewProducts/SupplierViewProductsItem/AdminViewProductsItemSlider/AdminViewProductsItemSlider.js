import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../../../../../components/AppContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './AdminViewProductsItemSlider.module.scss'


const AdminViewProductsItemSlider = ({ images }) => {

  const context = useContext(AppContext)
  const { lang } = context
  const ref = useRef(null)
  const [index, setIndex] = useState(0)
  const [elementWidth, setElementWidth] = useState(0)

  useEffect(() => {
    setElementWidth(ref.current ? ref.current.offsetWidth : 0)
  }, [])

  const handleLeft = () => {
    setIndex(prevState => {
      return index === 0 ? 0 : prevState - 1
    })
  }

  const handleRight = () => {
    setIndex(prevState => {
      return index === images.length - 1 ? images.length - 1 : prevState + 1
    })
  }

  return(

    <div className={styles.AdminViewProductsItemSlider}>

      {
        index !== 0 ?
          <div
            className={`${styles.arrows} ${styles.left}`}
            onClick={() => handleLeft()}
          >
            <FontAwesomeIcon icon='arrow-left' fixedWidth />
          </div> : null
      }

      {
        index !== images.length - 1 ?
          <div
            className={`${styles.arrows} ${styles.right}`}
            onClick={() => handleRight()}
          >
            <FontAwesomeIcon icon='arrow-right' fixedWidth />
          </div> : null
      }

      <div
        ref={ref}
        className={styles.wrapper}
        style={{
          transform: `translateX(${Number(lang !== 'en' ? index * elementWidth : -index * elementWidth).toFixed(1)}px)`
        }}
      >

        {
          images.map((m, i) => {

            console.log('img', m.url)

            return(

              <div
                key={i}
                className={styles.item}
                style={{
                  backgroundImage: `url(${m.url})`
                }}
              />

            )

          })
        }

      </div>

    </div>

  )

}

export default AdminViewProductsItemSlider
