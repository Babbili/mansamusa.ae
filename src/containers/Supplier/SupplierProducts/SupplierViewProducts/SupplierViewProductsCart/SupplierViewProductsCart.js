import React from 'react'
import styles from './SupplierViewProductsCart.module.scss'


const SupplierViewProductsCart = ({ title, description, number, filter, currentFilter, handleTopFilters }) => {


  return(

    <div
      className={`${styles.AdminViewProductsCart} col-xl-4 col-lg-6 col-md-6 col-12 mb-4`}
      onClick={() => {
        if (filter === 'Approved') {
          handleTopFilters({
            title: filter,
            value: true
          })
        } else if (filter === 'Waiting') {
          handleTopFilters({
            title: filter,
            value: false
          })
        } else {
          handleTopFilters({
            title: 'All',
            value: ''
          })
        }
      }}
    >
      <div className={`${styles.wrapper} ${currentFilter.title === title ? styles.active : ''}`}>
        <div className={styles.left}>
          <h3>{ title }</h3>
          <div className={styles.description}>
            { description }
          </div>
        </div>
        <div className={styles.right}>
          <h3>
            { number }
          </h3>
        </div>
      </div>
    </div>

  )

}

export default SupplierViewProductsCart
