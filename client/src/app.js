/** @jsx jsx */
import { jsx } from "@emotion/core";
import { Router } from "@reach/router";

import RestrictedArea from "./scenes/restricted-area";
import Brb from "./scenes/brb";
import Starting from "./scenes/starting";
import Chat from "./overlays/chat";
import Follows from "./overlays/follows";
import Memes from "./overlays/memes";
import Sounds from "./overlays/sounds";
import SceneTemplate from "./components/scene";

function App() {
  return (
    <Router css={{ width: "100vw", height: "100vh" }}>
      <SceneTemplate path="/mission-briefing" showType="missionBriefing" />
      <SceneTemplate path="/launch-pad" showType="launchPad" />
      <SceneTemplate path="/orbit" showType="orbit" />
      <RestrictedArea path="/restricted-area" />
      <Brb path="/brb" />
      <Starting path="/starting" />
      <Chat path="/chat" />
      <Follows path="/follows" />
      <Memes path="/memes" />
      <Sounds path="/sounds" />
    </Router>
  );
}

export default App;
