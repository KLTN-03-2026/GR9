import apiInstance from ".";

export const askChatbot = (message) => {
  return apiInstance.post("/chatbot/ask", { message });
};
