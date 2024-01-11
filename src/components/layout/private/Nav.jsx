import React from "react";
import avatar from "../../../assets/img/user.png"
import useAuth from "../../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { Global } from "../../../helpers/Global";

export const Nav = () => {
  const {auth} = useAuth();
  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="" className="menu-list__link">
            <i className="fa-solid fa-house"></i>
            <span className="menu-list__title">Inicio</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="feed" className="menu-list__link">
            <i className="fa-solid fa-list"></i>
            <span className="menu-list__title">Timeline</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="people" className="menu-list__link">
            <i className="fa-solid fa-user"></i>
            <span className="menu-list__title">Gente</span>
          </NavLink>
        </li>
      </ul>

      <ul className="container-lists__list-end">
        <li className="list-end__item">
          <a href="#" className="list-end__link-image">
            {auth.avatar != 'defaul.png' && <img src={Global.url+"user/avatar/"+auth.avatar} className="list-end__img" alt="Imagen de perfil"/>}
            {auth.avatar == 'defaul.png' && <img src={avatar} className="list-end__img" alt="Imagen de perfil"/>}

            
          </a>
        </li>
        <li className="list-end__item">
          <a href="#" className="list-end__link">
            <span className="list-end__name">{auth.name}</span>
          </a>
        </li>
        <li className="list-end__item">
          <NavLink to="setting" className="list-end__link">
          <i className="fa-solid fa-gear"></i>
            <span className="list-end__name">Setting</span>
          </NavLink>
        </li>
        <li className="list-end__item">
          <NavLink to="logout" className="list-end__link">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="list-end__name">Log Out</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
