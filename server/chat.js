const tmi = require("tmi.js");

const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";

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
      client.say(channel, "Command found");

      const commandResponse = {
        displayName: "ApolloGraphQL",
        message: "Command Found",
        emotes: [],
      };

      pubsub.publish(CHAT_MESSAGE, { chat: commandResponse });
    }
  });
};

module.exports = {
  createChatClient,
};
