import React, { useContext } from 'react'
import AppContext from '../../../../../../../../components/AppContext'
import Select from '../../../../../../../../components/UI/Select/Select'
import Input from '../../../../../../../../components/UI/Input/Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const CharacteristicCartRow = (
  { index,
    len,
    item,
    title,
    options,
    isError,
    isMultiple,
    handleChange,
    handleRemoveRow,
    handleCharacteristicsPrice,
    handleCharacteristicsPrefix,
    handleCharacteristicsQuantity
  }) => {

  const context = useContext(AppContext)
  const { lang } = context

  return(

    <tr>
      <td>
        <Select
          lang={lang}
          name={title.en}
          index={index}
          options={options}
          value={item.value}
          title={`Select ${title[lang]}`}
          handleChange={handleChange}
          error={isError && item.value.length === 0}
          text={isError && item.value.length === 0 ? 'Mandatory' : ''}
        />
      </td>
      {
        !isMultiple && len > 1 ? null :
          <td>
            <Input
              index={index}
              name={title.en}
              type='number'
              label='Quantity'
              value={item.quantity}
              handleChange={handleCharacteristicsQuantity}
              error={isError && item.quantity.length === 0}
              text={isError && item.quantity.length === 0 ? 'Mandatory' : ''}
            />
          </td>
      }
      <td>
        <Select
          name={title.en}
          index={index}
          options={item.prefixOptions}
          value={item.prefix}
          handleChange={handleCharacteristicsPrefix}
        />
      </td>
      <td>
        <Input
          index={index}
          name={title.en}
          type='number'
          label='Price'
          value={item.price}
          handleChange={handleCharacteristicsPrice}
        />
      </td>
      <td>
        {
          index > 0 ?
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '19px',
                color: '#ec4646',
                height: '50px',
                cursor: 'pointer'
              }}
              onClick={() => handleRemoveRow(title, index)}
            >
              <FontAwesomeIcon icon='times-circle' fixedWidth />
            </div> : <div style={{width: '24px'}} />
        }
      </td>
    </tr>

  )

}

export default CharacteristicCartRow
