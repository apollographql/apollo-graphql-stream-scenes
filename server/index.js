const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { PubSub } = require("graphql-subscriptions");
const { makeExecutableSchema } = require("graphql-tools");
const tmi = require("tmi.js");

const pubsub = new PubSub();
const PORT = 4000;
const CHAT_MESSAGE = "CHAT_MESSAGE";

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type ChatMessage {
    displayName: String!
    message: String!
    color: String!
  }

  type Subscription {
    chat: ChatMessage
  }
`;

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "theworstdev",
    password: "oauth:gxdloxaa2q2t2e7bcfrwj8354y7wwk",
  },
  channels: ["theworstdev"],
});

client.connect();

client.on("message", (_, tags, message, self) => {
  if (self) return;

  const response = {
    displayName: tags["display-name"],
    message,
    color: tags["color"],
    emotes: tags["emotes"],
  };

  pubsub.publish(CHAT_MESSAGE, { chat: response });
});

const resolvers = {
  Query: {
    hello: () => "Hello",
  },
  Subscription: {
    chat: {
      subscribe: () => pubsub.asyncIterator([CHAT_MESSAGE]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
  playground: true,
  introspection: true,
});
const app = express();
server.applyMiddleware({ app });

const ws = createServer(app);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: makeExecutableSchema({ typeDefs, resolvers }),
    },
    {
      server: ws,
      path: "/subscriptions",
    }
  );
});
