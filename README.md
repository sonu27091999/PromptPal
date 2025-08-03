## 🔥 PromptPal Chrome Extension

> A powerful and lightweight AI-powered assistant embedded directly into any website. AskAI is built using **React + Vite**, powered by **GROQ API**, and leverages **Chrome Storage** and **IndexedDB** for persistent, context-aware conversations.

---

### 🚀 Features

* ⚛️ **Modern Frontend Stack**: Built with React and Vite for a blazing-fast and efficient development experience.
* 🔐 **Secure API Integration**: User provides their own **GROQ API Key** via the extension popup, which is securely stored using Chrome's `local` storage.
* 💬 **On-Page Chat Widget**: Seamlessly interacts with pages using a floating chat button; allows users to query AI and receive contextual responses.
* 🗂️ **Persistent Conversations**: Conversations are stored **per URL** using **IndexedDB**, ensuring previous chats are retained and context is preserved across visits.

---

### 🛠️ Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/sonu27091999/PromptPal.git
   cd PromptPal
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Build the project:

   ```bash
   npm run build
   ```
4. Locate the output `dist/` folder.
5. Go to `chrome://extensions` and click **"Load unpacked"**, selecting the `dist/` folder.

---

### 🔧 Environment Variables

Before running the extension locally, create a `.env` file based on .env.examplein the root directory.

---

### 🛡 Permissions

This extension uses:

* `storage`: To store your GROQ API key.
* `activeTab`: To access the current page URL for contextual chat.
* `scripting`: To inject the chat interface dynamically.

---

### 🔐 API Key Safety

Your GROQ API key is only stored **locally** in your browser using Chrome's `local` storage. We do **not** transmit or log your key anywhere else.
