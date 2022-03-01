import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './Pagination.module.scss'


const Pagination = ({ state, handlePrev, handleNext, handleExactPage }) => {

  let { t } = useTranslation()

  return(

    <div className='row mt-4'>
      <div className='col-6 d-flex align-items-center'>
        { t('showing.label') }&nbsp;
        { (state.currentPage - 1) * state.limit + 1 } { t('to.label') }&nbsp;
        {
          state.currentPage * state.limit >= state.data.length ?
            state.data.length : state.currentPage * state.limit
        } { t('of.label') }&nbsp;
        { state.count } { t('entries.label') }
      </div>
      <div className='col-6'>

        {
          state.data.length + 1 <= state.limit ?
            null :
            <div className={styles.Pagination}>
              <div
                className={styles.perv}
                onClick={handlePrev}
              >
                { t('previous.label') }
              </div>
              <div className={styles.pages}>
                {
                  Array.from(Array(state.pages).keys()).map(i => {

                    return(

                      <div
                        key={i}
                        className={`${styles.page} ${state.currentPage === i + 1 ? styles.active : ''}`}
                        onClick={() => handleExactPage(i + 1)}
                      >
                        { i + 1 }
                      </div>

                    )

                  })
                }
              </div>
              <div
                className={styles.perv}
                onClick={handleNext}
              >
                { t('next.label') }
              </div>
            </div>
        }

      </div>
    </div>

  )

}

export default Pagination
