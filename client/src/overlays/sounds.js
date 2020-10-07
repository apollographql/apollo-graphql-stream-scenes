/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useEffect } from "react";
import useSound from "use-sound";

import soundSprite from "../sounds/sprite.m4a";
import useSoundCommands from "../hooks/sounds";

const durations = {
  zap: 1804,
  woosh: 426,
  horn: 648, // shoutout @Talk2MeGooseman
  bop: 177,
};

const sprite = Object.entries(durations).reduce(
  (acc, [key, duration], index, array) => ({
    ...acc,
    [key]: [
      array.slice(0, index).reduce((total, item) => total + item[1], 0),
      duration,
    ],
  }),
  // need to supply a default key to prevent this issue:
  // https://github.com/goldfire/howler.js/issues/851
  { __default: [0, 0] }
);

export default function ChatOverlay() {
  const [play] = useSound(soundSprite, { sprite });
  const sound = useSoundCommands();

  useEffect(() => {
    if (sound) {
      play({ id: sound.id });
    }
  }, [sound, play]);

  return <div />;
}
