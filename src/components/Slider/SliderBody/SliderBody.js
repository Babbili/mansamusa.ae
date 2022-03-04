import React, { useRef, useState, useEffect } from 'react'
import SliderArrow from '../../UI/SliderArrow/SliderArrow'

import styles from './SliderBody.module.scss'


const SliderBody = props => {

  const ref = useRef(null)

  const { lang } = props

  const [currentIndex, setCurrentIndex] = useState(0)
  const [elementWidth, setElementWidth] = useState(0)

  const handleLeft = () => {
    setCurrentIndex(prevState => {
      return prevState === 0 ? 0 : prevState - 1
    })
  }

  const handleRight = () => {
    setCurrentIndex(prevState => {
      if (props.isFullWidth || props.isMobile) {
        return prevState === props.length - 1 ? props.length - 1 : prevState + 1
      } else {
        if (props.length < 4) {
          return prevState === props.length - 1 ? props.length - 1 : prevState + 1
        } else {
          return prevState === props.length - 4 ? props.length - 4 : prevState + 1
        }
      }
    })
  }

  useEffect(() => {
    if (props.isFullWidth || props.isMobile) {
      setElementWidth(ref.current ? ref.current.offsetWidth : 0)
    } else {
      setElementWidth(ref.current ? ref.current.offsetWidth / 4 : 0)
    }
  }, [props.isFullWidth, props.isMobile])


  return(

    <div
      className={styles.SliderBody}
      style={{
        padding: props.isPaddings ? '0 30px' : '0'
      }}
    >

      <div
        style={{
          width: '2px',
          height: '100%',
          left: 0,
          top: 0,
          position: 'absolute',
          backgroundColor: props.bgColor,
          zIndex: 1
        }}
      />

      {
        (props.isArrows && props.length >= 4) ||
        (props.isFullWidth && props.length > 1 && props.isPaddings) ?
          <>
            <SliderArrow
              position={'right'}
              icon={'arrow-right'}
              onClick={lang !== 'en' ? handleLeft : handleRight}
              isOpacity={
                lang !== 'en' ?
                  currentIndex === 0 :
                    props.isFullWidth || props.isMobile ?
                      currentIndex === props.length - 1 :
                      currentIndex === props.length - 4
              }
            />

            <SliderArrow
              position={'left'}
              icon={'arrow-left'}
              onClick={lang !== 'en' ? handleRight : handleLeft}
              isOpacity={
                lang !== 'en' ?
                  props.isFullWidth || props.isMobile ?
                    currentIndex === props.length - 1 :
                    currentIndex === props.length - 4 :
                      currentIndex === 0
              }
            />
          </> : null
      }

      <div
        ref={ref}
        className={`${styles.wrapper} row`}
        style={{
          padding: props.isPaddings ? '45px 0' : '0',
          transform: `translateX(${Number(lang !== 'en' ? currentIndex * elementWidth : -currentIndex * elementWidth).toFixed(1)}px)`
        }}
      >

        { props.children }

      </div>

    </div>

  )

}

export default SliderBody
