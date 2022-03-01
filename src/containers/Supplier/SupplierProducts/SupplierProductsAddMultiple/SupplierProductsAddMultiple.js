import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../../../components/AppContext'
import { useTranslation } from 'react-i18next'
import { firestore, functions } from '../../../../firebase/config'
// import FileInput from '../../../../components/UI/FileInput/FileInput'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import Separator from '../../../../components/UI/Separator/Separator'
import Tasks from './Tasks/Tasks'

import styles from './SupplierProductsAddMultiple.module.scss'


const SupplierProductsAddMultiple = ({ currentStore, ...props }) => {

  const context = useContext(AppContext)
  let { lang, currentUser } = context
  let { t } = useTranslation()
  const [file, setFile] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [tasks, setTasks] = useState([])


  useEffect(() => {

    setFile([])

    setTimeout(() => {
      setIsLoaded(true)
    }, 500)

  }, [currentStore])

  useEffect(() => {

    firestore.collection('users').doc(currentUser.uid)
    .collection('tasks')
    .onSnapshot(snapshot => {
      let tasks = []
      snapshot.forEach(doc => {
        tasks = [...tasks, {id: doc.id, ...doc.data()}]
      })
      setTasks(tasks)
    })

  }, [currentUser])

  const upload = () => {

    if (file.length > 0) {

      setIsLoaded(false)

      firestore.collection('users')
      .doc(currentUser.uid)
      .collection('tasks')
      .add({
        processed: false,
        file: file,
        store: currentStore.id,
        isError: false
      })
      .then(docRef => {

        let addMultipleProductsTask = functions
        .httpsCallable('addMultipleProductsTask')

        addMultipleProductsTask({
          file: file[0].url,
          taskId: docRef.id,
          userId: currentUser.uid,
          store: currentStore.id,
          storeName: currentStore.storeName,
          category: currentStore.product
        })
        .then(result => {
          // console.log('result', result)
          setFile([])
          setIsLoaded(true)
        })
        .catch(error => {
          // console.log('error', error)
        })

      })

    }

  }

  return(

    <div className={`${styles.SupplierProductsAddMultiple} container-fluid`}>

      {
        isLoaded ?
          <div className='row justify-content-center'>
            <div className='col-12'>

              <h5
                style={{
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}
              >
                { t('sampleFile.label') }&nbsp;
                <a href='https://firebasestorage.googleapis.com/v0/b/mansamusa-4f8be.appspot.com/o/example.xlsx?alt=media&token=57258873-3999-4596-b545-f69780522c27'>
                  { t('downloadItHere.label') }
                </a>
              </h5>

              <h5
                style={{
                  textAlign: lang === 'ar' ? 'right' : 'left'
                }}
              >
                { t('theBestPractice.label') }
              </h5>

              {/*<FileInput*/}
              {/*  isMultiple={false}*/}
              {/*  images={file}*/}
              {/*  setImages={setFile}*/}
              {/*  isRemove={file.length === 0}*/}
              {/*  title={ t('dragAndDrop.label') }*/}
              {/*/>*/}

            </div>

            <div className='col-6'>
              <SignUpButton
                type={'custom'}
                title={ t('submit.label') }
                onClick={upload}
                disabled={false}
                isWide={true}
              />
            </div>

            {
              tasks.length > 0 ?
                <>
                  <div className='col-12'>
                    <Separator color={'#eef1f5'} />
                  </div>
                  <Tasks tasks={tasks} />
                </> :
                null
            }

          </div> :
          <BasicSpinner />
      }

    </div>

  )

}

export default SupplierProductsAddMultiple
