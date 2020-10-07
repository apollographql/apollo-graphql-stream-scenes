/** @jsx jsx */
import { jsx } from "@emotion/core";
import { motion, AnimatePresence } from "framer-motion";
import randomcolor from "randomcolor";

import useChatMessages from "../hooks/chat-messages";

export default function Chat() {
  const messages = useChatMessages();

  return (
    <ul
      css={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        textShadow: "1px 1px rgba(0, 0, 0, 0.5)",
        fontSize: 20,
        "& .emote": {
          marginLeft: "4px",
          marginRight: "4px",
        },
        "& .emote + .emote": {
          marginLeft: 0,
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
                color: randomcolor({
                  hue: "#00FFFF",
                  seed: message.displayName,
                }),
                fontFamily: "Source Sans Pro",
                fontWeight: "bold",
                textAlign: "end",
                width: "40%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {message.displayName}
            </span>
            <span
              css={{
                display: "inline-block",
                fontWeight: "bold",
                fontFamily: "Source Sans Pro",
                width: "65%",
                wordBreak: "break-word",
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
  );
}
