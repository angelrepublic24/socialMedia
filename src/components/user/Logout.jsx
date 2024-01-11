import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export const Logout = () => {
    const {setAuth, setCounter} = useAuth()
    const navigate = useNavigate();

    useEffect(() =>{
        // delete localstorage
        localStorage.clear();
        // set states to empty
        setAuth({});
        setCounter({});
        // navigate yo login
        navigate("/login");
    })
  return (
    <div>Logout</div>
  )
}
