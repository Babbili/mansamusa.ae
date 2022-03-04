import React from 'react'
import SupplierStoreCard from './SupplierStoreCard/SupplierStoreCard'
import SignUpButton from '../../../../components/UI/SignUpButton/SignUpButton'

import rent from '../../../../assets/rentMansaMusa.png'
import styles from './SupplierStoresDashboard.module.scss'


const SupplierStoresDashboard = ({ t, url, lang, stores, handleDefault, isTrial, approved, currentStore, isSubscribed, setCurrentStore, ...props }) => {


  return(

    

      <div className={`${styles.SupplierStoresDashboard}`}>

        <div className={`${styles.dashboard__img} col-lg-6 col-12 text-center`}>
          <img src={rent} alt='Suppliers Pre-registration' />
        </div>

        
        {
          stores.map((store, index) => {
            return(
              <SupplierStoreCard
                t={t}
                {...props}
                lang={lang}
                key={index}
                store={store}
                stores={stores}
                handleDefault={handleDefault}
                isTrial={isTrial}
                currentStore={currentStore}
                setCurrentStore={setCurrentStore}
              />
            )
          })
        }
      
        <div className='col-lg-6 col-12'>
          <SignUpButton
            type={'custom'}
            title={ t('addNewStore.label') }
            onClick={() => props.history.push(`${url}/add-new-store`)}
            disabled={false}
            isWide={true}
          />
        </div>
      

    </div>

  )

}

export default SupplierStoresDashboard
