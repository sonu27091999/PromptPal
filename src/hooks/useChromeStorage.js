import { CustomError } from "../utils/CustomError";

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
  };
};
