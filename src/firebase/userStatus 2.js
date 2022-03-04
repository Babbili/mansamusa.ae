import firebase from './config'

export const userStatus = uid => {

  const userStatusDatabaseRef = firebase.database().ref('/status/' + uid)

  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  }

  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  }

  firebase.database().ref('.info/connected').on('value', function(snapshot) {

    if (snapshot.val() === false) {
      return
    }

    userStatusDatabaseRef
    .onDisconnect()
    .set(isOfflineForDatabase)
    .then(() => {

      userStatusDatabaseRef
      .set(isOnlineForDatabase)

    })
  })

}
