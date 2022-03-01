import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'


const AdminLayout = ({ children, ...props }) => {

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    let width = window.innerWidth
    setIsMobile(width <= 769)
  }, [])


  return(

    <>

      <Header />

      { children }

    </>

  )

}

export default AdminLayout
