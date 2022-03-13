import React, { useContext } from 'react'
import AppContext from '../../../../../../../../components/AppContext'
import Select from '../../../../../../../../components/UI/Select/Select'
import Input from '../../../../../../../../components/UI/Input/Input'


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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" ><path d="M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z"></path><path d="M12 22c5.514 0 10-4.486 10-10S17.514 2 12 2 2 6.486 2 12s4.486 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"></path></svg>
            </div> : <div style={{width: '24px'}} />
        }
      </td>
    </tr>

  )

}

export default CharacteristicCartRow
