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

    let kFilter='title.en';
    if (en=='en')
      kFilter='title.en';
    else if (en=='ar')
      kFilter='title.ar';
    else if (en=='tr')
      kFilter='title.tr';
    else if (en=='ru')
      kFilter='title.ru';

    return await firestore.collection('productTypes')
    .where(kFilter, '==', category)
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
    let kFilter='title.en';
    if (en=='en')
      kFilter='title.en';
    else if (en=='ar')
      kFilter='title.ar';
    else if (en=='tr')
      kFilter='title.tr';
    else if (en=='ru')
      kFilter='title.ru';

    return await firestore.collectionGroup('subCategories')
    .where(kFilter, '==', category)
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

    if (pathname.split('/')!==undefined && pathname.split('/').length === 3) {

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
      let localIndex = index === categories!==undefined && categories.length - 1 ? categories.length - 1 : index
      
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

          if (categories!==undefined && index === categories.length - 1) {

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

        if (categories!==undefined && index <= categories.length - 1) {
          getProms(localPath, categories, localIndex)
        }

      })

    }

    return getProms(path, categories, index)

  }, [])

  useEffect(() => {
    setPromos([])
    let arr = pathname.split('/').filter(f => f !== '')
    if (arr!==undefined && arr.length === 2) {
      setIsInitial(true)
      // setCategories(arr.splice(2))
    } else {
      // setCategories(arr.splice(2))
    }
  }, [pathname])

  useEffect(() => {
    let kFilter='title.en';
    if (lang=='en')
      kFilter='title.en';
    else if (lang=='ar')
      kFilter='title.ar';
    else if (lang=='tr')
      kFilter='title.tr';
    else if (lang=='ru')
      kFilter='title.ru';

    let initialCategory = firestore.collection('productTypes')
    .where(kFilter, '==', titleCase(category))

    if (categories!==undefined && categories.length > 0) {
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

    /*styles.category+*/
    <div className={`bd__container`}>

      {
        rootPath!==undefined && rootPath.length > 0 ?

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
