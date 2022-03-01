import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../../firebase/config'
import { titleCase } from '../../components/utils/titleCase'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import AppContext from '../../components/AppContext'

import styles from './Pages.module.scss'


const Pages = props => {

  const context = useContext(AppContext)
  const { lang } = context
  const [page, setPage] = useState({})

  useEffect(() => {

    const name = props.match.params.name
    const title = titleCase(name)

    firestore.collection('pages')
    .where('title.en', '==', title)
    .onSnapshot(snap => {

      let page = {}
      snap.forEach(doc => {
        page = {
          path: ['Home', doc.data().title[lang]],
          ...doc.data()
        }
      })
      setPage(page)

    })

  }, [lang, props])


  return(

    <div className={`${styles.Pages} bd__container`}>

      {
        Object.values(page).length > 0 ?
          <div className='row'>


            <div className='col-12 mb-4'>
              <div className={styles.title}>
                { page.title[lang] }
              </div>
            </div>

            <div className='col-lg-12 col-12'>
              <div
                className={styles.description}
                style={{
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}
                dangerouslySetInnerHTML={{
                  __html: page.description[lang]
                }}
              />
            </div>

            <div className='col-12'>
              <div style={{height: '150px'}} />
            </div>

          </div> :
          <div className='row'>

            <div className='col-12'>
              <div style={{height: '300px'}} />
            </div>

            <BasicSpinner />

            <div className='col-12'>
              <div style={{height: '300px'}} />
            </div>

          </div>
      }

    </div>

  )

}

export default Pages