// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import avatar from "../../../assets/img/user.png";
import useAuth from "../../../hooks/useAuth";
import {useForm} from "../../../hooks/useForm";
import { Global } from "../../../helpers/Global";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  const { auth, counter } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");

  const savePost = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    // recoger datos a guardar
    let newPost = form;
    newPost.user = auth._id;
    // hacer el request para guardar
    const request = await fetch(Global.url + "post/createPost", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      }
    });

    const data = await request.json();
    // mostrar mensaje de exito o error
    if (data.status == "success") {
      setStored("stored");
    } else {
      setStored("error");
    }
    // upload image
    const fileInput = document.querySelector("#file");
    if(data.status == 'success' && fileInput.files[0]){
      const formData = new FormData();
      formData.append('file0', fileInput.files[0])

      const uploadRequest = await fetch(Global.url + "post/upload/"+ data.post._id, {
        method: 'POST',
        body: formData,
        headers: {
          "Authorization": token
        }
      })

      const uploadData = await uploadRequest.json();
      console.log(uploadData)
      if (uploadData.status == "success") {
        setStored("stored");
      } else {
        setStored("error");
      }
    }
    // if(data.status == 'success' || uploadData.status == 'success'){
      let myForm = document.querySelector("#formPost");
      myForm.reset();
    // }
  };

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name}</h1>
      </header>

      <div className="aside__container">
        <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              {auth.avatar != "default.png" && (
                <img
                  src={Global.url + "user/avatar/" + auth.avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.avatar == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>

            <div className="general-info__container-names">
              <NavLink to={"profile/"+auth._id} className="container-names__name">
                {auth.name} {auth.surname}
              </NavLink>
              <p className="container-names__nickname">{auth.bio}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <Link to={"following/" + auth._id} className="following__link">
                <span className="following__title">Following</span>
                <span className="following__number">{counter.following}</span>
              </Link>
            </div>
            <div className="stats__following">
              <Link to={"followers/" + auth._id} className="following__link">
                <span className="following__title">Followers</span>
                <span className="following__number">{counter.followed}</span>
              </Link>
            </div>

            <div className="stats__following">
              <NavLink to={"profile/"+auth._id} className="following__link">
                <span className="following__title">Publicaciones</span>
                <span className="following__number">{counter.posts}</span>
              </NavLink>
            </div>
          </div>
        </div>

        <div className="aside__container-form">
          {stored == "stored" ? (
            <strong className="alert alert-success">
              Posted succesfull
            </strong>
          ) : (
            ""
          )}
          {stored == "error" ? (
            <strong className="alert alert-danger">
              Error post not saved
            </strong>
          ) : (
            ""
          )}
          
          <form id="formPost" className="container-form__form-post" onSubmit={savePost} action="">
            <div className="form-post__inputs">
              <label htmlFor="text" className="form-post__label">¿Que estas pesando hoy?</label>
              <textarea name="text" id="text" className="form-post__textarea" onChange={changed}></textarea>
            </div>

            <div className="form-post__inputs">
              <label htmlFor="file" className="form-post__label">
                Sube tu foto
              </label>
              <input
                type="file"
                name="file0"
                id="file"
                className="form-post__image"
              />
            </div>

            <input
              type="submit"
              value="Enviar"
              className="form-post__btn-submit"
            />
          </form>
        </div>
      </div>
    </aside>
  );
};
