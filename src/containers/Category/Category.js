import React, { useCallback, useContext, useEffect, useState } from 'react'
import AppContext from '../../components/AppContext'
import { useLocation, useParams } from 'react-router-dom'
import ProductsCatalog from '../../components/ProductsCatalog/ProductsCatalog'
import { firestore } from '../../firebase/config'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import urlSlug from 'url-slug'
import styles from './Category.module.scss'


const Category = props => {

  const context = useContext(AppContext)
  let { lang, isMobile } = context
  let { pathname} = useLocation()
  let { category } = useParams()

  const [promos, setPromos] = useState([])
  const [rootPath, setRootPath] = useState('')
  const [rootCategory, setRootCategory] = useState({})
  const [categories, setCategories] = useState([])

  const toUpperCase = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  
  const getCategory = async category => {
    const { en } = lang
    return await firestore.collection('productTypes')
    .where('title.en', '==', category)
    .get()
    .then(snap => {
      let cat = {}
      snap.forEach(doc => {
        cat = {
          ...doc.data().title
        }
      })
      setRootCategory(cat)
      return cat
    })

  }

  const getSubCategory = async category => {
    const { en } = lang
    return await firestore.collectionGroup('subCategories')
    .where('title.en', '==', category)
    .get()
    .then(snap => {
      let cat = {}
      snap.forEach(doc => {
        cat = {
          ...doc.data().title
        }
      })
      return cat
    })

  }


  const getRootInitialPath = useCallback(async (curr) => {
    const { en } = lang
    let cat = await getCategory(toUpperCase(curr))
    setRootPath(cat[lang])
    setCategories([cat[lang]])

  }, [lang])

  const getRootNestedPath = useCallback(async (category, curr) => {

    let cat = await getCategory(titleCase(category))

    let cats = [...curr]
    .map(m => titleCase(m))

    let objs = []

    for (const cat of cats) {

      let obj = await getSubCategory(cat)
      // console.log('obj', obj)
      objs = [...objs, obj]

    }
    const { en } = lang
    setCategories([cat, ...objs].map(m => m[lang]).filter(f => f !== undefined))

    let rp = [cat, ...objs].map(m => m[lang]).join(' > ')

    setRootPath(rp)

  }, [lang])

  useEffect(() => {

    if (pathname.split('/').length === 3) {

      // initial
      getRootInitialPath(titleCase(category))
      .then(() => {})

    } else {

      // nested
      let curr = pathname.split('/').splice(3)
      getRootNestedPath(titleCase(category), curr)
      .then(() => {})

    }

  }, [category, pathname, rootPath, getRootInitialPath, getRootNestedPath])

  const [isInitial, setIsInitial] = useState(false)

  const titleCase = name => {

    let revert = urlSlug.revert(name, () => name.split('-').join(' '))

    return revert.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  }

  const getPromos = useCallback((path, categories, index) => {

    const getProms = (path, categories, index) => {

      let currentCategory = categories[index] !== undefined ? titleCase(categories[index]) : ''
      let localPath = path
      let localIndex = index === categories.length - 1 ? categories.length - 1 : index

      firestore.collection(`${localPath}/subCategories`)
      .where('title.en', '==', currentCategory)
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {

          localPath = localPath + `/subCategories/${doc.id}`
          localIndex = localIndex + 1

          if (index === categories.length - 1) {

            doc.ref.collection('promos')
            .get().then(querySnapshot => {
              let promos = []
              querySnapshot.forEach(doc => {
                promos = [...promos, {id: doc.id, ...doc.data()}]
              })
              setPromos(promos)
            })

          }

        })
      })
      .then(() => {

        if (index <= categories.length - 1) {
          getProms(localPath, categories, localIndex)
        }

      })

    }

    return getProms(path, categories, index)

  }, [])

  useEffect(() => {
    setPromos([])
    let arr = pathname.split('/').filter(f => f !== '')
    if (arr.length === 2) {
      setIsInitial(true)
      // setCategories(arr.splice(2))
    } else {
      // setCategories(arr.splice(2))
    }
  }, [pathname])

  useEffect(() => {

    let initialCategory = firestore.collection('productTypes')
    .where('title.en', '==', titleCase(category))

    if (categories.length > 0) {
      initialCategory.get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let localPath = `productTypes/${doc.id}`
          let localIndex = 0
          getPromos(localPath, categories, localIndex)
        })
      })
    } else {
      if (isInitial) {
        initialCategory.get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.collection('promos')
            .get().then(querySnapshot => {
              let promos = []
              querySnapshot.forEach(doc => {
                promos = [...promos, {id: doc.id, ...doc.data()}]
              })
              setPromos(promos)
            })
          })
        })
      }
    }

  }, [category, categories, getPromos, isInitial])

 console.log('pathname', pathname)
 console.log('rootPath', rootPath)
 console.log('rootCategory', rootCategory)
  return(

    <div className={styles.category+` bd__container`}>

      {
        rootPath.length > 0 ?
          <ProductsCatalog
            isMobile={isMobile}
            category={category}
            rootPath={rootPath}
            categories={categories}
            rootCategory={rootCategory}
          /> :
          <div className='row my-5'>
            <div className='col-12'>
              <BasicSpinner />
            </div>
          </div>
      }

    </div>

  )

}

export default Category
