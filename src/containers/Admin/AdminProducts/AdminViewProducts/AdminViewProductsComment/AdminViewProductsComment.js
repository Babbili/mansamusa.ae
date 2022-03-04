import React, { useState } from 'react'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'
import TextArea from '../../../../../components/UI/TextArea/TextArea'

import styles from './AdminViewProductsComment.module.scss'


const AdminViewProductsComment = ({ handleSendComment, handleCloseComment }) => {

  let { t } = useTranslation()

  const [state, setState] = useState({
    comment: ''
  })

  const handleChange = event => {
    const { value, name } = event.target
    setState({
      ...state,
      [name]: value
    })
  }


  return(

    <div className={styles.AdminViewProductsComment}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>{ t('notifySupplier.label') }</h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <TextArea
              rows={5}
              placeholder={ t('enterComment.label') }
              value={state.comment}
              name='comment'
              handleChange={handleChange}
            />
          </div>
        </div>

        <div className='row justify-content-center mt-4'>

          <div className='col-4'>
            <SignUpButton
              type={'custom'}
              title={ t('cancel.label') }
              onClick={handleCloseComment}
              disabled={false}
            />
          </div>

          {
            state.comment.length > 0 ?
              <div className='col-4'>
                <SignUpButton
                  type={'custom'}
                  title={ t('send.label') }
                  onClick={() => handleSendComment(state.comment)}
                  disabled={false}
                />
              </div> : null
          }

        </div>

      </div>

    </div>

  )

}

export default AdminViewProductsComment
