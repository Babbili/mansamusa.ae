import React from 'react'
import SupplierPlanItem from '../SupplierPlanItem/SupplierPlanItem'


const SupplierPlanItems = ({ current, selected, setSelected, subscriptions, subscriptionData, isSpecialApprove, selectedByClick }) => {

  return(

    <div className='row mb-4 d-flex justify-content-center'>

      {
        subscriptions.map((subscription, index) => (
          <SupplierPlanItem
            key={index}
            current={current}
            selected={selected}
            selectPlan={setSelected}
            subscription={subscription}
            subscriptionData={subscriptionData}
            isSpecialApprove={isSpecialApprove}
            selectedByClick={selectedByClick}
          />
        ))
      }

    </div>

  )

}

export default SupplierPlanItems