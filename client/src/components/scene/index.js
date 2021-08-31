/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FaTwitch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import canvasBg from "../../images/canvas-bg.png";
import titleBg from "../../images/title-bg.png";
import useChannel from "../../hooks/channel";
import useCurrentViewers from "../../hooks/current-viewer-count";
import useUpcomingStreams from "../../hooks/upcoming-streams";
import { useValue } from "@repeaterjs/react-hooks";

const showOptions = {
  missionBriefing: {
    color: "#7ED9A4",
    title: "MISSION BRIEFING",
  },
  launchPad: {
    color: "#F59140",
    title: "LAUNCH PAD",
  },
  orbit: {
    color: "#7A92F0",
    title: "ORBIT",
  },
};

export default function Scene({ showType }) {
  const channel = useChannel();
  const userCount = useCurrentViewers();
  const upcomingStreams = useUpcomingStreams();

  // use a generator to produce an upcoming stream
  const upcomingStream = useValue(
    async function* (deps) {
      let index = 0;

      // this runs every time `upcomingStreams` value changes
      for await (const [upcomingStreams] of deps) {
        // only do work if we have streams to loop over
        if (upcomingStreams) {
          // filter out the current stream if it's in the list
          const streams = upcomingStreams.filter(
            (stream) => stream.id !== channel?.currentStream?.id
          );

          // infinitly loop over streams like a news ticker
          while (true) {
            // return the next stream in the array
            yield streams[index];

            // update index to next in array or beginning if we're at the end
            index = index === streams.length - 1 ? 0 : index + 1;

            // stream is updated every 10 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));

            // here we return an undefined value so framer-motion can run an exit animation
            yield undefined;

            // there is a 1 second pause between streams
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
    },
    [upcomingStreams]
  );

  return (
    <div
      css={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#311C87",
        backgroundImage: `URL(${canvasBg})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          height: "100%",
        }}
      >
        <div
          css={{
            width: "100%",
            paddingLeft: "2rem",
            paddingRight: "2rem",
            height: "18%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            marginTop: "auto",
            backgroundColor: "#311C87",
            backgroundImage: `URL(${titleBg})`,
            color: "#ffffff",
            borderTop: "5px solid #3F20BA",
          }}
        >
          <div
            css={{
              width: "40%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "stretch",
              paddingTop: ".8rem",
              paddingBottom: ".8rem",
            }}
          >
            <div
              css={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h5
                css={{
                  fontFamily: "Source Sans Pro",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  marginBottom: 4,
                  color: showOptions[showType].color,
                  letterSpacing: ".5rem",
                }}
              >
                {showOptions[showType].title}
              </h5>
              <h1
                css={{
                  fontFamily: "Source Sans Pro",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  marginBottom: 8,
                }}
              >
                {channel?.currentStream
                  ? channel.currentStream.title
                  : "AMA with the Apollo Developer Experience Team"}
              </h1>
              {channel?.currentStream?.streamers.length > 0 && (
                <h2
                  css={{
                    fontFamily: "Source Code Pro",
                    fontWeight: 600,
                    letterSpacing: 1.2,
                    fontSize: 24,
                  }}
                >
                  {channel.currentStream.streamers.join(" / ")}
                </h2>
              )}
            </div>
          </div>
        </div>
        <div
          css={{
            width: "100%",
            paddingTop: 2,
            paddingBottom: 2,
            backgroundColor: "#3F20BA",
            color: "#ffffff",
          }}
        >
          <div
            css={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "2rem",
            }}
          >
            {typeof userCount !== "undefined" && (
              <h5
                css={{
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: "1.2rem",
                  fontFamily: "Source Sans Pro",
                  fontWeight: 700,
                  paddingRight: 8,
                  marginRight: 6,
                  borderRight: "2px solid #311C87",
                }}
              >
                <FaTwitch css={{ marginRight: 4, marginTop: 3 }} /> {userCount}
              </h5>
            )}
            {upcomingStreams ? (
              <div css={{ display: "flex", fontFamily: "Source Sans Pro" }}>
                <span css={{ marginRight: 4, fontWeight: 600 }}>
                  Upcoming Streams:
                </span>
                <AnimatePresence>
                  {upcomingStream && (
                    <motion.h5
                      css={{
                        fontWeight: 600,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {`${upcomingStream.title} - ${upcomingStream.date}, ${upcomingStream.startTime}`}
                    </motion.h5>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
