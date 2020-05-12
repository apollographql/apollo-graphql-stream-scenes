/** @jsx jsx */
import { jsx } from "@emotion/core";
import { motion, AnimatePresence } from "framer-motion";
import randomcolor from "randomcolor";

import useChatMessages from "../hooks/chat-messages";
import { useState } from "react";

export default function Chat() {
  const [usernameColors, setUsernameColors] = useState({});
  const messages = useChatMessages();

  const getColorForName = ({ displayName, color }) => {
    if (color) {
      return color;
    }

    if (!usernameColors[displayName]) {
      const userColor = randomcolor();
      setUsernameColors({ ...usernameColors, [displayName]: userColor });
      return userColor;
    }

    return usernameColors[displayName];
  };

  return (
    <div
      css={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <ul
        css={{
          height: "100%",
          width: "100%",
          fontSize: "22px",
          wordBreak: "break-word",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          textShadow: "1px 1px rgba(0, 0, 0, 0.5)",
          "@media (min-width: 720px)": {
            fontSize: "28px",
          },
          "@media (min-width: 1080px)": {
            fontSize: "30px",
          },
          "@media (min-width: 1400px)": {
            fontSize: "36px",
          },
          "& .emote": {
            marginLeft: "4px",
            marginRight: "4px",
            "@media (min-width: 720px)": {
              width: "32px",
              height: "32px",
            },
            "@media (min-width: 1080px)": {
              width: "36px",
              height: "36px",
            },
            "@media (min-width: 1400px)": {
              width: "40px",
              height: "40px",
            },
          },
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.li
              css={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "stretch",
                marginBottom: "4px",
              }}
              positionTransition
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={`${message.displayName}-${index}`}
            >
              <span
                css={{
                  paddingRight: "8px",
                  color: getColorForName(message),
                  fontFamily: "Source Sans Pro",
                  fontWeight: "bold",
                  textAlign: "end",
                  width: "35%",
                }}
              >
                {message.displayName}
              </span>
              <span
                css={{
                  display: "inline-block",
                  fontWeight: "bold",
                  fontFamily: "Source Sans Pro",
                  flex: 1,
                }}
              >
                <span
                  css={{ color: "white", display: "flex", flexWrap: "wrap" }}
                  dangerouslySetInnerHTML={{ __html: message.message }}
                />
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
