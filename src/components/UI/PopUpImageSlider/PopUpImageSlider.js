import React, { useEffect, useRef, useState } from 'react'
import SliderArrow from '../SliderArrow/SliderArrow'

import styles from './PopUpImageSlider.module.scss'


const PopUpImageSlider = props => {

  const ref = useRef(null)

  const { lang, images } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [elementWidth, setElementWidth] = useState(0)

  const handleLeft = () => {
    setCurrentIndex(prevState => {
      return prevState === 0 ? 0 : prevState - 1
    })
  }

  const handleRight = () => {
    setCurrentIndex(prevState => {
      return prevState === images.length - 1 ? images.length - 1 : prevState + 1
    })
  }

  useEffect(() => {
    setElementWidth(ref.current ? ref.current.offsetWidth : 0)
  }, [])


  return(

    <div className={styles.PopUpImageSlider}>

      {
        images.length > 1 ?
          <>
            <SliderArrow
              position={'right'}
              icon={'arrow-right'}
              onClick={lang !== 'en' ? handleLeft : handleRight}
              isOpacity={
                lang !== 'en' ?
                  currentIndex === 0 :
                  props.isFullWidth || props.isMobile ?
                    currentIndex === images.length - 1 :
                    currentIndex === images.length - 1
              }
            />

            <SliderArrow
              position={'left'}
              icon={'arrow-left'}
              onClick={lang !== 'en' ? handleRight : handleLeft}
              isOpacity={
                lang !== 'en' ?
                  props.isFullWidth || props.isMobile ?
                    currentIndex === images.length - 1 :
                    currentIndex === images.length - 1 :
                  currentIndex === 0
              }
            />
          </> : null
      }

      <div
        ref={ref}
        className={styles.wrapper}
        style={{
          transform: `translateX(${Number(lang !== 'en' ? currentIndex * elementWidth : -currentIndex * elementWidth).toFixed(1)}px)`
        }}
      >

        {
          images.map(image => (
            <div
              key={image.source}
              className={styles.item}
              style={{
                backgroundImage: `url(${image.url})`
              }}
            />
          ))
        }

      </div>

    </div>

  )

}

export default PopUpImageSlider