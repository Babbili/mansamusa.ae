import React from 'react'
import styles from './PopUpHeader.module.scss'


const PopUpHeader = ({ title, handleClose, ...props }) => {

 return(

   <div className={styles.PopUpHeader}>

     <div className={styles.left}>
       <div
         className={styles.close}
         onClick={() => handleClose()}
       >
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>
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