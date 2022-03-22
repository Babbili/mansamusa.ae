import React from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './Task.module.scss'


const Task = ({ task }) => {

  let { t } = useTranslation()

  return(

    <div className={styles.Task}>
      <div className={styles.number}>
        { task.id }
      </div>
      <div className={styles.order}>
        { task.file[0].name }
      </div>
      <div className={`${styles.approval} ${task.processed ? styles.done : ''}`}>
        {
          task.processed ?
            <>
              <FontAwesomeIcon icon="check-circle" fixedWidth />
              <div style={{width: '5px'}} />
              { t('processed.label') }
            </> :
            <>
              <FontAwesomeIcon icon="spinner" fixedWidth />
              <div style={{width: '5px'}} />
              { t('processing.label') }
            </>
        }
      </div>
    </div>

  )

}

export default Task
