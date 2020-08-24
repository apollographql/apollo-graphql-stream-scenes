const tmi = require("tmi.js");

const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";
const COMMANDS_MAP = {
  "!uses": "https://theworst.dev/uses",
  "!schedule": "https://go.apollo.dev/events-calendar",
  "!coc": "https://www.apollographql.com/docs/community/code-of-conduct/",
};

const buildResponse = (message, tags) => {
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

  return {
    emotes,
    message,
    displayName: tags["display-name"],
  };
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

  let commandIssued = false;
  client.on("message", (channel, tags, message, self) => {
    if (commandIssued) {
      const response = buildResponse(message, tags);
      pubsub.publish(CHAT_MESSAGE, { chat: response });
      commandIssued = false;
      return;
    }

    if (self) {
      return;
    }

    const response = buildResponse(message, tags);
    pubsub.publish(CHAT_MESSAGE, { chat: response });

    if (message.match(/^!/)) {
      const commandResult = COMMANDS_MAP[message.toLowerCase()];

      if (!commandResult) {
        client.say(channel, "Command not found");
        commandIssued = true;
        return;
      }

      client.say(channel, commandResult);
      commandIssued = true;
    }
  });
};

module.exports = {
  createChatClient,
};
