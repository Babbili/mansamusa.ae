import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Task from './Task/Task'

import styles from './Tasks.module.scss'


const Tasks = ({ tasks }) => {

  let { t } = useTranslation()
  const [toggle, setToggle] = useState(true)

  return(

    <div className={`${styles.Tasks} container-fluid`}>

      <div className='row'>
        <div className='col-lg-8 col-12 d-flex'>
          <div className={styles.more}>
            { t('addMultipleProductsTasks.label') }
            <div style={{width: '10px'}} />
            <div
              className={styles.showMore}
              onClick={() => setToggle(!toggle)}
            >
              { t('seeMore.label') }
              <div
                style={{
                  display: 'flex',
                  transform: toggle ? 'rotateZ(90deg)' : 'rotateZ(0deg)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
              </div>
            </div>
          </div>
        </div>
        <div className='col-4 d-none d-lg-flex text-right'>
          <div
            style={{
              opacity: toggle ? 1 : 0,
              pointerEvents: toggle ? 'all' : 'none'
            }}
          />
        </div>
      </div>

      <div className='row' style={{display: toggle ? 'block' : 'none'}}>
        <div className='col-12'>
          {
            tasks.map((task, index) => {

              return(

                <Task
                  key={index}
                  task={task}
                />

              )

            })
          }
        </div>
      </div>

    </div>

  )

}

export default Tasks
