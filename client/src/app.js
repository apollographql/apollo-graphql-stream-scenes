import React from "react";
import { Router } from "@reach/router";

import MissionBriefing from "./pages/mission-briefing";

function App() {
  return (
    <Router>
      <MissionBriefing path="/mission-briefing" />
    </Router>
  );
}

export default App;
