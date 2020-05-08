import React from "react";

import SEO from "../components/seo";
import Chat from "../components/chat";

import useHasMounted from "../hooks/mounted";

export default function IndexPage() {
  const mounted = useHasMounted();

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
              paddingLeft: "1.2rem",
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
            {mounted && (
              <div>
                <Chat />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
