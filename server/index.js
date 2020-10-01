require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { PubSub } = require("graphql-subscriptions");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs, createResolvers } = require("./graphql");
const { createChatClient } = require("./chat");
const { createWebhooks } = require("./webhooks");

const PORT = 4000;

async function main() {
  const app = express();
  const pubsub = new PubSub();
  const resolvers = createResolvers(pubsub);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    playground: true,
    introspection: true,
  });
  server.applyMiddleware({ app });

  const ws = createServer(app);
  ws.listen(PORT, async () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
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

    createChatClient(pubsub);
    createWebhooks(app, pubsub);
  });
}

main();
