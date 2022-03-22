import React, { useCallback, useEffect, useState } from 'react'
import { titleCase } from '../../../utils/titleCase'
import { firestore } from '../../../../firebase/config'
import CategoryFilterItem from './CategoryFilterItem/CategoryFilterItem'

import styles from './CategoryFilter.module.scss'
import { useLocation } from "react-router-dom";


const CategoryFilter = ({ category, handleFilters }) => {

  const context = useContext(AppContext)
  let { lang } = context

  let { pathname } = useLocation()

  const [categories, setCategories] = useState([])

  const getSubCategories = useCallback((path, categories, index, filterProps) => {

    const getSubs = (path, categories, index, filterProps) => {

      let currentCategory = categories[index] !== undefined ? titleCase(categories[index]) : ''
      let localPath = path
      let localIndex = index === categories.length - 1 ? categories.length - 1 : index
      let localFilterProps = filterProps

      let kFilter='title.en';
      if (lang=='en')
        kFilter='title.en';
      else if (lang=='ar')
        kFilter='title.ar';
      else if (lang=='tr')
        kFilter='title.tr';
      else if (lang=='ru')
        kFilter='title.ru';

      firestore.collection(`${localPath}/subCategories`)
      .where(kFilter, '==', currentCategory)

      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {

          localPath = localPath + `/subCategories/${doc.id}`
          localIndex = localIndex + 1
          localFilterProps = filterProps.concat(doc.data().title)

          if (index === categories.length - 1) {

            doc.ref.collection('subCategories')
            .orderBy(kFilter, 'asc').get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                setCategories(prevState => {
                  return [...prevState, {
                    path: localPath + '/subCategories/' + doc.id,
                    title: doc.data().title,
                    filterProps: localFilterProps.concat(doc.data().title)
                  }]
                })
              })
            })

          }

        })
      })
      .then(() => {

        if (index <= categories.length - 1) {
          getSubs(localPath, categories, localIndex, localFilterProps)
        }

      })

    }

    return getSubs(path, categories, index, filterProps)

  }, [])

  useEffect(() => {

    let currentCategory = pathname.split('/').splice(3)

    let kFilter='title.en';
    if (lang=='en')
      kFilter='title.en';
    else if (lang=='ar')
      kFilter='title.ar';
    else if (lang=='tr')
      kFilter='title.tr';
    else if (lang=='ru')
      kFilter='title.ru';
    
    let docRef = firestore.collection('productTypes')
    .where(kFilter, '==', titleCase(category))

    docRef.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {

        let localPath = `productTypes/${doc.id}`
        let filterProps = [titleCase(category)]
        let index = 0

        getSubCategories(localPath, currentCategory, index, filterProps)

      })

    })

  }, [category, getSubCategories, pathname])


  return(

    <div className={`${styles.CategoryFilter} col-12`}>
      {
        categories.length > 0 ?
          categories.map((category, index) => (
            <CategoryFilterItem
              key={index}
              category={category}
              handleFilters={handleFilters}
            />
          )) : null
      }
    </div>

  )

}

export default CategoryFilter
