import React from 'react'
import Select from '../../../../components/UI/Select/Select'

import styles from './ProductDetailsOptions.module.scss'


const ProductDetailsOptions = ({ lang, offers, error, isError, leftOvers, handleOptions }) => {


  return (

    <div className={styles.ProductDetailsOptions}>

      <div className='row'>

        {
          offers.map((offer, index) => {

            let currentLeftOvers = leftOvers
            .filter(l => l.leftOvers.length > 0)
            .map(m => Number(m.leftOvers))[0]

            return(

              offer.isMultiple ?
              <div key={index} className='col-12'>
                <Select
                  lang={lang}
                  title={offer.title[lang]}
                  name={offer.title[lang]}
                  index={index}
                  options={offer.items}
                  defaultValue={offer.title[lang]}
                  handleChange={handleOptions}
                  text={isError ? error : ''}
                  error={isError}
                />
                {
                  currentLeftOvers < 10 ?
                    <div className={styles.leftOvers}>
                      Low in stock: only { currentLeftOvers } left.
                    </div> : null
                }
              </div> : null

            )
          })
        }

      </div>

    </div>

  )

}

export default ProductDetailsOptions
