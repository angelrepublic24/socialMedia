// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";


export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState([]);
  const [more, setMore] = useState(true)  

  useEffect(() => {
    getUsers(1);
  }, []);
  let token = localStorage.getItem("token");

  const getUsers = async (nextPage = 1) => {
    let request = await fetch(Global.url + "user/listUser/"+ nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });

    const data = await request.json();

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
        <h1 className="content__title">People</h1>
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
