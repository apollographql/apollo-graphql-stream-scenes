/** @jsx jsx */
import { jsx } from "@emotion/core";

import { useEffect, useState } from "react";
import useSound from "use-sound";
import { motion } from "framer-motion";

import useFollows from "../hooks/follows";
import followSound from "../sounds/pixie.mp3";
import followImg from "../images/follow.png";

export default function NewFollowers() {
  const follower = useFollows();
  const [current, setCurrent] = useState(follower);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [play] = useSound(followSound, { playbackRate, volume: 0.5 });

  useEffect(() => {
    if (current !== follower) {
      setCurrent(follower);
      if (follower) {
        setPlaybackRate(playbackRate + 0.1);
        play();
      } else {
        setPlaybackRate(1);
      }
    }
  }, [follower, current, play, playbackRate]);

  return (
    <div css={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {current && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ rotate: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          css={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div css={{ width: "30%" }}>
            <img
              src={followImg}
              css={{ width: "100%", objectFit: "cover" }}
              alt="astronaut illustration"
            />
          </div>
          <div
            css={{
              width: "70%",
              marginLeft: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              css={{
                fontFamily: "Source Sans Pro",
                fontWeight: 600,
                fontSize: "4vw",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 2,
              }}
            >
              New Follower!
            </span>
            <span
              css={{
                fontFamily: "Source Sans Pro",
                fontWeight: 800,
                fontSize: "7vw",
              }}
            >
              {current}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
