import React from "react";
import ReactDOM from "react-dom";
import { Global, css } from "@emotion/core";
import emotionReset from "emotion-reset";
import "typeface-source-sans-pro";
import "typeface-source-code-pro";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/link-ws";

import App from "./app";

const wsLink = new WebSocketLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `wss://${process.env.REACT_APP_SERVER_DOMAIN}/subscriptions`
      : `ws://${process.env.REACT_APP_SERVER_DOMAIN}/subscriptions`,
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri:
    process.env.NODE_ENV === "production"
      ? `https://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`
      : `http://${process.env.REACT_APP_SERVER_DOMAIN}/graphql`,
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  // uri: "https://twitch-events-receiver.onrender.com/",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <Global
      styles={css`
        ${emotionReset}

        *, *::after, *::before {
          box-sizing: border-box;
          -moz-osx-font-smoothing: grayscale;
          -webkit-font-smoothing: antialiased;
          font-smoothing: antialiased;
        }
      `}
    />
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
