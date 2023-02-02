import React from "react";
import { useEffect, useState } from "react";
import { Avatar, useChatChannel, useChatContext } from "stream-chat-react";
//

const ListContainer = ({ children }) => {
  return (
    <div className="user-list__container">
      <div className="user-list__header">
        <p>User</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  );
};

const UserItem = ({ user }) => {
  return (
    <div className="user-item__wrapper">
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName} size={32} />
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState(['a', 'b', 'c']);
  const [loading, setIsLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const { client } = useChatContext();
  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setIsLoading(true);

      try {
        const response = await client.queryUsers(
          {
            id: { $ne: client.userID },
          },
          {
            id: 1,
          },
          {
            limit: 8,
          }
        );
        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (client) getUsers();
  }, []);

  const userMap = users.map((user, i) => (
    <UserItem index={i} key={user.id} user={user}  />  
  ))


  return (
    <ListContainer>
      {loading ? 
        <div className="user-list__message"> Loading Users... </div>
       : userMap}
    </ListContainer>
  );
};

export default UserList;
