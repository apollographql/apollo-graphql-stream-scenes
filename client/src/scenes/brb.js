/** @jsx jsx */
import { jsx } from "@emotion/core";
import { motion, AnimatePresence } from "framer-motion";

import canvasBg from "../images/canvas-bg.png";
import useChannel from "../hooks/channel";
import useUpcomingStreams from "../hooks/upcoming-streams";
import { useValue } from "@repeaterjs/react-hooks";

export default function MissionBriefingScene() {
  const channel = useChannel();
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
            height: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div
            css={{
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
                color: "#ffffff",
              }}
            >
              <h1
                css={{
                  fontFamily: "Source Sans Pro",
                  fontSize: "7.5rem",
                  fontWeight: 800,
                  marginBottom: 32,
                  textTransform: "uppercase",
                }}
              >
                Be Right Back.
              </h1>
              {upcomingStreams ? (
                <div
                  css={{
                    fontSize: "2.5rem",
                    fontFamily: "Source Sans Pro",
                  }}
                >
                  <h4
                    css={{ marginBottom: 8, paddingLeft: 8, fontWeight: 600 }}
                  >
                    Upcoming Streams:
                  </h4>
                  <div css={{ paddingLeft: 8, minHeight: 80 }}>
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
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
