import React from 'react'
import SliderBody from './SliderBody/SliderBody'
import SliderHeader from './SliderHeader/SliderHeader'
import { colors } from '../utils/colors'

import styles from './Slider.module.scss'
import {useTranslation} from "react-i18next"


const Slider = props => {

  let { t } = useTranslation()

  return(

    <div
      className={styles.Slider}
      style={{
        padding: props.isPaddings ? props.isMobile ? '15px' : '70px 130px 30px 130px' : '0',
        backgroundColor: `${props.bgColor !== undefined ? props.bgColor : 'var(--container-color-light)'}`
      }}
    >

      {
        props.isHeader ?
          <SliderHeader
            t={t}
            url={props.url}
            lang={props.lang}
            link={props.link}
            title={props.title}
            isMobile={props.isMobile}
            color={props.bgColor !== undefined ? '#000000' : colors.accent}
            {...props}
          /> : null
      }

      <SliderBody
        lang={props.lang}
        length={props.length}
        isArrows={props.isArrows}
        isMobile={props.isMobile}
        isPaddings={props.isPaddings}
        isFullWidth={props.isFullWidth}
        bgColor={props.bgColor !== undefined ? props.bgColor : 'var(--container-color-light)'}
      >

        { props.children }

      </SliderBody>

    </div>

  )

}

export default Slider
