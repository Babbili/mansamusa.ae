import React, { useContext, useEffect, useState } from 'react'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import AppContext from '../../components/AppContext'
import { firestore } from '../../firebase/config'
import {
  InstantSearch,
  RefinementList,
  Configure,
} from 'react-instantsearch-dom'
import { searchClient } from '../../algolia/config'
import CustomHierarchicalMenu from '../../components/Algolia/CustomHierarchicalMenu/CustomHierarchicalMenu'

import styles from './Store.module.scss'
import Separator from "../../components/UI/Separator/Separator";
import CustomToggleRefinement from "../../components/Algolia/CustomToggleRefinement/CustomToggleRefinement";
import CustomRefinementList from "../../components/Algolia/CustomRefinementList/CustomRefinementList";
import CustomInfiniteHits from '../../components/Algolia/CustomInfiniteHits/CustomInfiniteHits';
import SignUpButton from '../../components/UI/SignUpButton/SignUpButton';

// import CustomRangeSlider from "../../components/Algolia/CustomRangeSlider/CustomRangeSlider";
// import CustomHits from '../../components/Algolia/CustomHits/CustomHits'
// import { toSlug } from '../../components/utils/toSlug'
// import Slider from '../../components/Slider/Slider'
// import ProductItem from '../../components/ProductItem/ProductItem'


const Store = props => {

  const context = useContext(AppContext)
  const { lang, isMobile } = context

  const [store, setStore] = useState(null)

  const [isToggle, setIsToggle] = useState(false)

  useEffect(() => {

    return firestore.collectionGroup('stores')
    .where('id', '==', props.match.params.id)
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        setStore(doc.data())
      })
    })

  }, [props.match.params.id])


  return(

    <section className={`${styles.Store} bd__container`}>

      {
        store !== null ?
          <div className={styles.Store__container}>

            <div className={styles.Store__data}>

              <div className={styles.header}>
                <div
                  className={styles.logo}
                  style={{
                    backgroundImage: `url(${store.store.storeLogo.length > 0 ? store.store.storeLogo[0].url : ''})`
                  }}
                />

                <div className={styles.Store__header__name}>
                  <div className={styles.storeName}>
                    { store.storeName }
                  </div>
                  <div className={styles.storeType}>
                    { store.product[lang] } store
                  </div>
                </div>
              </div>

              <div className={styles.description}>
                { store.storeDescription[lang] }
              </div>

            </div>


            <div className={styles.storeCatalog}>

              <InstantSearch searchClient={searchClient} indexName="Products">

                      <Configure hitsPerPage={16} />

                      <div className={styles.ProductsCatalog__container}>

                        {
                          window.innerWidth <= 769  ?
                            <div className='col-12 mb-3'>
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

                        <div className='col-12 mb-5 d-none d-lg-block'>
                          <div className='row'>
                            <div className='col-12 p-lg-0'>
                              <h5>Filters</h5>
                            </div>
                          </div>
                        </div>

                        <div className={styles.ProductsCatalog__data}>

                          <div className={`${styles.storeCatalogFilters} ${isToggle ? styles.open : ''} row`}>

                            <div className={styles.wrapper}>

                              <div className='col-12 d-none'>
                                <RefinementList
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
                                  defaultRefinement={[store.storeName]}
                                />
                              </div>

                              <div className='col-12'>
                                <h6>Category</h6>
                                <CustomHierarchicalMenu
                                  attributes={[
                                    `hierarchicalCategories.${lang}.lvl0`,
                                    `hierarchicalCategories.${lang}.lvl1`,
                                    `hierarchicalCategories.${lang}.lvl2`,
                                    `hierarchicalCategories.${lang}.lvl3`,
                                    `hierarchicalCategories.${lang}.lvl4`,
                                  ]}
                                  rootPath={store.product[lang]}
                                />
                              </div>

                              <div className='col-12'>
                                <Separator color={'#fff'} />
                              </div>

                              <div className='col-12'>
                                <h6>Discounts</h6>
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

            


          </div> :
          <div className='row min-vh-100'>
            <div className='col-12'>
              <BasicSpinner />
            </div>
          </div>
      }

    </section>

  )

}

export default Store
