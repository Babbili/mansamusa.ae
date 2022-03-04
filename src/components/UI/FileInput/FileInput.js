import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import firebase from '../../../firebase/config'
import AppContext from '../../AppContext'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilepondPluginDragReorder from 'filepond-plugin-drag-reorder'
import FilePondPluginFileRename from 'filepond-plugin-file-rename'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import moment from 'moment'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css'
import FilePondPluginFilePoster from 'filepond-plugin-file-poster'
import FilePondPluginImageEditor from 'filepond-plugin-image-editor'

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
// import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'
import 'filepond/dist/filepond.css'
import './FileInput.css'

import 'doka/doka.css'
import {
  // editor
  openEditor,
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  legacyDataToImageState,
  processImage,
  imageOrienter,

  // plugins
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_crop_defaults,
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
} from 'doka';

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilepondPluginDragReorder,
  FilePondPluginFileRename,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageCrop,
  FilePondPluginImageEditor,
  FilePondPluginFilePoster
)

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_decorate)


const FileInput = ({ratio, width, height, title, images, setImages, isCrop, isTransform, isMultiple, isRemove}) => {

  const context = useContext(AppContext)
  let {t} = useTranslation()
  const [files, setFiles] = useState([])
  const [uid, setUid] = useState('')

  useEffect(() => {
    if (isRemove) {
      setFiles([])
    }
  }, [isRemove])

  useEffect(() => {
    if (context.currentUser !== null) {
      const {uid} = context.currentUser
      return setUid(uid)
    }
  }, [context.currentUser])

  useEffect(() => {

    if (files.length === 0 && images.length > 0) {

      let temp = images.map(m => {
        return {
          source: m.name,
          options: {
            type: 'local'
          }
        }
      })
      return setFiles(temp)

    }

  }, [images, files.length])

  const reOrder = (arr, from, to) => {
    let cutOut = arr.splice(from, 1)[0]
    arr.splice(to, 0, cutOut)
    setImages(arr)
    return arr
  }

  console.log('files', files)

  return (

    uid.length > 0 ?
      <FilePond
        imageEditor={{
          // map legacy data objects to new imageState objects
          legacyDataToImageState: legacyDataToImageState,

          // used to create the editor, receives editor configuration, should return an editor instance
          createEditor: openEditor,

          // Required, used for reading the image data
          imageReader: [
            createDefaultImageReader,
            {
              /* optional image reader options here */
            },
          ],

          // optionally. can leave out when not generating a preview thumbnail and/or output image
          imageWriter: [
            createDefaultImageWriter,
            {
              /* optional image writer options here */
            },
          ],

          // used to generate poster images, runs an editor in the background
          imageProcessor: processImage,

          // editor options
          editorOptions: {
            imageOrienter: imageOrienter,
            ...plugin_crop_defaults,
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
        allowImageEdit={false}
        // styleImageEditButtonEditItemPosition={'center'}
        // imageEditInstantEdit={false}
        imageEditAllowEdit={true}
        allowImageCrop={isCrop}
        imageCropAspectRatio={ratio}
        allowImageTransform={isTransform}
        imageTransformOutputQuality={70}
        imageTransformOutputQualityMode={'optional'}
        allowImageResize={true}
        imageResizeUpscale={true}
        imageResizeTargetWidth={width}
        imageResizeTargetHeight={height}
        imageResizeMode={'cover'}
        allowFileRename={true}
        fileRenameFunction={(file) => {
          return `${uid}-${moment().unix() + Math.random()}${file.extension}`
        }}
        files={files}
        allowMultiple={isMultiple}
        allowReorder={true}
        allowRevert={true}
        onupdatefiles={setFiles}
        onreorderfiles={(files, origin, target) => {
          setImages(prevState => {
            return reOrder(prevState, origin, target)
          })
        }}
        labelIdle={`${title !== undefined ? title : `${t('placeYourFileHere.label')} <span class="filepond--label-action"> ${t('browseFiles.label')} </span>`}`}
        server={{

          process: (fieldName, file, metadata, load, error, progress) => {

            const task = firebase.storage().ref(`images/${file.name}`).put(file)

            task.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              snap => {
                // provide progress updates
                progress(true, snap.bytesTransferred, snap.totalBytes)
              },
              err => {
                // provide errors
                error(err.message)
              },
              () => {
                firebase.storage()
                .ref(`images/${file.name}`)
                .getDownloadURL()
                .then(url => {
                  // the file has been uploaded
                  let image = {
                    name: file.name,
                    url: url
                  }
                  setImages(prevState => [...prevState, image])
                })
                load(file.name)
              }
            )
          },

          load: (source, load, error, progress, abort) => {

            // reset our progress
            progress(true, 0, 1024)

            // fetch the download URL from firebase
            firebase.storage()
            .ref(`images/${source}`)
            .getDownloadURL()
            .then(url => {
              // fetch the actual image using the download URL
              // and provide the blob to FilePond using the load callback
              let xhr = new XMLHttpRequest()
              xhr.responseType = 'blob'
              xhr.onload = function (event) {
                let blob = xhr.response
                load(blob)
              }
              xhr.open('GET', url)
              xhr.send()
            })
            .catch(err => {
              error(err.message)
              abort()
            })
          },

          revert: (uniqueFileId, load, error) => {

            let fileRef = firebase.storage().ref(`images/`).child(uniqueFileId)
            let filteredImages = images.filter(f => f.name !== uniqueFileId)
            setImages(filteredImages)

            fileRef.delete()
            .then(r => {

            })
            .catch(error => {
              // console.log('something went wrong')
            })

            error('Remove error')

            load()

          },

          remove: (source, load, error) => {

            let fileRef = firebase.storage().ref(`images/`).child(source)
            let filteredImages = images.filter(f => f.name !== source)
            setImages(filteredImages)

            fileRef.delete()
            .then(r => {

            })
            .catch(error => {
              // console.log('something went wrong')
            })

            error('Remove error')

            load()
          },

          restore: (uniqueFileId, load, error, progress, abort, headers) => {

            progress(true, 0, 1024)

            // fetch the download URL from firebase
            firebase.storage()
            .ref(`images/${uniqueFileId}`)
            .getDownloadURL()
            .then(url => {
              // fetch the actual image using the download URL
              // and provide the blob to FilePond using the load callback
              let xhr = new XMLHttpRequest()
              xhr.responseType = 'blob'
              xhr.onload = function (event) {
                let blob = xhr.response
                load(blob)
              }
              xhr.open('GET', url)
              xhr.send()
            })
            .catch(err => {
              error(err.message)
              abort()
            })

          }

        }}

      />
      : null

  )

}

export default FileInput
