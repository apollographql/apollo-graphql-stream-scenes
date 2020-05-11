import { useState, useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";

const SUBSCRIBER_SUBSCRIPTION = gql`
  subscription Sub {
    sub {
      isGift
      userName
      gifterName
    }
  }
`;

export default function useChatMessages() {
  const [subs, setSubs] = useState([]);
  const client = useApolloClient();

  useEffect(() => {
    const observer = client
      .subscribe({ query: SUBSCRIBER_SUBSCRIPTION })
      .subscribe({
        next: ({ data }) => {
          setSubs([...subs, data.sub]);
        },
      });

    return () => observer.unsubscribe();
  }, [subs, client]);

  return subs;
}
