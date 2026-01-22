"use client";

import { useState, useRef, useEffect } from "react";

// Define the message type
interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export default function ChatBot() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    try {
      const response = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = "";
      const modelMessageId = Date.now().toString() + "-model";

      // Add a placeholder for the model's message
      setMessages((prev) => [
        ...prev,
        { id: modelMessageId, role: "model", text: "..." },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        modelResponse += decoder.decode(value, { stream: true });
        
        // Update the model's message in the list
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
        ));
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
      setMessages(prev => [...prev, {id: Date.now().toString(), role: 'model', text: "Sorry, I'm having trouble connecting. Please try again later."}]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">SOL - AI Travel Assistant</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Online</span>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-2xl max-w-lg shadow-lg ${
                msg.role === "user"
                  ? "bg-orange-400 text-gray-800"
                  : "bg-blue-500 text-white"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="p-4 rounded-2xl max-w-lg shadow-lg bg-blue-500 text-white">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <footer className="bg-yellow-200 p-4 shadow-inner">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask SOL about your next travel adventure..."
            disabled={isLoading}
            className="flex-1 p-3 border-2 border-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-4 bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition duration-300"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </footer>
    </div>
  );
}
