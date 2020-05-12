/** @jsx jsx */
import { jsx } from "@emotion/core";

import { useEffect, useState, useRef } from "react";
import useSound from "use-sound";
import { motion, AnimatePresence } from "framer-motion";

import useFollows from "../hooks/follows";
import followSound from "../sounds/pixie.mp3";
import followImg from "../images/follow.png";

export default function NewFollowers() {
  const follower = useFollows();
  const [current, setCurrent] = useState(follower);
  const [stale, setStale] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.8);
  const [play] = useSound(followSound, { playbackRate, volume: 0.5 });
  const timeout = useRef();

  useEffect(() => {
    if (current !== follower) {
      clearTimeout(timeout.current);

      setStale(false);
      setCurrent(follower);
      play();
      setPlaybackRate(playbackRate + 0.1);

      timeout.current = setTimeout(() => {
        setStale(true);
        setPlaybackRate(0.8);
      }, 4000);
    }
  }, [follower, current, play, playbackRate, stale, setStale]);

  return (
    <div css={{ width: "100%", height: "100%" }}>
      <AnimatePresence>
        {!stale && current && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 300,
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
      </AnimatePresence>
    </div>
  );
}
