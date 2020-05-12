const { gql } = require("apollo-server-express");
const { startOfDay, addWeeks } = require("date-fns");
const axios = require("axios");

const FOLLOW = "FOLLOW";
const SUBSCRIBE = "SUBSCRIBE";
const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";

const typeDefs = gql`
  type Query {
    channel: Channel!
    streams(limit: Int): [Stream!]!
  }

  type Channel {
    id: ID!
    title: String!
    category: String!
    views: Int!
    followers: Int!
    nextStream: Stream
    currentViewers: Int!
  }

  type Stream {
    description: String!
    streamers: [String!]!
  }

  type ChatMessage {
    displayName: String!
    message: String!
    color: String
    emotes: [[String!]!]
  }

  type RaidMessage {
    userName: String!
    viewers: Int!
  }

  type SubscriptionMessage {
    isGift: Boolean!
    userName: String!
    gifterName: String
  }

  type Subscription {
    chat: ChatMessage!
    follow: String!
    sub: SubscriptionMessage!
    raid: RaidMessage!
  }
`;

const createResolvers = (pubsub) => {
  return {
    Query: {
      streams: async (_, { limit = 5 }) => {
        const today = new Date();
        const URL = `https://www.googleapis.com/calendar/v3/calendars/${
          process.env.GOOGLE_CALENDAR_ID
        }/events?key=${
          process.env.GOOGLE_API_KEY
        }&orderBy=startTime&singleEvents=true&timeMin=${today.toISOString()}&maxResults=${limit}`;

        try {
          const { data: events } = await axios.get(URL);

          return events.items;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      channel: async () => {
        const { data: userData } = await axios.get(
          `https://api.twitch.tv/helix/users?login=${process.env.CHANNEL}`,
          {
            headers: {
              authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
              "Client-ID": process.env.CLIENT_ID,
            },
          }
        );

        const { data: channelData } = await axios.get(
          `https://api.twitch.tv/v5/channels/${userData.data[0].id}`,
          {
            headers: {
              authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
              "Client-ID": process.env.CLIENT_ID,
            },
          }
        );

        return {
          id: parseInt(channelData._id, 10),
          title: channelData.status,
          views: channelData.views,
          followers: channelData.followers,
        };
      },
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
      raid: {
        subscribe: () => pubsub.asyncIterator([RAID]),
      },
    },
    Channel: {
      nextStream: async () => {
        const today = new Date();
        const weeksEnd = startOfDay(addWeeks(today, 1));

        const URL = `https://www.googleapis.com/calendar/v3/calendars/${
          process.env.GOOGLE_CALENDAR_ID
        }/events?key=${
          process.env.GOOGLE_API_KEY
        }&orderBy=startTime&singleEvents=true&timeMin=${today.toISOString()}&timeMax=${weeksEnd.toISOString()}&maxResults=1`;

        try {
          const { data: events } = await axios.get(URL);

          const [event] = events.items;
          return event;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
      currentViewers: async ({ id }) => {
        const {
          data: { stream },
        } = await axios.get(`https://api.twitch.tv/v5/streams/${id}`, {
          headers: {
            authorization: `Bearer ${process.env.SUBSCRIPTIONS_TOKEN}`,
            "Client-ID": process.env.CLIENT_ID,
          },
        });

        return stream ? stream.viewers : 0;
      },
    },
    Stream: {
      streamers: async ({ description }) => {
        return description.match(/@\w+/gm);
      },
    },
  };
};

module.exports = {
  typeDefs,
  createResolvers,
};
