import React from 'react'
import { Header } from './Header'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'

export const PublicLayout = () => {
  let token = localStorage.getItem('token')
  const {auth} = useAuth();
  return (
    <>
        {/* Layout */}
        <Header/>

        {/* Main Content */}
        <section className='layout_content'>
          {!token ? 
            <Outlet />
            :
            <Navigate to='/social'/>
          }
            
        </section>

    </>
  )
}
