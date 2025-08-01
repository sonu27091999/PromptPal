import { useState, useEffect } from "react";
import styles from "./Content.module.css";
import { useChromeStorage } from "@/hooks/useChromeStorage";
import ChatHistory from "../UI/ChatHistory/ChatHistory";
import UserQueryInput from "../UI/UserInput/UserQueryInput";
/*
// Will work in future to bot have main page context.
import { extractPageContext } from "@/utils/getPageContext";
*/

const Content = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const { getApiKey: getChromStorageApiKey } = useChromeStorage();

  useEffect(async () => {
    // Load existing API key on mount
    try {
      const response = await getChromStorageApiKey();
      if (response?.statusCode === 200) {
        setApiKey(response.apiKey);
      } else {
        setMessages([
          ...messages,
          { text: `${error.statusCode} : ${error}`, sender: "assistant" },
        ]);
      }
    } catch (error) {
      setMessages([
        ...messages,
        { text: `${error.statusCode} : ${error}`, sender: "assistant" },
      ]);
    }
  }, []);

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

          <ChatHistory messages={messages} />
          <UserQueryInput
            apiKey={apiKey}
            messages={messages}
            onSave={setMessages}
          />
        </div>
      )}
    </>
  );
};

export default Content;
