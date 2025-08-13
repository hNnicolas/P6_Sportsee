import React from "react";
import Chat from "../src/components/Chat";

const ChatPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1>Chat avec Mistral</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
