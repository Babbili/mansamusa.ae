import React, { useContext } from 'react'
import AppContext from '../../../../../../../components/AppContext'
import CharacteristicCartRow from './CharacteristicCartRow/CharacteristicCartRow'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
                Add More <FontAwesomeIcon icon='plus-circle' fixedWidth />
              </div>
            </div> : null
        }

      </div>

    </div>

  )

}

export default CharacteristicCart
