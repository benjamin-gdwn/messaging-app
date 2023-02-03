import React from "react";
import { useEffect, useState } from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { InviteIcon } from "../assets/InviteIcon";
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

const UserItem = ({ user, setSelectedUsers }) => {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    if (selected) {
      setSelectedUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser !== user.id)
      );
    } else {
      setSelectedUsers((prevUsers) => [...prevUsers, user.id]);
    }
    setSelected((prevselected) => !prevselected);
  };
  return (
    <div className="user-item__wrapper" onClick={handleSelect}>
      <div className="user-item__name-wrapper">
        <Avatar image={user.image} name={user.fullName || user.id} size={32} />
        <p className="user-item__name">{user.fullName || user.id}</p>
      </div>
      {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
  );
};

const UserList = ({setSelectedUsers}) => {
  const [users, setUsers] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);
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
        setError(true);
      }
      setIsLoading(false);
    };
    if (client) getUsers();
  }, []);

  if (error) {
    return (
      <div className="user-list__message">
        Error loading, please refresh and try again
      </div>
    );
  }
  if (listEmpty) {
    return <div className="user-list__message">No Users Found</div>;
  }

  const userMap = users.map((user, i) => (
    <UserItem
      setSelectedUsers={setSelectedUsers}
      index={i}
      key={user.id}
      user={user}
    />
  ));

  return (
    <ListContainer>
      {loading ? (
        <div className="user-list__message" > Loading Users... </div>
      ) : (
        userMap
      )}
    </ListContainer>
  );
};

export default UserList;
