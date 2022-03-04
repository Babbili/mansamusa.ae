import React, {useContext} from 'react'
import styles from './AdminInvitations.module.scss'
import AppContext from "../../../components/AppContext";


const AdminInvitations = props => {

  const context = useContext(AppContext)
  let { lang } = context

  return(

    <div className={styles.AdminInvitations}>

      <div
        className={styles.title}
        style={{
          textAlign: lang === 'ar' ? 'right' : 'left'
        }}
      >
        Invitations
      </div>

      <div className='container-fluid'>

        <div className='row'>

          <div className='col-12'>


          </div>

        </div>

      </div>

    </div>

  )

}

export default AdminInvitations
