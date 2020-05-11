/** @jsx jsx */
import { jsx } from "@emotion/core";

import Chat from "../../components/chat";
import bg from "./mission-briefing-bg.svg";
import logo from "./mission-briefing-logo.svg";

export default function IndexPage() {
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
          <img src={logo} css={{ height: 400 }} alt="Mission Briefing" />
          <div
            css={{
              width: "100%",
              paddingLeft: "75px",
              paddingRight: "1.2rem",
              paddingTop: ".8rem",
              paddingBottom: ".8rem",
              height: "15vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              css={{
                fontFamily: "Source Sans Pro",
                fontSize: "2.5rem",
                fontWeight: 800,
              }}
            >
              Powered by Gatsby and Twitch
            </h1>
            <Chat />
          </div>
        </div>
      </div>
    </main>
  );
}
