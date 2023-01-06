import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt"),
      limit(2)
    );
    const myTweets = await getDocs(q);
    myTweets.forEach((document) => {
      const tweetObject = { ...document.data(), id: document.id };
      console.log(document.data());
    });
  };

  useEffect(() => {
    getMyTweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    console.log("userObj.displayName=" + userObj.displayName);
    console.log("newDisplayName=" + newDisplayName);
    if (userObj.displayName !== newDisplayName) {
      updateProfile(authService.currentUser, { displayName: newDisplayName })
        .then(() => {
          refreshUser();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
export default Profile;
