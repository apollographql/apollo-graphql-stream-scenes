/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";

import useMemes from "../hooks/memes";
import waterDrop from "../sounds/water-drop.wav";

const Memes = () => {
  const meme = useMemes();
  const [current, setCurrent] = useState(meme);
  const [stale, setStale] = useState(false);
  // TODO: add bubble sound on enter 🛁
  const [play] = useSound(waterDrop);
  const timeout = useRef();

  useEffect(() => {
    if (current !== meme) {
      clearTimeout(timeout.current);

      const image = new Image();
      image.src = meme.url;
      image.onload = () => {
        setStale(false);
        setCurrent(meme);
        play();

        timeout.current = setTimeout(() => {
          setStale(true);
        }, 4000);
      };
    }
  }, [meme, current, stale, setStale, setCurrent, play]);

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
            src={current.url}
            css={{ width: 600 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memes;
