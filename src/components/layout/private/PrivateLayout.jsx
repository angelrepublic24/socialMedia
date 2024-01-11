import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
  const {auth} = useAuth();
  return (
    <>
        {/* Layout */}

        {/* Header */}
        <Header/>

        {/* Main Content */}
        <section className='layout_content'>
          {auth._id ? 
            <Outlet />
            :
            <Navigate to="/login"/>
          }
            
        </section>

        {/* Sidebar */}
        <Sidebar />

    </>
  )
}
