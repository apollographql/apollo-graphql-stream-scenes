import React, { useState, useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";

const CHAT_SUBSCRIPTION = gql`
  subscription Chat {
    chat {
      displayName
      message
      color
    }
  }
`;

const parseEmotes = (emotes) => {
  const emotesArray = Object.keys(emotes).map((key) => emotes[key]);
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const client = useApolloClient();

  useEffect(() => {
    const observer = client.subscribe({ query: CHAT_SUBSCRIPTION }).subscribe({
      next: ({ data }) => {
        setMessages([data.chat, ...messages]);
      },
    });

    return () => observer.unsubscribe();
  }, [messages, client]);

  return (
    <ul
      css={{
        height: "100%",
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "stretch",
        fontSize: "1.5rem",
        overflow: "hidden",
      }}
    >
      {messages.map((message, index) => (
        <li
          css={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "stretch",
            marginBottom: "4px",
          }}
          key={`${message.message}-${index}`}
        >
          <span
            css={{
              paddingRight: "8px",
              color: message.color,
              fontFamily: "Source Sans Pro",
              fontWeight: "bold",
              textAlign: "end",
            }}
          >
            {message.displayName}
          </span>
          <span
            css={{
              color: "white",
              fontWeight: "bold",
              fontFamily: "Source Sans Pro",
            }}
          >
            {message.message}
          </span>
        </li>
      ))}
    </ul>
  );
}
