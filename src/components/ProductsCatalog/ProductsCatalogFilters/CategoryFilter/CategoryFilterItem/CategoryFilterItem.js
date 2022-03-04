import React, {useContext, useEffect, useState} from 'react'

import styles from './CategoryFilterItem.module.scss'
import {firestore} from "../../../../../firebase/config";
import AppContext from "../../../../AppContext";


const CategoryFilterItem = ({ category, handleFilters }) => {

  const context = useContext(AppContext)
  let { lang } = context
  const [isChecked, setIsChecked] = useState(false)
  const [isToggle, setIsToggle] = useState(false)

  const [categories, setCategories] = useState([])

  useEffect(() => {

    let docRef = firestore.collection(`${category.path}/subCategories`)

    docRef.get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {

        let localPath = `${category.path}/subCategories/${doc.id}`
        let filterProps = [...category.filterProps, doc.data().title.en]

        setCategories(prevState => {
          return [...prevState, {
            path: localPath,
            title: doc.data().title,
            filterProps: filterProps
          }]
        })

      })

    })

  }, [category])



  return(

    <div className={styles.CategoryFilterItem}>
      <div className={styles.wrapper}>
        <input
          type='checkbox'
          className={styles.checkBox}
          id={category.title.en}
          name={category.title.en}
          onChange={() => {
            setIsChecked(!isChecked)
            handleFilters(category.filterProps)
          }}
          checked={isChecked}
        />

        {
          isChecked ?
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg> : null
        }

        <label className={styles.label} htmlFor={category.title.en}>
          { category.title[lang] }
        </label>

        {
          categories.length > 0 ?
            <div
              className={styles.arrow}
              onClick={() => setIsToggle(!isToggle)}
              style={{
                transform: `rotate(${isToggle ? '-180deg' : '0deg'})`
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path></svg>
            </div> : null
        }

      </div>

      {
        categories.length > 0 ?
          <ul
            style={{
              maxHeight: isToggle ? '1000px' : '0',
              margin: isToggle ? '15px 0' : '0'
            }}
          >
            {
              categories.map((category, index) => (
                <CategoryFilterItem
                  key={index}
                  category={category}
                  handleFilters={handleFilters}
                />
              ))
            }
          </ul> : null
      }

    </div>

  )

}

export default CategoryFilterItem
