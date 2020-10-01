/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useRef, useEffect } from "react";
import useMemes from "../hooks/memes";
import { AnimatePresence, motion } from "framer-motion";

const Memes = () => {
  const meme = useMemes();
  const [current, setCurrent] = useState(meme);
  const [stale, setStale] = useState(false);
  // TODO: add bubble sound on enter 🛁
  // const [playbackRate, setPlaybackRate] = useState(0.8);
  // const [play] = useSound(followSound, { playbackRate, volume: 0.5 });
  const timeout = useRef();

  useEffect(() => {
    if (current !== meme) {
      clearTimeout(timeout.current);

      const image = new Image();
      image.src = meme;
      image.onload = () => {
        setStale(false);
        setCurrent(meme);

        // play();
        // setPlaybackRate(playbackRate + 0.1);

        timeout.current = setTimeout(() => {
          setStale(true);
          // setPlaybackRate(0.8);
        }, 4000);
      };
    }
  }, [meme, current, stale, setStale, setCurrent]);

  return (
    <div
      css={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatePresence>
        {!stale && current && (
          <motion.img
            initial={{ scale: 0, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            src={current}
            css={{ width: 600 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memes;
