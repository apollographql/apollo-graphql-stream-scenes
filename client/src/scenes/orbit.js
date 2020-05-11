/** @jsx jsx */
import { jsx } from "@emotion/core";

import bg from "../images/orbit-bg.svg";
import logo from "../images/orbit-logo.svg";

export default function OrbitScene() {
  return (
    <main>
      <div
        css={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#7A92F0",
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
                alignItems: "center",
              }}
            >
              <div>
                <h1
                  css={{
                    fontFamily: "Source Sans Pro",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    marginBottom: 8,
                  }}
                >
                  Latest News - What's New In GraphQL
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
      </div>
    </main>
  );
}
