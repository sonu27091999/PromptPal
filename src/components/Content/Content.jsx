import { useState, useEffect } from "react";
import styles from "./Content.module.css";
import { useChromeStorage } from "@/hooks/useChromeStorage";
import { useChatApi } from "../../hooks/useChatApi";

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { getApiKey: getChromStorageApiKey } = useChromeStorage();
  const { callGorqAI } = useChatApi();

  useEffect(async () => {
    // Load existing API key on mount
    try {
      const response = await getChromStorageApiKey();
      if (response?.statusCode === 200) {
        setApiKey(response.apiKey);
      }
    } catch (error) {
      setMessages([
        ...messages,
        { text: "Invalid Api key.", sender: "assistant" },
      ]);
    }
  }, []);

  const handleSend = async () => {
    try {
      if (!input.trim()) return;
      setMessages([...messages, { text: input, sender: "user" }]);
      const response = await callGorqAI(apiKey, input);
      console.log(response);
      if (response.statusCode === 200) {
        setMessages([
          ...messages,
          {
            text: response.aiResponse,
            sender: "assistant",
          },
        ]);
        setInput("");
      }
    } catch (error) {
      setMessages([...messages, { text: error.message, sender: "assistant" }]);
    }
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
