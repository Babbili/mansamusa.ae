import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import SupplierHeader from '../../containers/Supplier/SupplierHeader/SupplierHeader'


const AuthLayout = ({ children }) => {

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let width = window.innerWidth
    setIsMobile(width <= 769)
  }, [])


  return(

    <>

      <Header isSupplier={true} />

      {
        isMobile ? null :
          <SupplierHeader {...children.props} />
      }

      { children }

    </>

  )

}

export default AuthLayout
