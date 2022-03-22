import React, { useState, useEffect } from 'react'
import firebase, { storage } from '../../../firebase/config'
import moment from 'moment'
import { removeTempFiles } from './utils'
import SignUpButton from '../../UI/SignUpButton/SignUpButton'
import styles from './FileLoader.module.scss'

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginImageEditor from 'filepond-plugin-image-editor'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilepondPluginDragReorder from 'filepond-plugin-drag-reorder'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css'

import 'doka/doka.css'
import {
  // editor
  openEditor,
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  // legacyDataToImageState,
  processImage,
  imageOrienter,

  // plugins
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  // plugin_crop_defaults,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_filter_defaults,
  plugin_decorate,
  plugin_decorate_defaults,
  plugin_decorate_locale_en_gb,
  component_shape_editor_locale_en_gb,
} from 'doka'

registerPlugin(
  FilePondPluginImageExifOrientation,
  // FilePondPluginImagePreview,
  FilepondPluginDragReorder,
  FilePondPluginFileRename,
  // FilePondPluginImageResize,
  // FilePondPluginImageTransform,
  // FilePondPluginImageCrop,
  FilePondPluginImageEditor,
  FilePondPluginFilePoster
)

setPlugins(
  plugin_crop,
  plugin_finetune,
  plugin_filter,
  plugin_decorate
)


const FileLoader = ({ uid, name, state, isMultiple, handleSave, handleCancel }) => {

  const [files, setFiles] = useState([])

  useEffect(() => {


    return state!==undefined && state.length > 0 ?

      setFiles(state) :
      setFiles([])

  }, [state])

  const server = {

    process: (fieldName, file, metadata, load, error, progress, abort) => {

      console.log('process to tmp folder')

      const task = firebase.storage().ref(`tmp/${file.name}`).put(file)

      task.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snap => {
          progress(true, snap.bytesTransferred, snap.totalBytes)
        },
        err => {
          error(err.message)
        },
        () => {
          load(file.name)
        }

      )

      return {
        abort: () => {
          task.cancel()
          abort()
        }
      }

    },

    revert: (uniqueFileId, load, error) => {

      console.log('revert / delete from tmp folder')

      let fileRef = storage.ref(`tmp/${uniqueFileId}`)

      fileRef.delete()
      .then(r => {})
      .catch(err => {
        error(err.message)
      })

      error('Remove error')

      load()

    },

    load: (source, load, error, progress, abort) => {

      // restore from production
      console.log('load from images folder')

      storage
      .ref(`images/${uid}/${name}/${source}`)
      .getDownloadURL()
      .then(url => {

        let xhr = new XMLHttpRequest()

        xhr.responseType = 'blob'

        xhr.onload = function (event) {
          let blob = xhr.response
          load(blob)
        }

        xhr.onerror = (err) => {
          error(err.message)
        }

        xhr.onprogress = (event) => {
          progress(true, event.loaded, event.total)
        }

        xhr.onabort = () => {
          abort()
        }

        xhr.open('GET', url)

        xhr.send()

      })
      .catch(err => {
        error(err.message)
        abort()
      })

    },

    // don't need it
    // fetch: (url, load, error, progress, abort, headers) => {
    //   // fetching file from url
    //
    //   return {
    //     abort: () => {
    //       // User tapped abort, cancel our ongoing actions here
    //
    //       // Let FilePond know the request has been cancelled
    //       abort()
    //     }
    //   }
    // },

    // Remove if local
    // remove: (source, load, error) => {
    //   // remove from production folder
    //   console.log('remove')
    //
    //   // load()
    // },

    restore: (uniqueFileId, load, error, progress, abort, headers) => {

      // restore from tmp folder
      console.log('restore from tmp folder')

      const task = firebase.storage().ref(`tmp/${uniqueFileId}`)

      task
      .getDownloadURL()
      .then(url => {

        let xhr = new XMLHttpRequest()

        xhr.responseType = 'blob'

        xhr.onload = function (event) {
          let blob = xhr.response
          load(blob)
        }

        xhr.onerror = (err) => {
          error(err.message)
        }

        xhr.onprogress = (event) => {
          progress(true, event.loaded, event.total)
        }

        xhr.onabort = () => {
          abort()
        }

        xhr.open('GET', url)

        xhr.send()

      })
      .catch(err => {
        error(err.message)
        abort()
      })

    }

  }

  const handleRemove = (name, files) => {

    handleCancel(name, files)
    files.forEach(file => {
      if (file.options.type === 'limbo') {
        let tmpPath = `tmp/${file.source}`
        removeTempFiles(tmpPath)
      }
    })

  }


  return (

    <div className={styles.FileLoader}>

      <FilePond
        files={files}
        name={name}
        maxFiles={5}
        itemInsertLocation={'after'}

        onupdatefiles={fileItems => {
          let localFiles = fileItems.map((fileItem, index) => {
            return {
              name,
              source: fileItem.file.name,
              size: fileItem.file.size,
              type: fileItem.file.type,
              options: {
                type: 'limbo'
                // type: state.length > 0 && state[index] !== undefined ? state[index].options.type : 'limbo',
              }
            }
          })
          setFiles(localFiles)
        }}

        // file create new name
        allowFileRename={true}
        fileRenameFunction={(file) => {
          return `${file.basename}-${moment().unix() + Math.random()}${file.extension}`
        }}

        // validation
        // allowFileTypeValidation={true}
        // acceptedFileTypes={['image/*']}

        // allowProcess={false}
        allowMultiple={isMultiple}
        allowReorder={true}
        allowRevert={true}
        server={server}

        // preview
        filePosterHeight={250}

        // allowReplace only works when allowMultiple is false
        credits={false}

        allowImageEditor={true}
        imageEditorAllowEdit={true}
        imageEditorWriteImage={true}
        imageEditor={{
          // map legacy data objects to new imageState objects
          // legacyDataToImageState: legacyDataToImageState,

          // used to create the editor, receives editor configuration, should return an editor instance
          createEditor: openEditor,

          // Required, used for reading the image data
          imageReader: [
            createDefaultImageReader,
            {
              orientImage: true
            },
          ],

          // optionally. can leave out when not generating a preview thumbnail and/or output image
          imageWriter: [
            createDefaultImageWriter,
            {

            },
          ],

          // used to generate poster images, runs an editor in the background
          imageProcessor: processImage,

          // editor options
          editorOptions: {
            imageCropAspectRatio: name === 'avatar' || name === 'storeLogo' ?
              1 / 1 : 8 / 10,
            cropEnableImageSelection: false,
            cropSelectPresetOptions: [
              [
                'Crop',
                [
                  [undefined, 'Custom'],
                  [name === 'avatar' || name === 'storeLogo' ? 1 : 0.8, name === 'avatar' || name === 'storeLogo' ? 'Square' : 'Portrait'],
                ],
              ],
              // [
              //   'Size',
              //   [
              //     [[800, name === 'avatar' ? 800 : 1000], name === 'avatar' ? 'Avatar' : 'Product Picture'],
              //   ],
              // ],
            ],
            imageOrienter: imageOrienter,
            // ...plugin_crop_defaults,
            ...plugin_finetune_defaults,
            ...plugin_filter_defaults,
            ...plugin_decorate_defaults,
            locale: {
              ...locale_en_gb,
              ...plugin_crop_locale_en_gb,
              ...plugin_finetune_locale_en_gb,
              ...plugin_filter_locale_en_gb,
              ...plugin_decorate_locale_en_gb,
              ...component_shape_editor_locale_en_gb,
            },
          },
        }}
      />

      <div className={styles.wrapper}>

        <SignUpButton
          isSmall={true}
          title={'Save'}
          onClick={() => {handleSave(uid, name, files)}}
          disabled={false}
        />

        <div style={{width: '15px'}} />

        <SignUpButton
          isSmall={true}
          title={'Cancel'}
          onClick={() => {handleRemove(name, files)}}
          disabled={false}
        />

      </div>

    </div>

  )

}

export default FileLoader