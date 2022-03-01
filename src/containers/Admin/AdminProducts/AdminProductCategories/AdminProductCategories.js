import React, { useEffect, useState, useContext } from 'react'
import { firestore } from '../../../../firebase/config'
import AppContext from '../../../../components/AppContext'
import BasicSpinner from '../../../../components/UI/BasicSpinner/BasicSpinner'
import AdminProductCategoryItem from './AdminProductCategoryItem/AdminProductCategoryItem'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'
import AddNewCategory from './AddNewCategory/AddNewCategory'

import styles from './AdminProductCategories.module.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import { moveFirebaseFile } from '../../../../components/ImagePicker/FileLoader/utils';


const AdminProductCategories = props => {

  const context = useContext(AppContext)
  let { currentUser } = context
  let { path } = useRouteMatch()
  let { setBc, url, bc } = props

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {

    setCategories([])

    let newUrl = url.split('/')
    newUrl.splice(0, 4)

    setBc(prevState => {
      return prevState.filter((f, i) => {
        return newUrl.indexOf(f.id) !== -1
      })
    })

    if (newUrl.length > 0) {

      let localPath = ''

      if (newUrl.length === 1) {
        localPath = 'productTypes/' + newUrl.join('') + '/subCategories/'
      } else {
        localPath = 'productTypes/' + newUrl.join('/subCategories/') + '/subCategories/'
      }

      return firestore.collection(localPath)
      .onSnapshot(snapshot => {
        let categories = []
        snapshot.forEach(doc => {
          categories = [...categories, {id: doc.id, ...doc.data()}]
        })
        setCategories(categories)
        setTimeout(() => {
          setIsReady(true)
        }, 500)
      })

    } else {

      return firestore.collection('productTypes')
      .where('isHidden', '==', false)
      .onSnapshot(snapshot => {
        let categories = []
        snapshot.forEach(doc => {
          categories = [...categories, {id: doc.id, ...doc.data()}]
        })
        setCategories(categories)
        setTimeout(() => {
          setIsReady(true)
        }, 500)
      })

    }

  }, [url, setBc, isReady])

  const handleRemove = id => {

    let newUrl = url.split('/')
    newUrl.splice(0, 4)

    let localPath = ''

    if (newUrl.length === 0) {
      localPath = 'productTypes/'
    } else if (newUrl.length === 1) {
      localPath = 'productTypes/' + newUrl.join('') + '/subCategories/'
    } else {
      localPath = 'productTypes/' + newUrl.join('/subCategories/') + '/subCategories/'
    }

    firestore.collection(localPath).doc(id).delete().then(() => {})

  } // +

  const handleEdit = category => {
    setNewCategory(category)
  } // +

  const handleNew = () => {
    setNewCategory({
      title: {en: '', ar: ''},
      description: {en: '', ar: ''},
      image: [],
      imgUrl: '',
      isHidden: false,
      isHome: false,
      isTop: false
    })
  } // +

  const handleChange = (event) => {
    const { value, name } = event.target

    let param = name.split('.')[0]
    let lang = name.split('.')[1]

    setNewCategory({
      ...newCategory,
      [param]: {
        ...newCategory[param],
        [lang]: value
      }
    })
  } // +

  const handleCheck = (name, value) => {
    setNewCategory({
      ...newCategory,
      [name]: value
    })
  } // +

  const handleCancel = () => {
    setNewCategory(null)
  } // +

  const handleUpdate = async id => {

    let newUrl = url.split('/')
    newUrl.splice(0, 4)

    let localPath = ''

    if (newUrl.length === 0) {
      localPath = 'productTypes/'
    } else if (newUrl.length === 1) {
      localPath = 'productTypes/' + newUrl.join('') + '/subCategories/'
    } else {
      localPath = 'productTypes/' + newUrl.join('/subCategories/') + '/subCategories/'
    }

    let updatedFiles = []
    let updatedUrl = ''

    for (const file of newCategory.image) {

      let oldRef = `tmp/${file.source}`
      let newRef = `images/${currentUser.uid}/image/${file.source}`
      let url = await moveFirebaseFile(oldRef, newRef)
      updatedFiles = [...updatedFiles, {
        ...file,
        url,
        options: {
          type: 'local'
        }
      }]
      updatedUrl = url

    }

    firestore.collection(localPath).doc(id)
    .update({
      ...newCategory,
      image: updatedFiles,
      imgUrl: updatedUrl
    })
    .then(() => {
      setNewCategory(null)
    })
  } // +

  const handleAdd = async () => {

    let newUrl = url.split('/')
    newUrl.splice(0, 4)

    let localPath = ''

    if (newUrl.length === 0) {
      localPath = 'productTypes/'
    } else if (newUrl.length === 1) {
      localPath = 'productTypes/' + newUrl.join('') + '/subCategories/'
    } else {
      localPath = 'productTypes/' + newUrl.join('/subCategories/') + '/subCategories/'
    }

    let updatedFiles = []
    let updatedUrl = ''

    for (const file of newCategory.image) {

      let oldRef = `tmp/${file.source}`
      let newRef = `images/${currentUser.uid}/image/${file.source}`
      let url = await moveFirebaseFile(oldRef, newRef)
      updatedFiles = [...updatedFiles, {
        ...file,
        url,
        options: {
          type: 'local'
        }
      }]
      updatedUrl = url

    }

    firestore.collection(localPath)
    .add({
      ...newCategory,
      image: updatedFiles,
      imgUrl: updatedUrl
    })
    .then(() => {
      setNewCategory(null)
    })

  } // +


  return(

    <div className={styles.AdminProductCategories}>

      <Router>

        <Switch>

          <Route exact path={path}>

            {
              isReady ?
                <div className='container-fluid'>

                  <div className={`${styles.dashboard} row`}>

                    {
                      categories.length > 0 ?
                        categories.map((category, index) => (
                          <AdminProductCategoryItem
                            key={index}
                            url={url}
                            setBc={setBc}
                            index={index}
                            category={category}
                            handleEdit={handleEdit}
                            handleRemove={handleRemove}
                          />
                        )) :
                        <div className='col-12 mb-4'>
                          <h5>No categories yet.</h5>
                        </div>
                    }

                  </div>

                  {
                    newCategory !== null ?
                      <AddNewCategory
                        bc={bc}
                        item={newCategory}
                        handleAdd={handleAdd}
                        handleCheck={handleCheck}
                        handleCancel={handleCancel}
                        handleUpdate={handleUpdate}
                        handleChange={handleChange}
                        setNewItem={setNewCategory}
                      /> : null
                  }

                  <div className='row'>
                    <div className='col-lg-4 col-12'>
                      <SignUpButton
                        type={'custom'}
                        title={'Add New'}
                        onClick={handleNew}
                        disabled={false}
                      />
                    </div>
                  </div>

                </div> :
                <BasicSpinner />
            }

          </Route>

          <Route
            path={`${path}/:id`}
            render={props =>
              <AdminProductCategories
                bc={bc}
                url={url}
                setBc={setBc}
                {...props}
              />
            }
          />

        </Switch>

      </Router>

    </div>

  )

}

export default AdminProductCategories
