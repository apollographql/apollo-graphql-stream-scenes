/** @jsx jsx */
import { jsx } from "@emotion/core";

import bg from "../images/apollo-bg.svg";
import restricted from "../images/restricted-area.png";

export default function MissionBriefingScene() {
  return (
    <div
      css={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ffffff",
        backgroundImage: `URL(${bg})`,
        backgroundSize: "100px 100px",
        // backgroundBlendMode: "overlay",
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
        <img
          css={{
            objectFit: "contain",
            marginBottom: "24px",
          }}
          src={restricted}
          alt="restricted area"
        />
        <h1
          css={{
            fontFamily: "Source Sans Pro",
            fontSize: "2.5rem",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Restricted Area
        </h1>
      </div>
    </div>
  );
}
