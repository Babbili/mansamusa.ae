import React, { useContext, useEffect } from 'react'
import Input from '../../../../../components/UI/Input/Input'
import SignUpButton from '../../../../../components/UI/SignUpButton/SignUpButton'
import CheckBox from '../../../../../components/UI/CheckBox/CheckBox'

import styles from './AddNewCategory.module.scss'
import Separator from "../../../../../components/UI/Separator/Separator";
import ImagePicker from '../../../../../components/ImagePicker/ImagePicker';
import AppContext from '../../../../../components/AppContext'


const AddNewCategory = ({ item, setNewItem, handleAdd, handleCheck, handleUpdate, handleCancel, handleChange }) => {

  const context = useContext(AppContext)
  const { currentUser } = context

  useEffect(() => {
    if (item.description === undefined) {
      setNewItem(prevState => {
        return {
          ...prevState,
          description: {
            en: '',
            ar: ''
          }
        }
      })
    }
  }, [item.description, setNewItem])

  useEffect(() => {
    if (item.isHidden === undefined || item.isHome === undefined || item.isTop === undefined) {
      setNewItem(prevState => {
        return {
          ...prevState,
          isHidden: false,
          isHome: false,
          isTop: false
        }
      })
    }
  }, [item.isHidden, item.isHome, item.isTop, setNewItem])


  return(

    <div className={styles.AddNewCategory}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>
              {
                item.id !== undefined ?
                  'Update category information' : 'Add new category'
              }
            </h3>
          </div>
        </div>

        <div className='row'>
          <div className='col-12'>

            <ImagePicker
              state={item}
              name={'image'}
              isMultiple={false}
              setState={setNewItem}
              uid={currentUser.uid}
            />

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

        {
          item.description !== undefined ?
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
            </div> : null
        }

        <Separator color={'#fff'} />

        {
          item.isHidden !== undefined && item.isHome !== undefined && item.isTop !== undefined ?
            <div className='row'>
              <div className='col-lg-4 col-12'>
                <CheckBox
                  name={'isHidden'}
                  text={'Hide category?'}
                  onClick={handleCheck}
                  isChecked={item.isHidden}
                />
              </div>
              <div className='col-lg-4 col-12'>
                <CheckBox
                  name={'isHome'}
                  text={'Show category on homepage?'}
                  onClick={handleCheck}
                  isChecked={item.isHome}
                />
              </div>
              <div className='col-lg-4 col-12'>
                <CheckBox
                  name={'isTop'}
                  text={'Is top category?'}
                  onClick={handleCheck}
                  isChecked={item.isTop}
                />
              </div>
            </div> : null
        }

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
            item.title.en.length > 0 && item.title.ar.length > 0 &&
            item.description !== undefined && item.description.en.length > 0 &&
            item.description.ar.length > 0 && item['image'].length > 0 ?
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

export default AddNewCategory
