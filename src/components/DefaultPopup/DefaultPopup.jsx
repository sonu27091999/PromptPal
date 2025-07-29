import { useEffect, useState } from "react";
import styles from "./DefaultPopup.module.css";

const DefaultPopup = () => {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load existing API key on mount
    chrome.storage.local.get(["openai_api_key"], (result) => {
      if (result.openai_api_key) {
        setApiKey(result.openai_api_key);
        setStatus("🔒 Key loaded from storage.");
      }
    });
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setStatus("❌ Please enter a valid API key.");
      return;
    }

    chrome.storage.local.set({ openai_api_key: apiKey }, () => {
      setStatus("✅ API key saved successfully!");
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        <span role="img" aria-label="lock">
          🔐
        </span>{" "}
        PromptPal Setup
      </h1>

      <label className={styles.label} htmlFor="apiKey">
        OpenAI API Key
      </label>

      <div className={styles.inputWrapper}>
        <input
          id="apiKey"
          type={showKey ? "text" : "password"}
          className={styles.input}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
        />
        <button
          className={styles.toggle}
          onClick={() => setShowKey((prev) => !prev)}
          aria-label="Toggle key visibility"
        >
          {showKey ? "🙈" : "👁️"}
        </button>
      </div>

      <button className={styles.button} onClick={handleSave}>
        Save Key
      </button>

      {status && <p className={styles.status}>{status}</p>}
    </div>
  );
};

export default DefaultPopup;
