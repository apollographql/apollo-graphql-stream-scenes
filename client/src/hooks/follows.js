import { useState, useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";

const FOLLOW_SUBSCRIPTION = gql`
  subscription Follow {
    follow
  }
`;

export default function useFollows() {
  const [follows, setFollows] = useState([]);
  const client = useApolloClient();

  useEffect(() => {
    const observer = client
      .subscribe({ query: FOLLOW_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          const follower = data.follow;
          setFollows([...follows, follower]);
        },
      });

    return () => observer.unsubscribe();
  }, [follows, client]);

  useEffect(() => {
    const timer = setInterval(() => {
      const [, ...rest] = follows;
      setFollows(rest);
    }, 3000);
    return () => clearInterval(timer);
  }, [follows]);

  return follows[0];
}
