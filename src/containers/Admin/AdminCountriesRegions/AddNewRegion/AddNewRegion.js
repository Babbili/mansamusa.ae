import React from 'react'
import Input from '../../../../components/UI/Input/Input'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import styles from './AddNewRegion.module.scss'


const AddNewRegion = ({ item, country, handleCancel, handleChange, handleAddRegion, handleUpdateRegion }) => {


  return(

    <div className={styles.AddNewRegion}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>
              {
                item.id !== undefined ?
                  'Update Region Name' : 'Add New Region'
              }
            </h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>
            <Input
              name={'en'}
              type={'text'}
              value={item.title.en}
              label={'Enter Name in English'}
              handleChange={handleChange}
            />
          </div>
          <div className='col-12'>
            <Input
              name={'ar'}
              type={'text'}
              value={item.title.ar}
              label={'Enter Name in Arabic'}
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
            item.title.en.length > 0 && item.title.ar.length > 0 ?
              <div className='col-lg-4 col-12'>
                {
                  <SignUpButton
                    type={'custom'}
                    title={item.id !== undefined ? 'Update' : 'Add'}
                    onClick={() => {
                      item.id !== undefined ?
                        handleUpdateRegion(country.id, item.id) : handleAddRegion(country.id)
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

export default AddNewRegion
