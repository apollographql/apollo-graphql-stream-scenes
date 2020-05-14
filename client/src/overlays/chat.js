/** @jsx jsx */
import { jsx } from "@emotion/core";

import Chat from "../components/chat";

export default function ChatOverlay() {
  return (
    <div
      css={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Chat />
    </div>
  );
}
