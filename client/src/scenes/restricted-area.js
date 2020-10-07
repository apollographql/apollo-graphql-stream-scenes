/** @jsx jsx */
import { jsx } from "@emotion/core";

import canvasBg from "../images/canvas-bg.png";

export default function MissionBriefingScene() {
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
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <h1
          css={{
            fontFamily: "Source Sans Pro",
            fontSize: "7.5rem",
            fontWeight: 800,
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          Restricted Area
        </h1>
      </div>
    </div>
  );
}
