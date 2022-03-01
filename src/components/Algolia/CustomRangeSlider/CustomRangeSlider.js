import React, { useState, useEffect } from 'react'
import { connectRange } from 'react-instantsearch-dom'

import 'rheostat/initialize'
import Rheostat from 'rheostat'
import './CustomRangeSlider.css'


const CustomRangeSlider = ({ min, max, currentRefinement, canRefine, refine }) => {

  const [stateMin, setStateMin] = useState(min)
  const [stateMax, setStateMax] = useState(max)

  useEffect(() => {
    if (canRefine) {
      setStateMin(currentRefinement.min)
      setStateMax(currentRefinement.max)
    }
  }, [canRefine, currentRefinement.min, currentRefinement.max])

  if (min === max) {
    return null
  }

  const onChange = ({ values: [min, max] }) => {
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max })
    }
  };

  const onValuesUpdated = ({ values: [min, max] }) => {
    setStateMin(min)
    setStateMax(max)
  }


  return(

    <Rheostat
      min={min}
      max={max}
      values={[currentRefinement.min, currentRefinement.max]}
      onChange={onChange}
      onValuesUpdated={onValuesUpdated}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          top: '25px',
          position: 'absolute',
          width: '100%'
        }}
      >
        <div className="rheostat-value">{stateMin}</div>
        <div className="rheostat-value">{stateMax}</div>
      </div>
    </Rheostat>

  )

}

export default connectRange(CustomRangeSlider)
