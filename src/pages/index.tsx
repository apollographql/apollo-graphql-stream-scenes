/** @jsx jsx */
import { jsx } from "@emotion/core";

import SEO from "../components/seo";

export default function IndexPage() {
  return (
    <main>
      <SEO />
      <div
        css={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#7ED9A4",
          backgroundImage: `URL("/mission-briefing-bg.svg")`,
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
          <img
            src="/mission-briefing-logo.svg"
            css={{ height: 400 }}
            alt="Mission Briefing"
          />
          <div
            css={{
              width: "100%",
              border: "1px solid red",
              padding: "1.2rem",
              height: "15vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h1
              css={{
                fontFamily: "Source Sans Pro",
                fontSize: "2rem",
                fontWeight: 800,
              }}
            >
              Intro to the Apollo iOS Client
            </h1>
          </div>
        </div>
      </div>
    </main>
  );
}
