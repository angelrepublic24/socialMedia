/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {Global} from "../../helpers/Global"
import {useForm} from "../../hooks/useForm"
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Login = () => {

  const {form, changed} = useForm({});
  const [saved, setSaved] = useState('not_sent')
  const {setAuth} = useAuth();

  const loginUser = async(e) => {
    e.preventDefault();
    let userToLogin = form;

    let request = await fetch(Global.url+'user/login', {
      method: 'POST',
      body: JSON.stringify(userToLogin),
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const data = await request.json();
    if(data.status === 'success') {
      // keep data on the navigation
      localStorage.setItem("token", data.token);
      localStorage.setItem('user', JSON.stringify(data.userDB));
      setSaved('login')

      // set data in the auth
      setAuth(data.userDB)
      window.location.reload();
    }else{
      setSaved('error')
    }
  }


  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Login</h1>
      </header>
      <div className="content__posts">
        <form action="" onSubmit={loginUser} className="form-login">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed}/>
          </div>
          <input type="submit" value="Sign in" className="btn btn-success"/>
          
        </form>
      </div>
    </>
  );
};
