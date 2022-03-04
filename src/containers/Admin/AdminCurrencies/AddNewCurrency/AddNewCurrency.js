import React from 'react'
import Input from '../../../../components/UI/Input/Input'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import styles from './AddNewCurrency.module.scss'


const AddNewCurrency = ({ item, handleChange, handleCancel, handleAddCurrency, handleUpdateCurrency }) => {


  return(

    <div className={styles.AddNewCurrency}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>
              {
                item.id !== undefined ?
                  'Update Currency Code & Symbol' : 'Add New Currency'
              }
            </h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <Input
              name={'code'}
              type={'text'}
              value={item.currency.code}
              label={'Enter Currency Code'}
              handleChange={handleChange}
            />
          </div>
          <div className='col-12'>
            <Input
              name={'symbol'}
              type={'text'}
              value={item.currency.symbol}
              label={'Enter Currency Symbol'}
              handleChange={handleChange}
              dir={'rtl'}
            />
          </div>
        </div>

        <div className='row justify-content-center mt-4'>

          <div className='col-lg-4 col-12'>
            <SignUpButton
              type={'custom'}
              title={'Cancel'}
              onClick={handleCancel}
              disabled={false}
            />
          </div>

          {
            item.currency.code.length > 0 ?
              <div className='col-lg-4 col-12'>
                {
                  <SignUpButton
                    type={'custom'}
                    title={item.id !== undefined ? 'Update' : 'Add'}
                    onClick={() => {
                      item.id !== undefined ?
                        handleUpdateCurrency(item.id) : handleAddCurrency()
                    }}
                    disabled={false}
                  />
                }
              </div> : null
          }

        </div>

      </div>

    </div>

  )

}

export default AddNewCurrency
