import React, { useContext, useEffect, useRef, useState } from 'react'
import AppContext from '../../../../../../components/AppContext'
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
          </div> : null
      }

      {
        index !== images.length - 1 ?
          <div
            className={`${styles.arrows} ${styles.right}`}
            onClick={() => handleRight()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
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
