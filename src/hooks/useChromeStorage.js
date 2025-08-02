import { CustomError } from "../utils/CustomError";

const DB_NAME = import.meta.env.VITE_DB_NAME;
const STORE_NAME = import.meta.env.VITE_STORE_NAME;
const DB_VERSION = parseInt(import.meta.env.VITE_DB_VERSION, 10); // Ensure it's a number
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(
        new CustomError(request.error, 500, {
          reason: request.error,
        })
      );
    };
  });
};

const getAllFromStore = (store) => {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new CustomError("Failed to fetch chats from IndexedDB", 500, {
          reason: "Failed to fetch chats from IndexedDB",
        })
      );
  });
};

export const useChromeStorage = () => {
  return {
    getApiKey: () => {
      return new Promise((resolve, reject) => {
        if (!chrome?.storage?.local) {
          return reject(
            new CustomError("Chrome storage not accessible", 403, {
              reason:
                "chrome.storage.local is only accessible within the context of a Chrome extension, i.e., inside background scripts, content scripts, popup scripts, or options pages. It is not accessible from regular JavaScript files executed in standard environments like Node.js or outside the extension runtime.",
            })
          );
        }

        chrome.storage.local.get(["aiassistant_api_key"], (result) => {
          if (chrome.runtime.lastError) {
            return reject(
              new CustomError("Failed to retrieve API key: ", 500, {
                reason: chrome.runtime.lastError.message,
              })
            );
          }

          const key = result.aiassistant_api_key;
          if (!key) {
            return reject(
              new CustomError("API key not found in storage.", 400, {
                reason: "API key not found in storage.",
              })
            );
          }

          resolve({ apiKey: key, statusCode: 200, details: {} });
        });
      });
    },

    setApiKey: (apiKey) => {
      return new Promise((resolve, reject) => {
        if (!chrome?.storage?.local) {
          return reject(
            new CustomError("Chrome storage not accessible", 403, {
              reason:
                "chrome.storage.local is only accessible within the context of a Chrome extension (background scripts, content scripts, popup scripts, or options pages).",
            })
          );
        }

        // Set the API key
        chrome.storage.local.set({ aiassistant_api_key: apiKey }, () => {
          if (chrome.runtime.lastError) {
            return reject(
              new CustomError("Failed to store API key.", 500, {
                reason: chrome.runtime.lastError.message,
              })
            );
          }

          resolve({
            message: "API key stored successfully.",
            statusCode: 200,
            details: {},
          });
        });
      });
    },

    saveChat: async (url, messages) => {
      try {
        console.log(messages);
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const allChats = await getAllFromStore(store);
        const existingUrlChat = allChats.filter(
          (chat) => chat.url === url
        )?.[0];
        if (!existingUrlChat) {
          await store.put({
            url,
            messages,
            timestamp: new Date().toISOString(),
          });
        } else {
          await store.put({
            ...existingUrlChat,
            messages,
            timestamp: new Date().toISOString(),
          });
        }
        tx.oncomplete = () => {
          console.log("success");
          return {
            message: "Chat saved successfully.",
            statusCode: 200,
            details: {},
          };
        };
        tx.onerror = () => {
          console.log("error.");
          return new CustomError("Transaction failed", 500, {
            reason: "Transaction failed",
          });
        };
      } catch (error) {
        console.log("catch error." + error.message);
        return new CustomError(`Failed to save chat : ${error.message}`, 500, {
          reason: `Failed to save chat : ${error.message}`,
        });
      }
    },

    getChatByUrl: async (url) => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const allChats = await getAllFromStore(store);
        const urlChat = allChats.filter((chat) => chat.url === url)?.[0];
        return { urlChat, statusCode: 200, details: {} };
      } catch (error) {
        return new CustomError(`${error.message}`, 500, {
          reason: `${error.message}`,
        });
      }
    },

    clearChats: async () => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        await tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => {
          return {
            message: "Chat cleared successfully.",
            statusCode: 200,
            details: {},
          };
        };

        tx.onerror = () => {
          return new CustomError("Transaction failed", 500, {
            reason: "Transaction failed",
          });
        };
      } catch (error) {
        return new CustomError(`Failed to clear chat : ${error.message}`, 500, {
          reason: `Failed to clear chat : ${error.message}`,
        });
      }
    },
  };
};
