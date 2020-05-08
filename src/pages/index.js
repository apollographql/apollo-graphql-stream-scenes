import React, { useEffect, useState } from "react";
import { gql, useApolloClient } from "@apollo/client";

import SEO from "../components/seo";

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

export default function IndexPage() {
  const [messages, setMessages] = useState([]);
  const client = useApolloClient();

  useEffect(() => {
    const observer = client.subscribe({ query: CHAT_SUBSCRIPTION }).subscribe({
      next: ({ data }) => {
        setMessages([data.chat, ...messages]);
      },
    });

    return () => observer.unsubscribe();
  }, [messages]);

  console.log(messages);

  return (
    <main>
      <SEO />
      <div
        css={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#7ED9A4",
          backgroundImage: `URL("/mission-briefing-bg.svg")`,
          backgroundSize: "75px 75px",
        }}
      >
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: "100%",
          }}
        >
          <img
            src="/mission-briefing-logo.svg"
            css={{ height: 400 }}
            alt="Mission Briefing"
          />
          <div
            css={{
              width: "100%",
              paddingLeft: "1.2rem",
              paddingRight: "1.2rem",
              paddingTop: ".8rem",
              paddingBottom: ".8rem",
              height: "15vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              css={{
                fontFamily: "Source Sans Pro",
                fontSize: "2.5rem",
                fontWeight: 800,
              }}
            >
              Powered by Gatsby and Twitch
            </h1>
            <ul
              css={{
                height: "100%",
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "stretch",
                maxWidth: "35vw",
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
          </div>
        </div>
      </div>
    </main>
  );
}
