/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useSound from "use-sound";

import useMemes from "../hooks/memes";
import waterDrop from "../sounds/water-drop.wav";

const IMAGE_WIDTH = 600;
const FRAME_WIDTH = 1920;
const FRAME_HEIGHT = 1080;
const FRAME_PADDING = 20;
const MAX_OFFSET_X = FRAME_WIDTH - IMAGE_WIDTH - FRAME_PADDING * 2;

const Memes = () => {
  const meme = useMemes();
  const [current, setCurrent] = useState(meme);
  const [initialY, setIntialY] = useState(0);
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
        const maxOffsetY = FRAME_HEIGHT - scaledHeight - FRAME_PADDING * 2;

        setStale(false);
        setCurrent(meme);
        setIntialY(Math.random() * maxOffsetY - maxOffsetY / 2);
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
            transition={{ ease: "easeOut" }}
            initial={{
              translateX: Math.random() * MAX_OFFSET_X - MAX_OFFSET_X / 2,
              translateY: initialY + 60,
              opacity: 0.6,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateY: initialY,
            }}
            exit={{
              opacity: 0,
              scale: 0.4,
              translateY: initialY - 400,
            }}
            src={current.url}
            css={{
              width: IMAGE_WIDTH,
              boxShadow: "0 0 80px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Memes;
