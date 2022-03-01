import React from 'react'
import { connectToggleRefinement } from 'react-instantsearch-dom'

import styles from './CustomToggleRefinement.module.scss'


const CustomToggleRefinement = ({ currentRefinement, refine, label, createURL }) => {


  return(

    <div className={styles.CustomToggleRefinementItem}>

      <a
        className={styles.wrapper}
        href={createURL(currentRefinement)}
        onClick={event => {
          event.preventDefault()
          refine(!currentRefinement)
        }}
      >

        <input
          type='checkbox'
          className={styles.checkBox}
          id={label}
          name={label}
          checked={currentRefinement}
          readOnly
        />

        <label
          className={styles.label}
          htmlFor={label}
        >
          { label }
        </label>

      </a>

    </div>

    // <a
    //   href="#"
    //   style={{ fontWeight: currentRefinement ? 'bold' : '' }}
    //   onClick={event => {
    //     event.preventDefault()
    //     refine(!currentRefinement)
    //   }}
    // >
    //   { label }
    // </a>

  )

}

export default connectToggleRefinement(CustomToggleRefinement)
