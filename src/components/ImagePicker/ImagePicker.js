import React, { useState } from 'react'
import FileLoader from './FileLoader/FileLoader'
import Image from './Image/Image'
import { limboImageUrlProcessor } from './FileLoader/utils'
import SignUpButton from '../UI/SignUpButton/SignUpButton'
import { useTranslation } from 'react-i18next'

import styles from './ImagePicker.module.scss'



const ImagePicker = ({ uid, state, name, setState, isMultiple }) => {
  
  let { t } = useTranslation()
  const [isFilePondOpen, setIsFilePondOpen] = useState(false)

  const handleSave = async (uid, name, files) => {

    setState(prevState => {

      return {
        ...prevState,
        [name]: files.map(m => {
          if (m.options.type === 'limbo') {
            limboImageUrlProcessor(m)
            .then(url => {
              m.url = url
            })
          }
          return m
        })
      }

    })

    setIsFilePondOpen(!isFilePondOpen)

  }

  const handleCancel = (name, files) => {
    setState(prevState => {
      return {
        ...prevState,
        // [name]: files.filter(f => f.options.type !== 'limbo')
      }
    })
    setIsFilePondOpen(!isFilePondOpen)
  }

  // const handleRemoveFile = (uid, file) => {
  //
  //   if (file !== undefined) {
  //
  //     if (file.options.type === 'limbo') {
  //       let path = `tmp/${file.source}`
  //       removeLimboFile(path)
  //     }
  //
  //     setState(prevState => {
  //       return {
  //         ...prevState,
  //         [file.name]: prevState[file.name].filter(f => f.source !== file.source)
  //       }
  //     })
  //
  //   }
  //
  // }


  return(

    <div className={styles.ImagePicker}>

      {
        isFilePondOpen ?
          <FileLoader
            uid={uid}
            name={name}
            state={state[name]}
            handleSave={handleSave}
            isMultiple={isMultiple}
            handleCancel={handleCancel}
          /> :
          <div className={styles.wrapper}>

            <div className={styles.imageWrapper}>

              {
                state[name] !== undefined && state[name].length > 0 ?
                  state[name].map((file, index) => (
                    <Image key={index} uid={uid} name={name} file={file} />
                  )) :
                  <div className={styles.noFiles}>
                    <label>
                      {t('addYourFiles.label')}
                    </label>
                  </div>
                  // <Image uid={uid} name={name} file={null} />
              }

            </div>

            <SignUpButton
              isSmall={true}
              title={
                state[name].length > 0 ?
                  `${t('editFiles.label')}` : `${t('addFiles.label')}`
              }
              onClick={() => setIsFilePondOpen(!isFilePondOpen)}
              disabled={false}
            />

          </div>
      }

    </div>

  )

}

export default ImagePicker