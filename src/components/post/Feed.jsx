import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PostList } from "./PostList";

export const Feed = () => {
const [user, setUser] = useState({});
  const { auth } = useAuth();
  const params = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    getPosts(1, false);
  }, []);

  const getPosts = async (nextPage = 1, showNews = false) => {

    if(showNews){
        setPosts([])
        setPage(1)
        nextPage = 1
    }

    let token = localStorage.getItem("token");

    const request = await fetch(Global.url + "post/feed/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
    const data = await request.json();
    console.log(data)
    if (data.status == "success") {
      let newPost = data.postDB;
      if (!showNews && posts.length >= 1) {
        newPost = [...posts, ...data.postDB];
      }

      setPosts(newPost);

      if (!showNews && posts.length >= data.totalPost - data.postDB.length) {
        setMore(false);
      }
      if (data.pages <= 1) {
        setMore(false);
      }
    }
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button className="content__button" onClick={()=> getPosts(1, true)}>Mostrar nuevas</button>
      </header>

      <PostList
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
