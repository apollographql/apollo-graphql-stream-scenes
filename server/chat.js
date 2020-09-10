const tmi = require("tmi.js");

const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";
const COMMANDS_MAP = {
  "!uses": "https://theworst.dev/uses",
  "!schedule": "https://go.apollo.dev/events-calendar",
  "!coc": "https://www.apollographql.com/docs/community/code-of-conduct/",
  "!discord": "https://go.apollo.dev/discord",
  "!docs": "https://apollo.dev",
  "!lp-project":
    "Trevor and Kurt are building Jam Spam! A collaborative sound board app built with GatsbyJS, Apollo Client, and Apollo Server. Some things they'll cover are subscriptions, fragments, and the useSound hook.\nhttps://github.com/kkemple/jamspam",
  "!music":
    "https://open.spotify.com/playlist/4kAqBBEZQsBIXMIJl6u8tO?si=yTuT421KRbu05kcLIMWYWg",
  "!playlist":
    "https://open.spotify.com/playlist/4kAqBBEZQsBIXMIJl6u8tO?si=yTuT421KRbu05kcLIMWYWg",
  "!commands":
    "!uses, !schedule, !coc, !discord, !docs, !lp-project, !music, !playlist (alias)",
  "--help":
    "!uses, !schedule, !coc, !discord, !docs, !lp-project, !music, !playlist (alias)",
};

const sleep = (time) => new Promise((res) => setTimeout(res, time));

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

  client.on("message", async (channel, tags, message, self) => {
    if (self) {
      return;
    }

    const response = buildResponse(message, tags);
    pubsub.publish(CHAT_MESSAGE, { chat: response });

    if (message.match(/^(!|--)/)) {
      const commandResult = COMMANDS_MAP[message.toLowerCase()];

      if (!commandResult) {
        client.say(channel, "Command not found");
        pubsub.publish(CHAT_MESSAGE, {
          chat: {
            message: "Command not found",
            displayName: process.env.CHANNEL,
          },
        });
        return;
      }

      client.say(channel, commandResult);
      await sleep(500);
      pubsub.publish(CHAT_MESSAGE, {
        chat: {
          message: commandResult,
          displayName: process.env.CHANNEL,
        },
      });
    } else {
      const response = buildResponse(message, tags);
      pubsub.publish(CHAT_MESSAGE, { chat: response });
    }
  });
};

module.exports = {
  createChatClient,
};
