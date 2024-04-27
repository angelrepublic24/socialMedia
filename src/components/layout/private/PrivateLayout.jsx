import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import useAuth from '../../../hooks/useAuth'

export const PrivateLayout = () => {
  let token = localStorage.getItem('token')
  const {auth} = useAuth();
  return (
    <>
        {/* Layout */}

        {/* Header */}
        <Header/>

        {/* Main Content */}
        <section className='layout_content'>
          {token ? 
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
