// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Global } from "../../helpers/Global";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState('not_sended')

  const saveUser = async (e) => {
    e.preventDefault();

    // get data from form
    let newUser = form;

    // save user
    const request = await fetch(Global.url + "user/register", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await request.json();

    if(data.status === "success"){
      setSaved('saved');
    }else{
      setSaved('error')
    }
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Register</h1>
      </header>

      <div className="content__posts">
        {saved =='saved' ? <strong className="alert alert-success"> User registered succesfull </strong>: ''}
        {saved =='error' ? <strong className="alert alert-danger">Error user not registered</strong>: ''}

        <form action="" className="register-form form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input type="text" name="surname" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed} />
          </div>

          <div className="form-group">
            <input type="submit" value="Sign up" className="btn btn-success" />
          </div>
        </form>
      </div>
    </>
  );
};
