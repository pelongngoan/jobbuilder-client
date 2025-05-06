import { JSX, useState } from "react";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Input } from "./ui/Input";
import { searchJobs } from "../lib/api/services/jobs";
import React from "react";

const LOCATIONS = ["New York", "San Francisco", "London", "Remote"];
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];

// Define a flexible message type
interface ChatMessage {
  id: number;
  type: "user" | "bot";
  content: string | React.ReactNode;
  time: string;
  actions?: { label: string; action: string }[];
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm your JobBuilder assistant. How can I help you today?",
      time: "Just now",
      actions: [
        { label: "Show all jobs", action: "show_all" },
        { label: "Filter by location", action: "filter_location" },
        { label: "Filter by job type", action: "filter_type" },
      ],
    },
  ]);

  // Helper to add a bot message
  const addBotMessage = (
    content: string | JSX.Element,
    actions?: { label: string; action: string }[]
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "bot",
        content,
        time: "Just now",
        ...(actions ? { actions } : {}),
      },
    ]);
  };

  // Helper to add job cards
  const addJobResults = (jobs: unknown[]) => {
    if (!Array.isArray(jobs) || !jobs.length) {
      addBotMessage("No jobs found for your criteria.");
      return;
    }
    jobs.slice(0, 5).forEach((job) => {
      const j = job as Record<string, unknown>;
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: "bot",
          content: (
            <div className="border rounded p-3 mb-2 bg-slate-50">
              <div className="font-semibold text-blue-700">
                {j.title as string}
              </div>
              <div className="text-sm text-slate-700">
                {j.companyName as string} - {j.location as string}
              </div>
              <div className="text-xs text-slate-500 mb-1">
                {j.jobType as string} |{" "}
                {(j.salaryRange as string) ||
                  (j.salary as string) + " " + (j.salaryCurrency as string)}
              </div>
              <div className="text-xs text-slate-600 line-clamp-2">
                {j.description as string}
              </div>
            </div>
          ),
          time: "Just now",
        },
      ]);
    });
  };

  // Handle user message or action
  const handleUserInput = async (input: string, isAction = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        content: input,
        time: "Just now",
      },
    ]);
    setMessage("");

    // Guided flow
    if (isAction) {
      if (input === "show_all") {
        addBotMessage("Fetching all jobs...");
        const res = await searchJobs("", 1, 5);
        addJobResults(res.jobs || res.data || []);
        setTimeout(() => {
          addBotMessage("Would you like to filter further?", [
            { label: "Filter by location", action: "filter_location" },
            { label: "Filter by job type", action: "filter_type" },
          ]);
        }, 500);
      } else if (input === "filter_location") {
        addBotMessage(
          "Choose a location:",
          LOCATIONS.map((loc) => ({ label: loc, action: `loc_${loc}` }))
        );
      } else if (input === "filter_type") {
        addBotMessage(
          "Choose a job type:",
          JOB_TYPES.map((type) => ({ label: type, action: `type_${type}` }))
        );
      } else if (input.startsWith("loc_")) {
        const location = input.replace("loc_", "");
        addBotMessage(`Searching jobs in ${location}...`);
        const res = await searchJobs(location, 1, 5);
        addJobResults(res.jobs || res.data || []);
        setTimeout(() => {
          addBotMessage("Would you like to filter further?", [
            { label: "Filter by job type", action: "filter_type" },
            { label: "Show all jobs", action: "show_all" },
          ]);
        }, 500);
      } else if (input.startsWith("type_")) {
        const type = input.replace("type_", "");
        addBotMessage(`Searching ${type} jobs...`);
        const res = await searchJobs(type, 1, 5);
        addJobResults(res.jobs || res.data || []);
        setTimeout(() => {
          addBotMessage("Would you like to filter further?", [
            { label: "Filter by location", action: "filter_location" },
            { label: "Show all jobs", action: "show_all" },
          ]);
        }, 500);
      }
      return;
    }

    // Fallback: keyword-based search
    if (/job|find|search/i.test(input)) {
      addBotMessage("Searching for jobs...");
      const res = await searchJobs(input, 1, 5);
      addJobResults(res.jobs || res.data || []);
      setTimeout(() => {
        addBotMessage("Would you like to filter further?", [
          { label: "Filter by location", action: "filter_location" },
          { label: "Filter by job type", action: "filter_type" },
        ]);
      }, 500);
    } else {
      addBotMessage(
        "I'm here to help! You can ask me to find jobs or use the buttons below.",
        [
          { label: "Show all jobs", action: "show_all" },
          { label: "Filter by location", action: "filter_location" },
          { label: "Filter by job type", action: "filter_type" },
        ]
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    handleUserInput(message);
  };

  // Handle action button click
  const handleAction = (action: string) => {
    handleUserInput(action, true);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 z-50">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bot className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Job Assistant
                  </h3>
                  <p className="text-sm text-slate-500">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent className="p-4">
              {/* Messages */}
              <div className="space-y-4 mb-4 h-96 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id || idx}
                    className={`flex ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {typeof msg.content === "string" ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        msg.content
                      )}
                      <span
                        className={`text-xs mt-1 block ${
                          msg.type === "user"
                            ? "text-blue-100"
                            : "text-slate-500"
                        }`}
                      >
                        {msg.time}
                      </span>
                      {/* Action buttons */}
                      {msg.actions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.actions.map((action) => (
                            <button
                              key={action.action}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                              onClick={() => handleAction(action.action)}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
