import React from 'react'
import ArrowButton from '../../UI/ArrowButton/ArrowButton'

import styles from './SliderHeader.module.scss'


const SliderHeader = props => {

  return(

    <div className='row'>
      <div className='col-12'>
        <div className={styles.SliderHeader}>
          <div className={styles.title}>
            { props.title }
          </div>
          {
            props.url !== undefined ?
              <ArrowButton
                url={props.url}
                lang={props.lang}
                link={props.link}
                icon='arrow-right'
                color={props.color}
                isMobile={props.isMobile}
                title={ props.isMobile ? '' : props.t('viewAll.label') }
              /> : null
          }
        </div>
      </div>
    </div>

  )

}

export default SliderHeader
