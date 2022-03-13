import React from 'react'
import { useTranslation } from 'react-i18next'

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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z"></path></svg>
              <div style={{width: '5px'}} />
              { t('processed.label') }
            </> :
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="20" r="2"></circle><circle cx="12" cy="4" r="2"></circle><circle cx="6.343" cy="17.657" r="2"></circle><circle cx="17.657" cy="6.343" r="2"></circle><circle cx="4" cy="12" r="2.001"></circle><circle cx="20" cy="12" r="2"></circle><circle cx="6.343" cy="6.344" r="2"></circle><circle cx="17.657" cy="17.658" r="2"></circle></svg>
              <div style={{width: '5px'}} />
              { t('processing.label') }
            </>
        }
      </div>
    </div>

  )

}

export default Task
