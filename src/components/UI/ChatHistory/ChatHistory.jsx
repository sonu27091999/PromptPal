import ReactMarkdown from "react-markdown";
import styles from "./ChatHistory.module.css";

export default function ChatHistory({ messages }) {
  return (
    <div className={styles.chatBody}>
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={msg.sender === "user" ? styles.userMsg : styles.aiMsg}
        >
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}
