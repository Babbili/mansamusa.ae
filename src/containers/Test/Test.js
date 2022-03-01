import React, { useState } from 'react'
import ImagePicker from '../../components/ImagePicker/ImagePicker'


const Test = () => {

  const [state, setState] = useState({
    images: []
  })

  console.log('main state', state)

  return (

    <div className='container-fluid my-5'>

      <div className='row my-5'>

        <div className='col-12 my-5'>

          <ImagePicker
            name={'image'}
            state={state}
            setState={setState}
          />

        </div>

      </div>

    </div>

  )

}

export default Test