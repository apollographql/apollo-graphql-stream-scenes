const tmi = require("tmi.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "apollographql",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const CHAT_MESSAGE = "CHAT_MESSAGE";
const RAID = "RAID";
const SOUND_PLAYED = "SOUND_PLAYED";
const DISPLAY_MEME = "DISPLAY_MEME";
const COMMANDS_MAP = {
  "!meme": "generateMeme",
  "!uses": "https://theworst.dev/uses",
  "!schedule": "https://go.apollo.dev/events-calendar",
  "!coc": "https://www.apollographql.com/docs/community/code-of-conduct/",
  "!discord": "https://go.apollo.dev/discord",
  "!docs": "https://apollo.dev",
  "!bop": "playSound",
  "!horn": "playSound",
  "!zap": "playSound",
  "!woosh": "playSound",
  "!lp-project":
    "Trevor and Kurt are building a an app to track skate spots with React Native, AWS Amplify, and Apollo Client.\nhttps://github.com/kkemple/spot-check",
  "!music":
    "https://open.spotify.com/playlist/4kAqBBEZQsBIXMIJl6u8tO?si=yTuT421KRbu05kcLIMWYWg",
  "!playlist":
    "https://open.spotify.com/playlist/4kAqBBEZQsBIXMIJl6u8tO?si=yTuT421KRbu05kcLIMWYWg",
  "!commands":
    "Here are all the available commands: !uses, !schedule, !coc, !discord, !docs, !lp-project, !music, !playlist (alias)",
  "--help":
    "Here are all the available commands: !uses, !schedule, !coc, !discord, !docs, !lp-project, !music, !playlist (alias)",
};

const memeMap = {
  tothestars: "IMG_20200302_203929_1_encign.jpg",
  screamcat: "scream-cat_qxh9v9.jpg",
  groinshot: "ezgif-6-b472badd75c7_iteboa.gif",
  hacker: "EruVpaFXMAY2Xfz_hra4qe.jpg",
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
      const [command] = message.split(" ");
      const commandResult = COMMANDS_MAP[command.toLowerCase()];

      if (!commandResult) {
        // client.say(channel, "Command not found");
        // pubsub.publish(CHAT_MESSAGE, {
        //   chat: {
        //     message: "Command not found",
        //     displayName: process.env.CHANNEL,
        //   },
        // });
        return;
      }

      switch (commandResult) {
        case "playSound":
          pubsub.publish(SOUND_PLAYED, {
            sound: message.replace("!", ""),
          });
          break;
        case "generateMeme": {
          const [, template, ...text] = message.split(" ");
          const imageUrl = memeMap[template];

          if (!imageUrl) {
            client.say(
              channel,
              `Invalid meme template! Try these: ${Object.keys(memeMap).join(
                ", "
              )}`
            );
            break;
          }

          const meme = cloudinary.url(imageUrl, {
            transformation: [
              {
                crop: "scale",
                width: 800,
              },
              {
                gravity: "south",
                color: "white",
                y: 80,
                width: 640,
                crop: "fit",
                overlay: {
                  font_family: "Impact",
                  font_size: 48,
                  text: text.join(" ").toUpperCase(),
                },
              },
              {
                gravity: "south_west",
                color: "white",
                y: 5,
                x: 5,
                overlay: {
                  font_family: "Arial",
                  font_size: 20,
                  text: "@ApolloGraphQL",
                },
              },
            ],
          });

          pubsub.publish(DISPLAY_MEME, { meme });
          break;
        }
        default:
          client.say(channel, commandResult);

          await sleep(500);
          pubsub.publish(CHAT_MESSAGE, {
            chat: {
              message: commandResult,
              displayName: "apollobot",
            },
          });
      }
    } else {
      const response = buildResponse(message, tags);
      pubsub.publish(CHAT_MESSAGE, { chat: response });
    }
  });
};

module.exports = {
  createChatClient,
};
