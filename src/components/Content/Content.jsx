import { useState } from "react";
import styles from "./Content.module.css";

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
  };

  return (
    <>
      {!isOpen && (
        <div className={styles.floatingButton} onClick={() => setIsOpen(true)}>
          <img
            src={chrome.runtime.getURL("icons/icon16.png")}
            alt="Ask AI"
            className={styles.icon}
          />
          <span className={styles.label}>Ask AI</span>
        </div>
      )}

      {isOpen && (
        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <span>AskAI Assistant</span>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.chatBody}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.sender === "user" ? styles.userMsg : styles.aiMsg
                }
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className={styles.inputWrapper}>
            <input
              className={styles.chatInput}
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className={styles.sendBtn} onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
