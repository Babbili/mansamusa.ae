import React, { useContext } from 'react'
import AppContext from '../../../../../../../components/AppContext'
import CharacteristicCartRow from './CharacteristicCartRow/CharacteristicCartRow'
import styles from './CharacteristicCart.module.scss'


const CharacteristicCart = (
  {
    len,
    char,
    isError,
    handleChange,
    handleAddRow,
    handleRemoveRow,
    handleCharacteristicsPrice,
    handleCharacteristicsPrefix,
    handleCharacteristicsQuantity
  }) => {

  const context = useContext(AppContext)
  const { lang } = context


  return(

    <div className={styles.CharacteristicCart}>

      <div className={styles.header}>
        { char.title[lang] }
      </div>

      <div className={styles.body}>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              {
                !char.isMultiple && len > 1 ? null : <th>Quantity</th>
              }
              <th>Price Prefix</th>
              <th>Price (eg. +4.05, -8.10)</th>
              <th/>
            </tr>
          </thead>
          <tbody>
            {
              char.items.map((item, index) => {

                return(

                  <CharacteristicCartRow
                    len={len}
                    key={index}
                    item={item}
                    index={index}
                    isError={isError}
                    title={char.title}
                    options={char.options}
                    handleChange={handleChange}
                    isMultiple={char.isMultiple}
                    handleRemoveRow={handleRemoveRow}
                    handleCharacteristicsPrice={handleCharacteristicsPrice}
                    handleCharacteristicsPrefix={handleCharacteristicsPrefix}
                    handleCharacteristicsQuantity={handleCharacteristicsQuantity}
                  />

                )

              })
            }
          </tbody>
        </table>

        {
          char.isMultiple ?
            <div className={styles.addMore}>
              <div
                className={styles.wrapper}
                onClick={() => handleAddRow(char.title)}
              >
                Add More <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path></svg>
              </div>
            </div> : null
        }

      </div>

    </div>

  )

}

export default CharacteristicCart
