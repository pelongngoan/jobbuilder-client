import React, { useState, useEffect, useRef } from "react";
import { chatbotService, ChatbotMessage } from "../../services/chatbotService";
import Button from "./Button";
import Input from "./Input";

interface ChatMessage extends ChatbotMessage {
  isUser: boolean;
  attachments?: File[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadWelcomeMessage();
    }
  }, [isOpen]);

  const loadWelcomeMessage = async () => {
    try {
      const response = await chatbotService.getWelcomeMessage();
      if (response.success) {
        setMessages([
          {
            ...response.data,
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading welcome message:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          `File ${file.name} is not supported. Only images, PDF, DOC, DOCX, and TXT files are allowed.`
        );
        return false;
      }

      return true;
    });

    // Limit to 5 files total
    const currentTotal = selectedFiles.length + validFiles.length;
    if (currentTotal > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && selectedFiles.length === 0) || isLoading)
      return;

    const userMessage: ChatMessage = {
      message: inputMessage || "📎 Files attached",
      timestamp: new Date().toISOString(),
      isUser: true,
      attachments: selectedFiles,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    const filesToSend = [...selectedFiles];
    setSelectedFiles([]);
    setIsLoading(true);

    try {
      let response;
      if (filesToSend.length > 0) {
        response = await chatbotService.askQuestionWithFiles(
          inputMessage,
          filesToSend
        );
      } else {
        response = await chatbotService.askQuestion(inputMessage);
      }

      if (response.success) {
        const botMessage: ChatMessage = {
          ...response.data,
          isUser: false,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Handle error response
        const errorMessage: ChatMessage = {
          message:
            response.message || "Sorry, I couldn't process your request.",
          timestamp: new Date().toISOString(),
          isUser: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        message: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/");
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full w-12 h-12 sm:w-14 sm:h-14 shadow-lg transition-all duration-300 ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isOpen ? (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Button>
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className="fixed inset-x-4 bottom-4 top-16 sm:inset-auto sm:bottom-20 sm:right-4 lg:bottom-24 lg:right-6 z-50 
                           w-auto sm:w-80 md:w-96 
                           h-auto sm:h-[450px] md:h-[500px] 
                           max-h-[calc(100vh-4rem)] sm:max-h-[500px]
                           sm:max-w-[calc(100vw-2rem)] lg:max-w-[calc(100vw-3rem)]"
          >
            <div className="h-full bg-white rounded-lg shadow-2xl flex flex-col">
              {/* Header - Fixed at top */}
              <div className="bg-blue-500 text-white p-3 sm:p-4 rounded-t-lg flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm sm:text-base truncate">
                        Job Search Assistant
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-100 truncate">
                        Always here to help!
                      </p>
                    </div>
                  </div>
                  {/* Close button - always accessible */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-blue-600 rounded transition-colors flex-shrink-0 ml-2"
                    aria-label="Close chat"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages - Scrollable area */}
              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4"
                style={{ minHeight: 0 }}
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg ${
                        message.isUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {/* Show attachments for user messages */}
                      {message.isUser &&
                        message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {message.attachments.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center space-x-2 text-xs bg-blue-600 rounded p-1"
                              >
                                <span>📎</span>
                                <span className="truncate">{file.name}</span>
                                <span className="text-blue-200">
                                  ({formatFileSize(file.size)})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {message.message}
                      </p>

                      {/* Show attachment indicator for bot responses */}
                      {!message.isUser && message.hasAttachments && (
                        <p className="text-xs mt-1 text-gray-500">
                          ✅ Analyzed {message.attachmentCount} file(s) content
                        </p>
                      )}

                      <p
                        className={`text-xs mt-1 ${
                          message.isUser ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="p-3 border-t bg-gray-50 max-h-32 overflow-y-auto">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 font-medium">
                      Selected files ({selectedFiles.length}/5):
                    </div>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded p-2 text-xs"
                      >
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span>{isImageFile(file) ? "🖼️" : "📄"}</span>
                          <span className="truncate">{file.name}</span>
                          <span className="text-gray-500">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input - Fixed at bottom */}
              <div className="p-3 sm:p-4 border-t flex-shrink-0 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about job searching, interviews... or attach files"
                    disabled={isLoading}
                    className="flex-1 text-sm"
                  />

                  {/* File upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || selectedFiles.length >= 5}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded transition-colors flex-shrink-0"
                    title="Attach files"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <Button
                    onClick={sendMessage}
                    disabled={
                      (!inputMessage.trim() && selectedFiles.length === 0) ||
                      isLoading
                    }
                    className="px-3 sm:px-4 py-2 flex-shrink-0"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </Button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chatbot;
