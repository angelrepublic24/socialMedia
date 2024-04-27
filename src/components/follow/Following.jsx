// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList"
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";


export const Following = () => {
  const [users, setUsers] = useState([]);
  const [userProfile, setUserProfile] = useState({})
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState([]);
  const [more, setMore] = useState(true)  

  const params = useParams();

  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);
  let token = localStorage.getItem("token");

  // get userId from url
  const userId = params.userId;

  // request to get users
  const getUsers = async (nextPage = 1) => {
    let request = await fetch(Global.url + "follow/following/"+ userId + "/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const data = await request.json();
    let cleanUsers = []
    // recorrer y limpiar follows para quedarme con following
    data.follows.forEach(follow => {
      cleanUsers = [...cleanUsers, follow.followed]
    })
    data.users = cleanUsers;

    
    if (data.users && data.status == "success") {
      let newUsers = data.users;
      

      if(users.length >= 1){
        newUsers = [...users, ...data.users];
      }
      setUsers(newUsers);
      setFollowing(data.user_following);
    }
    if(users.length >= (data.total - data.users.length)){
      setMore(false);
    }
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">following users by {userProfile.name} {userProfile.surname}</h1>
      </header>

      <UserList users={users} 
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
      />
    </>
  );
};
