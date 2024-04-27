import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import {PublicLayout} from '.../components/layout/public/PublicLayout';
import {Login} from '../components/user/Login';
import {Register} from '../components/user/Register';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Feed } from '../components/post/feed';
import { AuthProvider } from '../context/AuthProvider';
import { Logout } from '../components/user/Logout';
import { People } from '../components/user/People';
import { Config } from '../components/user/Config';
import { Following } from '../components/follow/Following';
import { Followers } from '../components/follow/Followers';
import { Profile } from '../components/user/Profile';



export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path ='/' element={<PublicLayout/>} >
                <Route index element={<Login />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
            </Route>

            <Route path='/social' element={<PrivateLayout/>}>
                <Route index element={<Feed/>} />
                <Route path='feed' element={<Feed/>} />
                <Route path='people' element={<People/>} />
                <Route path='setting' element={<Config/>} />
                <Route path='following/:userId' element={<Following/>} />
                <Route path='followers/:userId' element={<Followers/>} />
                <Route path='profile/:userId' element={<Profile/>} />
                <Route path='logout' element={<Logout/>} />
            </Route>
            <Route path ="*" element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Back to home</Link>
                </p>
                
              </>
            }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
