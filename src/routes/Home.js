import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";
import { dbService } from "fbase";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    onSnapshot(collection(dbService, "tweets"), (snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObj={userObj} />
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
