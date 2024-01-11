import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import { Serialize } from "../../helpers/Serialize";

export const Config = () => {

    const {auth, setAuth} = useAuth();
    const [saved, setSaved] = useState('not_saved');

    const updateUser = async(e) => {
        e.preventDefault();
        let newDataUser = Serialize(e.target);

        const request = await fetch(Global.url+"user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        })

        const data = await request.json();
        console.log(data)
        if(data.status === "success") {
            setSaved("saved")
            setAuth(data.user)
        }else{
            setSaved("error")
        }
        
    }
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Settings</h1>
      </header>
      <div className="content__posts">
        {saved =="saved" ?  <strong className="alert alert-success">User updated successful</strong> : ""}
        {saved =="error" ?  <strong className="alert alert-danger">Error updating user</strong> : ""}

      <form action="" className="config-form form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" name="name" defaultValue={auth.name}/>
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            <input type="text" name="surname" defaultValue={auth.surname}/>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <input type="text" name="bio" defaultValue={auth.bio}/>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" defaultValue={auth.email}/>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password"/>
          </div>
          <div className="form-group">
            <label htmlFor="file0">Avatar</label>
            <div className="general-info__container-avatar">
                {auth.avatar != "defaul.png" && <img src={Global.url + "user/avatar/"+ auth.avatar} className="container-avatar__img" alt="Foto de perfil"/>}
                {auth.avatar == "defaul.png" && <img src={avatar} className="container-avatar__img" alt="Foto de perfil"/>}
            </div>
            <br/>
            <input type="file" name="file0" id="file0"/>
          </div>
          <br/>
          <div className="form-group">
            <input type="submit" value="Sign up" className="btn btn-success" />
          </div>
          
        </form>
      </div>
    
    </>
  );
};
