import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { GetProfile } from "../../helpers/GetProfile";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PostList } from "../post/PostList";

export const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const params = useParams();
  const [counter, setCounter] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    getDataUser();
    getCounter();
    getPosts(1, true);
  }, []);

  useEffect(() => {
    getDataUser();
    getCounter();
    setMore(true);
    getPosts(1, true);
  }, [params]);

  let token = localStorage.getItem("token");

  const getDataUser = async () => {
    let dataUser = await GetProfile(params.userId, setUser);
    if (dataUser.following && dataUser.following._id) setIFollow(true);
  };
  const getCounter = async () => {
    const request = await fetch(Global.url + "user/counter/" + params.userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();
    if (data.userId) {
      setCounter(data);
    }
  };

  const follow = async (userId) => {
    const request = await fetch(Global.url + "follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();
    if (data.status == "success") {
      setIFollow(true);
    }
  };
  const unfollow = async (userId) => {
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();

    if (data.status == "success") {
      setIFollow(false);
    }
  };

  const getPosts = async (page = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "post/userPost/" + params.userId + "/" + page,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
      }
    );
    const data = await request.json();
    if (data.status == "success") {
      let newPost = data.post;
      if (!newProfile && posts.length >= 1) {
        newPost = [...posts, ...data.post];
      }
      if (newProfile) {
        newPost = data.post;
        setMore(true);
        setPage(1);
      }
      setPosts(newPost);

      if (!newProfile && posts.length >= data.totalPost - data.post.length) {
        setMore(false);
      }
      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };

 

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user.avatar != "default.png" && (
              <img
                src={Global.url + "user/avatar/" + user.avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
            {user.avatar == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="Foto de perfil"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {user.name} {user.surname}
              </h1>
              <p>{user.bio}</p>
              {user._id != auth._id &&
                (iFollow ? (
                  <button
                    className="content__button content__button--right"
                    onClick={() => unfollow(user._id)}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="content__button content__button--right"
                    onClick={() => follow(user._id)}
                  >
                    Follow
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/following/" + user._id}
              className="following__link"
            >
              <span className="following__title">Siguiendo</span>
              <span className="following__number">{counter.following}</span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/followers/" + user._id}
              className="following__link"
            >
              <span className="following__title">Seguidores</span>
              <span className="following__number">{counter.followed}</span>
            </Link>
          </div>

          <div className="stats__following">
            <Link
              to={"/social/profile/" + user._id}
              className="following__link"
            >
              <span className="following__title">Publicaciones</span>
              <span className="following__number">{counter.posts}</span>
            </Link>
          </div>
        </div>
      </header>

      <PostList 
        user={user}
        posts={posts}
        getPosts={getPosts}        
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        
        />

    </>
  );
};
