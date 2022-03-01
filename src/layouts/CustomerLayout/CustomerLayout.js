import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
// import CustomerHeader from '../../containers/Customer/CustomerHeader/CustomerHeader'


const CustomerLayout = ({ children, ...props }) => {

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let width = window.innerWidth
    setIsMobile(width <= 769)
  }, [])


  return(

    <>

      <Header isCustomer={true} />
      { children }

    </>

  )

}

export default CustomerLayout
