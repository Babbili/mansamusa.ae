import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignUpButton from '../../../UI/SignUpButton/SignUpButton'

import styles from './CreateStoreFooter.module.scss'


const CreateStoreFooter = ({ index, newStore, handleNext, handlePrev, handleSubmit }) => {

  let { t } = useTranslation()
  const [total, setTotal] = useState(5)

  useEffect(() => {
    if (newStore) {
      setTotal(prevState => prevState - 1)
    }
  }, [newStore])

  return(

    <div className={styles.CreateStoreFooter}>

      <div
        className={styles.back}
        style={{opacity: index === 0 ? 0 : 1}}
      >
        <SignUpButton
          title={ t('goBack.label') }
          type={'goback'}
          onClick={handlePrev}
          disabled={false}
        />
      </div>

      <div className={styles.next}>
        <SignUpButton
          title={index !== total ? t('next.label') : t('submit.label')}
          type={'custom'}
          onClick={index !== total ? handleNext : handleSubmit}
          disabled={false}
        />
      </div>

    </div>

  )

}

export default CreateStoreFooter
