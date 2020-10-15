/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";

import useMemes from "../hooks/memes";
import waterDrop from "../sounds/water-drop.wav";

const IMAGE_WIDTH = 600;
const FRAME_HEIGHT = 1080;
const FRAME_PADDING = 20;

const Memes = () => {
  const meme = useMemes();
  const [current, setCurrent] = useState(meme);
  const [maxOffsetY, setMaxOffsetY] = useState(null);
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
        const scale = IMAGE_WIDTH / image.width; // 600 / 800 = 0.75
        const scaledHeight = image.height * scale;

        setStale(false);
        setCurrent(meme);
        setMaxOffsetY(FRAME_HEIGHT - scaledHeight - FRAME_PADDING * 2);
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
            initial={{
              scale: 0,
              translateX: 480,
              translateY: maxOffsetY / 2,
              opacity: 0,
            }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            src={current.url}
            css={{ width: IMAGE_WIDTH }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memes;
