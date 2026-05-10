import apiInstance from ".";

export const askChatbot = (message, history = []) => {
  return apiInstance.post("/chatbot/ask", { message, history });
};
