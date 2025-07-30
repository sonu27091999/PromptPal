import { useEffect, useState } from "react";
import styles from "./DefaultPopup.module.css";
import { useChromeStorage } from "@/hooks/useChromeStorage";

const DefaultPopup = () => {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");
  const [showKey, setShowKey] = useState(false);
  const {
    getApiKey: getChromStorageApiKey,
    setApiKey: setChromeStorageApiKey,
  } = useChromeStorage();

  useEffect(async () => {
    // Load existing API key on mount
    try {
      const response = await getChromStorageApiKey();
      if (response?.statusCode === 200) {
        setApiKey(response.apiKey);
        setStatus("🔒 Key loaded from storage.");
      }
    } catch (error) {
      setStatus("");
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setStatus("❌ Please enter a valid API key.");
      return;
    }

    try {
      const response = await setChromeStorageApiKey(apiKey);
      if (response.statusCode === 200) {
        setStatus("✅ API key saved successfully!");
      }
    } catch (error) {
      setStatus("❌ API key saved failed!");
    }
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
