import React from 'react'
import Input from '../../../../../components/UI/Input/Input'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'
import CheckBox from '../../../../../components/UI/CheckBox/CheckBox'

import styles from './AddNewCharacteristic.module.scss'


const AddNewCharacteristic = ({ item, handleCheck, handleAdd, handleUpdate, handleCancel, handleChange }) => {


  return(

    <div className={styles.AddNewCharacteristic}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>
              {
                item.id !== undefined ?
                  'Update Characteristic Info' : 'Add New Characteristic'
              }
            </h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-6 col-12'>
            <Input
              name={'title.en'}
              type={'text'}
              value={item.title.en}
              label={'Enter Name in English'}
              handleChange={handleChange}
            />
          </div>
          <div className='col-lg-6 col-12'>
            <Input
              name={'title.ar'}
              type={'text'}
              value={item.title.ar}
              label={'Enter Name in Arabic'}
              handleChange={handleChange}
              dir={'rtl'}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-lg-6 col-12'>
            <Input
              name={'description.en'}
              type={'text'}
              value={item.description.en}
              label={'Enter Description in English'}
              handleChange={handleChange}
            />
          </div>
          <div className='col-lg-6 col-12'>
            <Input
              name={'description.ar'}
              type={'text'}
              value={item.description.ar}
              label={'Enter Description in Arabic'}
              handleChange={handleChange}
              dir={'rtl'}
            />
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <CheckBox
              name={'isMultiple'}
              text={'Is multiple?'}
              onClick={handleCheck}
              isChecked={item.isMultiple}
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
            item.title.en.length > 0 && item.title.ar.length > 0 ?
              <div className='col-lg-4 col-12'>
                {
                  <SignUpButton
                    type={'custom'}
                    title={item.id !== undefined ? 'Update' : 'Add'}
                    onClick={() => {
                      item.id !== undefined ?
                        handleUpdate(item.id) : handleAdd()
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

export default AddNewCharacteristic
