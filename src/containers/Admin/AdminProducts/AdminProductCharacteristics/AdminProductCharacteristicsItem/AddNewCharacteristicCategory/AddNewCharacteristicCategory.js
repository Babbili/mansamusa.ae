import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../../../../../firebase/config'
import SignUpButton from '../../../../../../components/UI/SignUpButton/SignUpButton'
import CharacteristicCategoryItem from './CharacteristicCategoryItem/CharacteristicCategoryItem'
import Separator from '../../../../../../components/UI/Separator/Separator'

import styles from './AddNewCharacteristicCategory.module.scss'
import CategoriesSelector
  from '../../../../../Supplier/SupplierProducts/SupplierProductsAddNew/CategoriesSelector/CategoriesSelector'
import AppContext from '../../../../../../components/AppContext'


const AddNewCharacteristicCategory = ({ item, handleCancel }) => {

  const context = useContext(AppContext)
  let { lang } = context

  const [categories, setCategories] = useState([])
  const [state, setState] = useState({
    categoryPicker: {
      category: '',
      categoryOptions: [],
      categorySelectors: [],
      path: '',
      productCategories: [],
      productCats: {},
      isComplete: false
    }
  })

  useEffect(() => {

    if (item.inCategory !== undefined) {
      setCategories(item.inCategory)
    }

  }, [item])

  useEffect(() => {

    firestore
    .collection("productTypes")
    .where('isHidden', '==', false)
    .onSnapshot(snapShot => {

      let options = []
      snapShot.forEach(doc => {
        options = [...options, {id: doc.id, ...doc.data()}]
      })

      setState((prevState) => {
        return {
          ...prevState,
          categoryPicker: {
            category: '',
            categoryOptions: options,
            categorySelectors: ['category'],
            path: '',
            productCategories: [],
            productCats: {},
            isComplete: false
          }
        }
      })

    })

  }, [])

  const handleChangeSelect = event => {

    const { name } = event.target
    const id = event.target.children[event.target.selectedIndex].id
    const path = `${state.categoryPicker.path}/${id}/subCategories`

    const option = Object.values(state.categoryPicker)
    .filter(m => Array.isArray(m) && m.some(s => s.id === id)).flat(1)
    .filter(f => f.id === id).map(m => m.title)[0]

    firestore
    .collection(`productTypes${path}`)
    .onSnapshot(snapShot => {

      let subCollection = []
      let productCategories = state.categoryPicker.productCategories

      snapShot.forEach(doc => {
        subCollection = [...subCollection, {id: doc.id, ...doc.data()}]
      })

      setState({
        ...state,
        categoryPicker: {
          ...state.categoryPicker,
          [name]: option,
          [`${option.en}Options`]: subCollection,
          categorySelectors: subCollection.length > 0 ?
            [...state.categoryPicker.categorySelectors, option.en] :
            state.categoryPicker.categorySelectors,
          path: `${state.categoryPicker.path}/${id}/subCategories`,
          productCategories: [...productCategories, option],
          productCats: {...state.categoryPicker.productCats, ...{[option.en]: true}},
          isComplete: subCollection.length === 0
        }
      })

    })

  }

  const handleClear = () => {
    setState({
      ...state,
      categoryPicker: {
        category: '',
        categoryOptions: state.categoryPicker.categoryOptions,
        categorySelectors: ['category'],
        path: '',
        productCategories: [],
        productCharacteristics: []
      }
    })
  }

  const handleAddCategory = () => {

    let categories = item.inCategory !== undefined ? item.inCategory : []
    let category = state.categoryPicker.productCategories[state.categoryPicker.productCategories.length - 1]
    let cat = typeof category === 'object' ? category.en : category

    firestore.collection('productCharacteristics')
    .doc(item.id).update({
      inCategory: [...categories, cat]
    })
    .then(() => {
      setState({
        ...state,
        categoryPicker: {
          category: '',
          categoryOptions: state.categoryPicker.categoryOptions,
          categorySelectors: ['category'],
          path: '',
          productCategories: [],
          productCharacteristics: []
        }
      })
    })


  }


  return(

    <div className={styles.AddNewCharacteristicCategory}>

      <div className={styles.wrapper}>

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h3>The list of categories</h3>
            <div className={styles.subTitle}>
              {
                categories.length > 0 ?
                  'The list of all available categories. Click on cross\n' +
                  'icon to remove the category from the list.' :
                  'No categories yet. Please, add it below.'
              }
            </div>
          </div>
        </div>

        {
          categories.length > 0 ?
            <div className='row'>
              <div className={`${styles.optionsList} col-12`}>
                {
                  categories.map((category, index) => (
                    <CharacteristicCategoryItem
                      key={index}
                      index={index}
                      item={category}
                      parentId={item.id}
                      categories={categories}
                    />
                  ))
                }
              </div>
            </div> : null
        }

        <Separator color={'#ccc'} />

        <div className='row justify-content-center'>
          <div className='col-12'>
            <h5>Add a new category</h5>
            <div className={styles.subTitle}>
              Choose categories from the list below.
            </div>
          </div>
        </div>

        <div className='row'>
          <CategoriesSelector
            lang={lang}
            hide={true}
            state={state}
            handleClear={handleClear}
            handleChange={handleChangeSelect}
            text={undefined}
          />
        </div>

        <div className='row justify-content-center mt-4'>

          <div className={`${state.categoryPicker.isComplete ? 'col-6' : 'col-12'}`}>
            <SignUpButton
              type={'custom'}
              title={'Cancel'}
              onClick={handleCancel}
              disabled={false}
            />
          </div>

          {
            state.categoryPicker.isComplete ?
              <div className='col-6'>
                {
                  <SignUpButton
                    type={'custom'}
                    title={'Add'}
                    onClick={() => handleAddCategory()}
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

export default AddNewCharacteristicCategory
