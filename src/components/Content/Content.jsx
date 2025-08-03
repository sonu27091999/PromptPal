import { useState, useEffect, useRef } from "react";
import styles from "./Content.module.css";
import { useChromeStorage } from "@/hooks/useChromeStorage";
import ChatHistory from "../UI/ChatHistory/ChatHistory";
import UserQueryInput from "../UI/UserInput/UserQueryInput";
/*
// Will work in future to bot have main page context.
import { extractPageContext } from "@/utils/getPageContext";
*/

const Content = () => {
  const didMountRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const {
    getApiKey: getChromStorageApiKey,
    getChatByUrl,
    saveChat,
  } = useChromeStorage();

  useEffect(() => {
    if (!didMountRef.current) {
      // First render, don't save yet
      didMountRef.current = true;
      return;
    }
    // Load existing API key + previous urlChats on mount
    const handleChatLoadOrSave = async () => {
      try {
        if (isOpen) {
          const response = await getChromStorageApiKey();
          if (response?.statusCode === 200) {
            setApiKey(response.apiKey);
            const { urlChat } = await getChatByUrl(window.location.href);
            setMessages(urlChat?.messages || []);
          } else {
            setMessages([
              ...messages,
              { text: `${error.statusCode} : ${error}`, sender: "assistant" },
            ]);
          }
        } else {
          await saveChat(window.location.href, messages);
        }
      } catch (error) {
        if (isOpen) {
          setMessages([
            ...messages,
            { text: `${error.statusCode} : ${error}`, sender: "assistant" },
          ]);
        }
      }
    };

    handleChatLoadOrSave();
  }, [isOpen]);

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
