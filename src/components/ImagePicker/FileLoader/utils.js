import firebase, { storage } from '../../../firebase/config'


export const moveFirebaseFile = async (tmpPath, prodPath) => {

  let oldRef = storage.ref().child(tmpPath)

  const loadBlob = async (url) => {
    return new Promise( (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload  = () => resolve(xhr.response);
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }

  let url = await oldRef.getDownloadURL()
  let file = await loadBlob(url)

  return storage.ref().child(prodPath).put(file)
  .then(snapshot => {
    return snapshot.ref.getDownloadURL()
    .then(url => {
      // oldRef.delete().then(r => {})
      return url
    })
  })

}

export const removeTempFiles = tmpPath => {
  let tmpRef = storage.ref().child(tmpPath)
  tmpRef.delete().then(r => {})
}

export const tempFileUrl = async (id, file) => {

  const storageRef = storage.ref()
  const imageRef = storageRef.child(`tmp/${id}/${file.source}`)

  return imageRef
    .getDownloadURL()
    .then(url => {
      return url
    })

}

export const localImageUrlProcessor = async (uid, file) => {

  const storageRef = storage.ref()
  const imageRef = storageRef.child(`images/${uid}/${file.name}/${file.source}`)

  return imageRef
    .getDownloadURL()
    .then(url => {
      return url
    })

}

export const limboImageUrlProcessor = async file => {

  const imageRef = firebase.storage().ref(`tmp/${file.source}`)

  return imageRef
    .getDownloadURL()
    .then(url => {
      return url
    })

}

export const removeLimboFile = path => {
  let tmpRef = storage.ref().child(path)
  tmpRef.delete().then(r => {})
}

export const removeLocalFile = path => {
  let tmpRef = storage.ref().child(path)
  tmpRef.delete().then(r => {})
}