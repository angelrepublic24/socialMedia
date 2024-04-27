import React, {useState, useEffect, createContext } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [counter, setCounter] = useState({})

    useEffect(()=> {
        authUser()
    }, []);
    const authUser = async() => {
        // get data from user identified from local storage
        const token =  localStorage.getItem("token");
        const user =  localStorage.getItem("user");
        // check if i have token and user
        if(!token || !user) {
            return false;
        }
        // transform data to JSON
        const userObj = await JSON.parse(user);
        const userId = await userObj._id;
        // request ajax to backent to check the token and return profile data from user
        const request = await fetch(Global.url+'user/profile/'+userId, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": token
            }
        })

        const data = await request.json();
        

        const requestCounters = await fetch(Global.url+'user/counter/'+userId, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "Authorization": token
            }
        });
        const dataCounter = await requestCounters.json()
        // set state
        setAuth(data.user);
        setCounter(dataCounter);
    }
  return (<AuthContext.Provider 
            value={{
                auth, 
                setAuth,
                counter,
                setCounter
            }}>
    {children}
  </AuthContext.Provider>)
}
 export default AuthContext;