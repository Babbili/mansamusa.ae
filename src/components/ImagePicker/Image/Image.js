import React, { useState, useEffect, useCallback } from 'react'
import { limboImageUrlProcessor, localImageUrlProcessor } from '../FileLoader/utils'

import styles from './Image.module.scss'


const Image = ({ uid, file, name }) => {

  const [url, setUrl] = useState('')

  const getUrl = useCallback(async (uid, file) => {

    if (file.options.type === 'limbo') {
      return await limboImageUrlProcessor(file)
    } else if (file.options.type === 'local') {
      return await localImageUrlProcessor(uid, file)
    }

  }, [])

  useEffect(() => {

    if (file !== null && file.options !== undefined) {
      getUrl(uid, file)
      .then(url => {
        setUrl(url)
      })
    }

  }, [uid, file, getUrl])


  return(

    file !== null ?
      file.type !== undefined ?
        file.type.includes('image') ?
        <div
          className={styles.Image}
          style={{
            borderRadius: name === 'productImages' ? '10px' : '200px',
            width: name === 'productImages' ? '160px' : '200px',
            // height: name === 'productImages' ? '200px' : '200px',
            backgroundImage: `url(${url.length > 0 ? url : ''})`
          }}
        >
          {
            // url.length > 0 ?
            //   <div
            //     className={styles.remove}
            //     onClick={() => handleRemoveFile(uid, file)}
            //   >
            //     <FontAwesomeIcon icon="times" fixedWidth />
            //   </div> : null
          }
        </div> :
        <div>File name: { file.source }</div> :
        <div>Please, update files</div> : null

  )

}

export default Image