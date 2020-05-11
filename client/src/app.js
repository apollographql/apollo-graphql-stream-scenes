/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Router } from "@reach/router";

import MissionBriefing from "./scenes/mission-briefing";
import Orbit from "./scenes/orbit";
import Chat from "./overlays/chat";
import Follows from "./overlays/new-follows";

function App() {
  return (
    <Router css={{ width: "100vw", height: "100vh" }}>
      <MissionBriefing path="/mission-briefing" />
      <Orbit path="/orbit" />
      <Chat path="/chat" />
      <Follows path="/follows" />
    </Router>
  );
}

export default App;
