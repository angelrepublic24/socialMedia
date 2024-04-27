/* eslint-disable react/prop-types */
import React from "react";
import { Global } from "../../helpers/Global";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import ReactTimeAgo from "react-time-ago";



export const PostList = ({
  posts,
  getPosts,
  page,
  setPage,
  more,
  setMore,
}) => {
  const { auth } = useAuth();

  let token = localStorage.getItem("token");
  const nextPage = () => {
    let next = page + 1;

    setPage(next);
    getPosts(next);
  };
  const deletePost = async (postId) => {
    const request = await fetch(Global.url + "post/removeOnePost/" + postId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    if (data.status == "success") {
      setPage(1);
      setMore(true);
      getPosts(1, true);
    }
  };
  return (
    <>
      <div className="content__posts">
        {posts.map((post) => {
          return (
            <article className="posts__post" key={post._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/profile/" + post.user._id}
                    className="post__image-link"
                  >
                    {post.user.avatar != "default.png" && (
                      <img
                        src={Global.url + "user/avatar/" + post.user.avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {post.user.avatar == "default.png" && (
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
                    <a href="#" className="user-info__name">
                      {post.user.name + " " + post.user.surname}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date">
                      <ReactTimeAgo date={post.create_at} locale="en"/>
                    </a>
                  </div>

                  <h4 className="post__content">{post.text}</h4>
                  <img src={Global.url + "post/media/" + post.file} alt="" />
                </div>
              </div>

              {auth._id == post.user._id && (
                <div className="post__buttons">
                  <button
                    onClick={() => deletePost(post._id)}
                    className="post__button"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        </div>
      )}
    </>
  );
};
