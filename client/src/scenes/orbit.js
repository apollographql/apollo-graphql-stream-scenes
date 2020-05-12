/** @jsx jsx */
import { jsx } from "@emotion/core";
import { FaTwitch } from "react-icons/fa";

import bg from "../images/orbit-bg.svg";
import logo from "../images/orbit-logo.svg";
import useChannel from "../hooks/channel";
import useCurrentViewers from "../hooks/current-viewer-count";

export default function OrbitScene() {
  const channel = useChannel();
  const userCount = useCurrentViewers();

  return (
    <main>
      <div
        css={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#7A92F0",
          backgroundImage: `URL(${bg})`,
          backgroundSize: "75px 75px",
          backgroundBlendMode: "overlay",
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
          <img src={logo} css={{ width: 75 }} alt="Orbit" />
          <div
            css={{
              width: "100%",
              paddingLeft: "75px",
              paddingRight: "1.2rem",
              paddingTop: ".8rem",
              paddingBottom: ".8rem",
              height: "15vh",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "space-between",
            }}
          >
            <div
              css={{
                width: "40%",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "stretch",
              }}
            >
              <div
                css={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <h1
                  css={{
                    fontFamily: "Source Sans Pro",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  {channel?.title}
                </h1>
                {channel?.nextStream?.streamers.length > 0 && (
                  <h2
                    css={{
                      fontFamily: "Source Code Pro",
                      fontWeight: 600,
                      letterSpacing: 1.2,
                      fontSize: 24,
                    }}
                  >
                    {channel.nextStream.streamers.join(" / ")}
                  </h2>
                )}
              </div>
              <div
                css={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 16,
                  paddingLeft: 16,
                  // borderLeft: "1px solid black",
                  marginTop: 48,
                  marginBottom: 48,
                }}
              >
                {typeof userCount !== "undefined" && (
                  <h3
                    css={{
                      display: "flex",
                      alignItems: "flex-start",
                      fontSize: "2rem",
                      fontFamily: "Source Sans Pro",
                      fontWeight: 700,
                    }}
                  >
                    <FaTwitch css={{ marginRight: 8, marginTop: 3 }} />{" "}
                    {userCount}
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
