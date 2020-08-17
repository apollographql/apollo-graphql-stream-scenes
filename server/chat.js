const tmi = require("tmi.js");

const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";
const COMMANDS_MAP = {
  "!uses": "https://theworst.dev/uses",
  "!schedule": "https://go.apollo.dev/events-calendar",
  "!coc": "https://www.apollographql.com/docs/community/code-of-conduct/",
};

const createChatClient = (pubsub) => {
  const client = new tmi.Client({
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: process.env.CHANNEL,
      password: `oauth:${process.env.CHATBOT_TOKEN}`,
    },
    channels: [process.env.CHANNEL],
  });

  client.connect();

  client.on("raided", (_, username, viewers) => {
    pubsub.publish(RAID, { raid: { username, viewers } });
  });

  client.on("message", (channel, tags, message, self) => {
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
    };

    pubsub.publish(CHAT_MESSAGE, { chat: response });

    if (message.match(/^!/)) {
      const commandResult = COMMANDS_MAP[message];

      if (!commandResult) {
        client.say(channel, "Command not found");
        const commandResponse = {
          displayName: "ApolloGraphQL",
          message: "Command not found",
          emotes: [],
        };
        pubsub.publish(CHAT_MESSAGE, { chat: commandResponse });
        return;
      }

      client.say(channel, commandResult);

      const commandResponse = {
        displayName: "ApolloGraphQL",
        message: commandResult,
        emotes: [],
      };

      pubsub.publish(CHAT_MESSAGE, { chat: commandResponse });
    }
  });
};

module.exports = {
  createChatClient,
};
