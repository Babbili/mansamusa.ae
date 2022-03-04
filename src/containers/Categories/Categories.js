import React, { useCallback, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { firestore } from '../../firebase/config'
import { colors } from '../../components/utils/colors'
import Slider from '../../components/Slider/Slider'
import Banners from '../../components/Banners/Banners'
import Banner from '../../components/Banners/Banner/Banner'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import Category from '../Category/Category'
import ProductItem from '../../components/ProductItem/ProductItem'
import CategoryItem from '../../components/CategoryItem/CategoryItem'
import CategoryBanners from '../../components/CategoryBanners/CategoryBanners'
import styles from './Categories.module.scss'


const Categories = props => {

  const { url } = useRouteMatch()
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [promos, setPromos] = useState([])
  const [products, setProducts] = useState([])

  const getSubCategories = useCallback((initialQuery, categories, index) => {

    const getSubs = (initialQuery, categories, index) => {

      let currentIndex = index === categories.length - 1 ? categories.length - 1 : index

      if (index <= categories.length - 1) {

        initialQuery.where('title.en', '==', categories[currentIndex])
        .get().then(querySnapshot => {

          currentIndex = currentIndex + 1

          querySnapshot.forEach(doc => {
            doc.ref.collection('subCategories')
            .get().then(querySnapshot => {
              let docs = {
                title: doc.data().title,
                subCategories: []
              }
              querySnapshot.forEach(doc => {
                docs = {
                  ...docs,
                  subCategories: [...docs.subCategories, {id: doc.id, ...doc.data()}]
                }
              })
              setSubCategories(prevState => {
                return [...prevState, docs]
              })
            })
            .then(() => {
              if (currentIndex <= categories.length) {
                getSubs(initialQuery, categories, currentIndex)
              }
            })
          })
        })

      }

    }

    return getSubs(initialQuery, categories, index)

  }, [])

  const getPromos = useCallback((initialQuery, categories, index) => {

    const getProms = (initialQuery, categories, index) => {

      let currentIndex = index === categories.length - 1 ? categories.length - 1 : index

      if (index <= categories.length - 1) {

        initialQuery.where('title.en', '==', categories[currentIndex])
        .get().then(querySnapshot => {

          currentIndex = currentIndex + 1

          querySnapshot.forEach(doc => {
            doc.ref.collection('promos')
            .get().then(querySnapshot => {
              let docs = {
                title: doc.data().title,
                promos: []
              }
              querySnapshot.forEach(doc => {
                docs = {
                  ...docs,
                  promos: [...docs.promos, {id: doc.id, ...doc.data()}]
                }
              })
              setPromos(prevState => {
                return [...prevState, docs]
              })
            })
            .then(() => {
              if (currentIndex <= categories.length) {
                getPromos(initialQuery, categories, currentIndex)
              }
            })
          })
        })

      }

    }

    return getProms(initialQuery, categories, index)

  }, [])

  useEffect(() => {

    return firestore.collection('productTypes')
    .where('isHidden', '==', false)
    .onSnapshot(snapshot => {
      let categories = []
      snapshot.forEach(doc => {
        categories = [...categories, {id: doc.id, ...doc.data()}]
      })
      setBanners(categories)
    })

  }, [])

  useEffect(() => {
    if (banners.length > 0) {
      let temp = banners.map(banner => banner.title)
      setCategories(temp)
    }
  }, [banners])

  useEffect(() => {

    if (categories.length > 0) {
      return firestore.collection('products')
      .where('categoryPicker.productCategories', 'array-contains-any', categories)
      .onSnapshot(snapshot => {
        let products = []
        snapshot.forEach(doc => {
          products = [...products, {id: doc.id, ...doc.data()}]
        })
        setProducts(products)
      })
    }

  }, [categories])

  useEffect(() => {

    if (categories.length > 0) {

      let initialQuery = firestore.collection('productTypes')
      .where('isHidden', '==', false)
      let index = 0
      let localIndex = 0

      getSubCategories(initialQuery, categories, localIndex)
      getPromos(initialQuery, categories, index)

    }

  }, [categories, getPromos, getSubCategories])


  return(

    <section className={styles.categories+` bd__container`}>
      <h2>Categories</h2>
      <Banners>
        {
          banners.length > 0 ?
            banners.map((banner, index) => (
              <Banner
                url={url}
                key={index}
                isHome={false}
                banner={banner}
              />
            )) :
            <div className='container-fluid min-vh-100'>
              <div className='row'>
                <div className='col-12 py-5'>
                  <BasicSpinner />
                </div>
              </div>
            </div>
        }
      </Banners>

      {

        subCategories.map((subCategory, index) => {

          return(

            <section key={index}>

              <Slider
                isArrows={true}
                isHeader={true}
                isPaddings={true}
                url={'/categories'}
                link={'/categories'}
                title={`NEW IN ${subCategory.title}`}
                length={products.length}
              >
                {
                  products.length > 0 ?
                    products.map((product, index) => (
                      <ProductItem key={index} product={product} />
                    )) : <BasicSpinner />
                }
              </Slider>

              {
                subCategory.subCategories.length > 0 ?
                  <Slider
                    isArrows={true}
                    isHeader={true}
                    isPaddings={true}
                    url={url}
                    link={subCategory.title}
                    title={`${subCategory.title} CATEGORIES`}
                    length={subCategory.subCategories.length}
                    bgColor={colors.primary}
                  >
                    {
                      subCategory.subCategories.map((category, index) => (
                        <CategoryItem
                          url={url}
                          link={subCategory.title}
                          col={subCategory.subCategories.length < 4 ? 6 : 3}
                          key={index}
                          category={category}
                        />
                      ))
                    }
                  </Slider> : null
              }

            </section>

          )

        })

      }

      

    </section>

  )

}

export default Categories
