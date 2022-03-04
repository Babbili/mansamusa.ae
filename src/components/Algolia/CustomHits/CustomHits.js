import React from 'react'
import { connectHits } from 'react-instantsearch-dom'
import ProductItem from '../../ProductItem/ProductItem'


const CustomHits = ({ hits }) => (

  <div className='row'>

    {

      hits.map((hit, index) => (

        <ProductItem
          key={index}
          mb={'mb-5'}
          product={hit}
        />

      ))

    }

  </div>

)

export default connectHits(CustomHits)
