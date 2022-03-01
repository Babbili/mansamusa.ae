import React from 'react'
import Select from '../../../../components/UI/Select/Select'


const DeliveryAddressSelector = ({ lang, state, handleSelectAddress }) => {


  return(

    <div className='col-12'>

      <Select
        lang={lang}
        name={'selectedAddress'}
        title={'Select an Address'}
        options={state.addresses}
        value={state.selectedAddress}
        handleChange={handleSelectAddress}
      />

    </div>

  )

}

export default DeliveryAddressSelector
