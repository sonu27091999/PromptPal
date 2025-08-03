import { useState, useRef } from "react";
import styles from "./UserQueryInput.module.css";
import { SYSTEM_PROMPT } from "../../../utils/systemPrompt.js";
import { useChatApi } from "@/hooks/useChatApi.js";

export default function UserQueryInput({ apiKey, messages, onSave }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const { callGorqAI } = useChatApi();

  const handleInput = (e) => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto"; // Reset
      el.style.height = `${el.scrollHeight}px`; // Resize to content
    }
    setInput(e.target.value);
  };

  const handleSend = async () => {
    try {
      if (!input.trim()) return;
      const updatedMessages = [...messages, { text: input, sender: "user" }];
      // Show "Thinking..." immediately after user's message
      onSave([
        ...updatedMessages,
        { text: "Thinking...", sender: "assistant" },
      ]);
      setInput("");
      const response = await callGorqAI(
        apiKey,
        SYSTEM_PROMPT.replace("{{user_query}}", input)
      );
      if (response.statusCode === 200) {
        onSave([
          ...updatedMessages,
          {
            text: response.aiResponse,
            sender: "assistant",
          },
        ]);
      } else {
        // If status isn't 200, replace with error
        onSave([
          ...updatedMessages,
          { text: "Something went wrong.", sender: "assistant" },
        ]);
      }
    } catch (error) {
      onSave([
        ...messages,
        { text: error.message || "Something went wrong.", sender: "assistant" },
      ]);
    }
  };

  return (
    <div className={styles.inputWrapper}>
      <textarea
        ref={textareaRef}
        className={styles.chatInput}
        type="text"
        placeholder="Ask anything..."
        value={input}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents a new line on Enter without Shift
            handleSend();
          }
        }}
      />
    </div>
  );
}
