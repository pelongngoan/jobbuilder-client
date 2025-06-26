import apiClient from "./api";

export interface NavigationLink {
  text: string;
  url: string;
}

export interface ChatbotMessage {
  message: string;
  timestamp: string;
  hasAttachments?: boolean;
  attachmentCount?: number;
  isWebsiteNavigation?: boolean;
  navigationLinks?: NavigationLink[];
}

export interface ChatbotResponse {
  success: boolean;
  data: ChatbotMessage;
  message?: string;
}

export const chatbotService = {
  // Get welcome message
  async getWelcomeMessage(): Promise<ChatbotResponse> {
    const response = await apiClient.get("/chatbot/welcome");
    return response.data;
  },

  // Ask a question to the chatbot (text only)
  async askQuestion(message: string): Promise<ChatbotResponse> {
    const response = await apiClient.post("/chatbot/ask", { message });
    return response.data;
  },

  // Ask a question to the chatbot with files
  async askQuestionWithFiles(
    message: string,
    files: File[]
  ): Promise<ChatbotResponse> {
    const formData = new FormData();

    // Add message to form data
    if (message.trim()) {
      formData.append("message", message);
    }

    // Add files to form data
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiClient.post("/chatbot/ask", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
