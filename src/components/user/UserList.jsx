/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";


export const UserList = ({
  users,
  getUsers,
  following,
  setFollowing,
  page,
  setPage,
  more,
}) => {
  const { auth } = useAuth();

  let token = localStorage.getItem("token");
  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getUsers(next);
    console.log(following);
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
    console.log(data);
    if (data.status == "success") {
      setFollowing([...following, userId]);
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
      let filterFollowing = following.filter(
        (following_userId) => userId !== following_userId
      );

      setFollowing(filterFollowing);
    }
  };
  return (
    <>
      <div className="content__posts">
        {users.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link to={"/social/profile/"+user._id} className="post__image-link">
                    {user.avatar != "default.png" && (
                      <img
                        src={Global.url + "user/avatar/" + user.avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.avatar == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link to={"/social/profile/"+user._id} className="user-info__name">
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link to={"/social/profile/"+user._id} className="user-info__create-date">
                    <ReactTimeAgo date={user.create_at} locale="en"/>
                    </Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              {user._id != auth._id && (
                <div className="post__buttons">
                  {!following.includes(user._id) && (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Follow
                    </button>
                  )}
                  {following.includes(user._id) && (
                    <button
                      className="post__button"
                      onClick={() => unfollow(user._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            See more people
          </button>
        </div>
      )}
    </>
  );
};
