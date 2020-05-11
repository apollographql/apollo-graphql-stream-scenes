/** @jsx jsx */
import { jsx } from "@emotion/core";

import bg from "../images/mission-briefing-bg.svg";
import logo from "../images/mission-briefing-logo.svg";

export default function MissionBriefingScene() {
  return (
    <main>
      <div
        css={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#7ED9A4",
          backgroundImage: `URL(${bg})`,
          backgroundSize: "75px 75px",
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
          <img src={logo} css={{ width: 75 }} alt="Mission Briefing" />
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
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <h1
                css={{
                  fontFamily: "Source Sans Pro",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                }}
              >
                Intro to the Apollo iOS Client - Building My First iOS App
              </h1>
              <h2
                css={{
                  fontFamily: "Source Code Pro",
                  fontWeight: 600,
                  letterSpacing: 1.2,
                  fontSize: 24,
                }}
              >
                @kurtkemple @trevorblades
              </h2>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
