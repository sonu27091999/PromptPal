import { CustomError } from "../utils/CustomError";

export const useChatApi = () => {
  return {
    callGorqAI: (apiKey, userMessage) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!apiKey) {
            return reject(
              new CustomError(
                "GorqAI API key not found. Please configure it in the popup.",
                400,
                {
                  reason:
                    "GorqAI API key not found. Please configure it in the popup.",
                }
              )
            );
          }

          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                  {
                    role: "user",
                    content: userMessage,
                  },
                ],
                temperature: 0.7,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            const errorMsg = errorData?.error?.message || "Unknown error";
            return reject(
              new CustomError(`Gorq API Error : ${errorMsg}`, response.status, {
                reason: `Gorq API Error : ${errorMsg}`,
              })
            );
          }

          const data = await response.json();
          const aiResponse = data?.choices?.[0]?.message?.content;

          if (!aiResponse) {
            return reject(
              new CustomError(
                "GorqAI response did not return any content.",
                204,
                { reason: "A query yields no results but isn't an error." }
              )
            );
          }
          return resolve({ aiResponse, statusCode: 200, details: {} });
        } catch (error) {
          return reject(
            new CustomError("Internal server error.", 500, {
              reason: "Internal server error. Please try after sometime.",
            })
          );
        }
      });
    },
  };
};
