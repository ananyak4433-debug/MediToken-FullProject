import { useState } from "react";
import styles from "./ChatBot.module.css";

export default function ChatInput({ sendMessage }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage(text);
    setText("");
  };

  return (
    <div className={styles.chatInput}>
      <input
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      <button onClick={handleSend}>
        ➤
      </button>
    </div>
  );
}