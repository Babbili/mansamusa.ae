import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './PopUpHeader.module.scss'


const PopUpHeader = ({ title, handleClose, ...props }) => {

 return(

   <div className={styles.PopUpHeader}>

     <div className={styles.left}>
       <div
         className={styles.close}
         onClick={() => handleClose()}
       >
         <FontAwesomeIcon icon={'times'} fixedWidth />
       </div>
       <div className={styles.title}>
         { title }
       </div>
     </div>

     <div className={styles.right}>
       { props.children }
     </div>

   </div>

 )

}

export default PopUpHeader