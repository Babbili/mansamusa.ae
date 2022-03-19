import React, { useCallback, useContext, useEffect, useState } from 'react'
import { searchClient } from '../../algolia/config'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import CustomInfiniteHits from '../Algolia/CustomInfiniteHits/CustomInfiniteHits'
import CustomHierarchicalMenu from '../Algolia/CustomHierarchicalMenu/CustomHierarchicalMenu'
import AppContext from '../AppContext'
import urlSlug from 'url-slug'
import qs from 'qs'
import { useLocation, useHistory } from 'react-router-dom'
import { toSlug } from '../utils/toSlug'
import { firestore } from '../../firebase/config'
import Separator from '../UI/Separator/Separator'
import CustomToggleRefinement from '../Algolia/CustomToggleRefinement/CustomToggleRefinement'
import CustomRefinementList from '../Algolia/CustomRefinementList/CustomRefinementList'
import CustomSortBy from '../Algolia/CustomSortBy/CustomSortBy'
import SignUpButton from '../UI/SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'

import styles from './ProductsCatalog.module.scss'


const ProductsCatalog = ({ category, categories, rootCategory, rootPath }) => {

  const { t } = useTranslation()
  const context = useContext(AppContext)
  const { lang, isMobile } = context
  
  const location = useLocation()
  const history = useHistory()

  const DEBOUNCE_TIME = 100

  const createURL = (state) => {

    const isDefaultRoute =
      !state.query &&
      state.page === 1 &&
      (state.refinementList && state.refinementList.storeName.length === 0 &&
        state.refinementList['options.Size'] === 0 &&
        state.refinementList[`options.Colour.${lang}`] === 0 &&
        state.refinementList[`options.Materials.${lang}`] === 0) &&
      (state.hierarchicalMenu && Object.values(state.hierarchicalMenu).length > 0) &&
      (state.toggle && !state.toggle.isDiscount)

    const hierarchicalCats = state.hierarchicalMenu !== undefined ?
      Object.values(state.hierarchicalMenu)
      .map(v => v.split(' > '))
      .flat(1)
      .map(m => encodeURI(toSlug(m))) : ''

    const url = hierarchicalCats.length > 0 ? hierarchicalCats.join('') : `/${category}`
    console.log('hierachicalMenu', state.hierarchicalMenu)
    console.log('hierarchicalCats', hierarchicalCats)

    if (isDefaultRoute) {
      return `/categories${url}/`
    }

    const queryParameters = {}

    if (state.query) {
      queryParameters.query = encodeURIComponent(state.query)
    }

    // if (state.page !== 1) {
    //   queryParameters.page = state.page
    // }

    if (state.refinementList !== undefined && state.refinementList.storeName) {
      queryParameters.brands = state.refinementList.storeName.map(encodeURIComponent)
    }

    if (state.refinementList !== undefined && state.refinementList['options.Size']) {
      queryParameters.sizes = state.refinementList['options.Size'].map(encodeURIComponent)
    }

    if (state.refinementList !== undefined && state.refinementList[`options.Colour.${lang}`]) {
      queryParameters.colours = state.refinementList[`options.Colour.${lang}`].map(encodeURIComponent)
    }

    if (state.refinementList !== undefined && state.refinementList[`options.Materials.${lang}`]) {
      queryParameters.materials = state.refinementList[`options.Materials.${lang}`].map(encodeURIComponent)
    }

    // if (state.toggle && state.toggle.isDiscount) {
    //   queryParameters.discount = 1
    // } else {
    //   queryParameters.discount = 0
    // }

    const queryString = qs.stringify(queryParameters, {
      addQueryPrefix: true,
      arrayFormat: 'repeat',
    })
    console.log('url',url)
    console.log('queryParameters',queryParameters)
    console.log('gueryString', queryString)
    return `/categories${url}/${queryString}`

  }

  const searchStateToUrl = (location, searchState) =>
    searchState ? createURL(searchState) : ''

  const [searchState, setSearchState] = useState({})
  const [isToggle, setIsToggle] = useState(false)
  const [subCategories, setSubCategories] = useState([])

  const setStateId = React.useRef()

  const nextSearchState = useCallback(async (location, searchState) => {

    const urlToSearchState = async (location, searchState) => {

      const {
        query = '',
        // page = 1,
        brands = [],
        // discount,
        sizes = [],
        colours = [],
        materials = []
      } = qs.parse(
        location.search.slice(1)
      )

      const { pathname } = qs.parse(location)
      const pathArr = pathname.split('/').filter(f => f !== '').splice(1)

      const getCategory = async category => {
console.log('X X Cat',category);
        let kFilter='title.en';
        if (lang=='en')
          kFilter='title.en';
        else if (lang=='ar')
          kFilter='title.ar';
        else if (lang=='tr')
          kFilter='title.tr';
        else if (lang=='ru')
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
          return cat
        })

      }

      const getSubCategory = async category => {
        let kFilter='title.en';
        if (lang=='en')
          kFilter='title.en';
        else if (lang=='ar')
          kFilter='title.ar';
        else if (lang=='tr')
          kFilter='title.tr';
        else if (lang=='ru')
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

      let categories = []

      const titleCase = name => {

        let revert = urlSlug.revert(name, () => name.split('-').join(' '))

        return revert.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      }

      for (const [index, path] of pathArr.entries()) {

        if (index > 0) {

          let cat = await getSubCategory(titleCase(path))
          categories = [...categories, cat]

        } else {

          let cat = await getCategory(titleCase(path))
          categories = [...categories, cat]

        }

      }

      let language = [lang]
      let cats = {}
      let catsEn = {}

      language.map(l => {

        //let urlEnVar = 'en'
        let allCats = categories.map(m => m[l])
        /*let newCatData = {}
        let newAllCats = allCats.map((m, i) => {
          
          m=categories[i][urlEnVar]
          return m
        });*/
        /*let initialQuery = firestore.collection('productTypes')
        let index = 0
        
        const response = firestore.collection('productTypes').get()
        .then(snap => {
          let cat = {}
          snap.forEach(doc => {
                    console.log('Alaa Langy 11', doc);

          })
          return cat
        })
*/
        console.log('Alaa Langy',l, allCats);
        let c = {}

        allCats.map((m, i) => {
          let temp = [...allCats]
          console.log('temp', temp)
          
          c = {
            [`hierarchicalCategories.${ l }.lvl0`]: temp.splice(0, i + 1).join(' > ')
          }
          return c
        })
        
        //console.log('Alaa Langy', c);
        cats = c

        return null

      })

      

      // `qs` does not return an array when there's a single value.
      const allBrands = Array.isArray(brands) ? brands : [brands].filter(Boolean)
      const allSizes = Array.isArray(sizes) ? sizes : [sizes].filter(Boolean)
      const allColours = Array.isArray(colours) ? colours : [colours].filter(Boolean)
      const allMaterials = Array.isArray(materials) ? materials : [materials].filter(Boolean)

      return {
        ...searchState,
        query: decodeURIComponent(query),
        // page,
        hierarchicalMenu: cats,
        refinementList: {
          storeName: allBrands.map(decodeURIComponent),
          'options.Size': allSizes.map(decodeURIComponent),
          [`options.Colour.${lang}`]: allColours.map(decodeURIComponent),
          [`options.Materials.${lang}`]: allMaterials.map(decodeURIComponent),
        },
        // toggle: {
        //   isDiscount: discount
        // }
        
      }
    }
  
    console.log('xxxxxx lang', lang)
    return await urlToSearchState(location, searchState)

  }, [lang])

  useEffect(() => {
    
    nextSearchState(location, searchState)
    .then(r => {
      console.log('r', r)
      console.log('searchState', searchState)
      if (JSON.stringify(searchState) !== JSON.stringify(r)) {
        setSearchState(r)
      }

    })

  }, [location, searchState, nextSearchState])

  const onSearchStateChange = (nextSearchState) => {

    clearTimeout(setStateId.current)

    setStateId.current = setTimeout(() => {
      history.push(
        searchStateToUrl(location, nextSearchState),
        nextSearchState
      )
    }, DEBOUNCE_TIME)

    setSearchState(nextSearchState)
  }


  return(

    <div className={`${styles.ProductsCatalog}`}>

          <InstantSearch
            searchClient={searchClient}
            indexName="Products"
            searchState={searchState}
            onSearchStateChange={onSearchStateChange}
            createURL={createURL}
          >

            <Configure hitsPerPage={16} />

            <div className={styles.ProductsCatalog__container}>

              {
                window.innerWidth <= 769 ?
                  <div className='col-12'>
                    <SignUpButton
                      type={'custom'}
                      title={'Filters'}
                      isSmall={false}
                      icon={'bars'}
                      onClick={() => setIsToggle(!isToggle)}
                      disabled={false}
                      isWide={true}
                    />
                  </div> : null
              }

            <div className={styles.ProductsCatalog__header}>
              <div className='col-lg-8 col-12 mb-5'>
                <div className='row'>
                  

                  <div className='col-12 p-lg-0'>
                    <h5>
                      {
                        categories.length > 0 ?
                          categories[categories.length - 1].toString() : ''
                      }
                    </h5>
                  </div>
                </div>
              </div>

              <div className='col-4 justify-content-end align-items-end mb-5 d-none d-lg-flex'>
                <CustomSortBy
                  defaultRefinement="Products"
                  items={[
                    { value: 'Products', label: 'Price asc.' },
                    { value: 'Products_desc', label: 'Price desc.' }
                  ]}
                />
              </div>
            </div>  

            <div className={styles.ProductsCatalog__data}>

                <div className={`${styles.storeCatalogFilters} ${isToggle ? styles.open : ''} row`}>

                  <div className={styles.wrapper}>

                    {
                      isMobile ?
                        <div style={{height: '30px'}} /> : null
                    }

                    <CustomRefinementList
                      title={ t('brands.label') }
                      attribute="storeName"
                      operator="and"
                      translations={{
                        showMore(expanded) {
                          return expanded ? 'Show less' : 'Show more'
                        },
                        noResults: 'No results',
                        submitTitle: 'Submit your search query.',
                        resetTitle: 'Clear your search query.',
                        placeholder: 'Search for brands',
                      }}
                      limit={10}
                      showMoreLimit={10}
                      showMore
                      searchable
                      placeholder={'Search for brands'}
                    />
                    
                    <div className='col-12'>
                      
                      <h6>{ t('categories.label') }</h6>
                      <CustomHierarchicalMenu
                        attributes={[
                          `hierarchicalCategories.${lang}.lvl0`,
                          `hierarchicalCategories.${lang}.lvl1`,
                          `hierarchicalCategories.${lang}.lvl2`,
                          `hierarchicalCategories.${lang}.lvl3`,
                          `hierarchicalCategories.${lang}.lvl4`,
                        ]}

                        createURL={createURL}
                      />
                      <ul>
                      {
                        categories.map((subCat, index) => (
<a
    className={styles.wrapper}
    href={createURL(subCat)}
    
  >

    {subCat}

  </a>                          
                        ))
                      }
                    </ul>
                    </div>
                    
                    <div className='col-12'>
                      <Separator color={'#fff'} />
                    </div>

                    <div className='col-12'>
                      <h6>{ t('discounts.label') }</h6>
                      <CustomToggleRefinement
                        attribute="isDiscount"
                        label="Products with discounts"
                        value={true}
                      />
                    </div>

                    <div className='col-12'>
                      <Separator color={'#fff'} />
                    </div>

                    <CustomRefinementList
                      title={'Size'}
                      attribute="options.Size"
                      operator="and"
                      translations={{
                        showMore(expanded) {
                          return expanded ? 'Show less' : 'Show more'
                        },
                        noResults: 'No results',
                        submitTitle: 'Submit your search query.',
                        resetTitle: 'Clear your search query.',
                        placeholder: 'Search for brands',
                      }}
                    />

                    <CustomRefinementList
                      title={'Colour'}
                      attribute={`options.Colour.${lang}`}
                      operator="and"
                      translations={{
                        showMore(expanded) {
                          return expanded ? 'Show less' : 'Show more'
                        },
                        noResults: 'No results',
                        submitTitle: 'Submit your search query.',
                        resetTitle: 'Clear your search query.',
                        placeholder: 'Search for brands',
                      }}
                    />

                    <CustomRefinementList
                      title={'Material'}
                      attribute={`options.Materials.${lang}`}
                      operator="and"
                      translations={{
                        showMore(expanded) {
                          return expanded ? 'Show less' : 'Show more'
                        },
                        noResults: 'No results',
                        submitTitle: 'Submit your search query.',
                        resetTitle: 'Clear your search query.',
                        placeholder: 'Search for brands',
                      }}
                    />

                  </div>

                  {
                    window.innerWidth < 770 ?
                      <div className={styles.footer}>
                        <SignUpButton
                          type={'custom'}
                          title={'Show Products'}
                          isSmall={false}
                          onClick={() => setIsToggle(!isToggle)}
                          disabled={false}
                          isWide={true}
                        />
                      </div> : null
                  }

                </div>

              <CustomInfiniteHits minHitsPerPage={16} />
            </div>

            </div>

          </InstantSearch>

        

      </div>

    
  )

}

export default ProductsCatalog
