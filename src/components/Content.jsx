import React, { useState } from "react";
import styles from "./Content.module.css";

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className={styles.floatingButton} onClick={toggleChat}>
        <span className={styles.label}>Ask AI</span>
      </div>

      {isOpen && (
        <div className={styles.chatBox}>
          <div className={styles.chatHeader}>
            <span>AskAI Assistant</span>
            <button onClick={toggleChat} className={styles.closeBtn}>
              ✕
            </button>
          </div>
          <div className={styles.chatBody}>
            <p>This is a placeholder for AI chat responses.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Content;
