// udpate oauth keys, make env vars
// make route for orbit
// make callback urls env vars
// make client connection url an env var
require("dotenv").config();

const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { execute, subscribe } = require("graphql");
const { createServer } = require("http");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { PubSub } = require("graphql-subscriptions");
const { makeExecutableSchema } = require("graphql-tools");
const tmi = require("tmi.js");
const axios = require("axios");
const bodyParser = require("body-parser");

const PORT = 4000;
const CHAT_MESSAGE = "CHAT_MESSAGE";
const FOLLOW = "FOLLOW";
const SUBSCRIBE = "SUBSCRIBE";

const typeDefs = gql`
  type Query {
    hello: String!
  }

  type ChatMessage {
    displayName: String!
    message: String!
    color: String!
    emotes: [[String!]]
  }

  type SubscriptionMessage {
    isGift: Boolean!
    userName: String!
    gifterName: String
  }

  type Subscription {
    chat: ChatMessage
    follow: String!
    sub: SubscriptionMessage
  }
`;

async function main() {
  const pubsub = new PubSub();
  const app = express();
  const jsonParser = bodyParser.json();

  const resolvers = {
    Query: {
      hello: () => "Hello",
    },
    Subscription: {
      chat: {
        subscribe: () => pubsub.asyncIterator([CHAT_MESSAGE]),
      },
      follow: {
        subscribe: () => pubsub.asyncIterator([FOLLOW]),
      },
      sub: {
        subscribe: () => pubsub.asyncIterator([SUBSCRIBE]),
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

  // process.env.CHATBOT_TOKEN
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: "theworstdev",
      password: `oauth:${process.env.CHATBOT_TOKEN}`,
    },
    channels: [process.env.CHATBOT_CHANNEL],
  });

  client.connect();

  client.on("message", (_, tags, message, self) => {
    if (self) return;
    let emotes = null;

    const emoteObj = tags["emotes"];

    if (emoteObj) {
      emotes = Object.keys(emoteObj).reduce((arr, emoteCode) => {
        const instances = emoteObj[emoteCode];

        const codesWithStartEnd = instances.map((instance) => {
          const [start, end] = instance.split("-");

          return [emoteCode, start, end];
        });

        return [...arr, ...codesWithStartEnd];
      }, []);
    }

    const response = {
      emotes,
      message,
      displayName: tags["display-name"],
      color: tags["color"] || "#A23DF5",
    };

    pubsub.publish(CHAT_MESSAGE, { chat: response });
  });

  server.applyMiddleware({ app });

  app.get("/webhooks/follows", async (req, res) => {
    res.status(200).send(req.query["hub.challenge"]);
  });

  app.post("/webhooks/follows", jsonParser, async (req, res) => {
    // handle twitch webhooks here
    const follow = req.body.data[0].from_name;
    console.log({ follow });
    pubsub.publish(FOLLOW, { follow });
    res.status(200).end();
  });

  app.get("/webhooks/subscriptions", async (req, res) => {
    res.status(200).send(req.query["hub.challenge"]);
  });

  app.post("/webhooks/subscriptions", jsonParser, async (req, res) => {
    // handle twitch webhooks here
    const eventData = req.body.data[0].event_data;
    pubsub.publish(SUBSCRIBE, {
      isGift: eventData.is_gift,
      userName: eventData.user_name,
      gifterName: eventData.gifter_name,
    });
    res.status(200).end();
  });

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

    try {
      const { data: userData } = await axios.get(
        "https://api.twitch.tv/helix/users?login=pokimane",
        {
          headers: {
            authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
          },
        }
      );

      const followersTopic = `https://api.twitch.tv/helix/users/follows?to_id=${userData.data[0].id}&first=1`;
      const subscribersTopic = `https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=${userData.data[0].id}7&first=1`;

      await axios.post(
        "https://api.twitch.tv/helix/webhooks/hub",
        {
          "hub.callback": `${process.env.CALLBACK_URL}/webhooks/follows`,
          "hub.mode": "subscribe",
          "hub.topic": followersTopic,
          "hub.lease_seconds": 60 * 60 * 4,
        },
        {
          headers: {
            authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
          },
        }
      );

      await axios.post(
        "https://api.twitch.tv/helix/webhooks/hub",
        {
          "hub.callback": `${process.env.CALLBACK_URL}/webhooks/subscriptions`,
          "hub.mode": "subscribe",
          "hub.topic": subscribersTopic,
          "hub.lease_seconds": 60 * 60 * 4,
        },
        {
          headers: {
            authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
}

main();
