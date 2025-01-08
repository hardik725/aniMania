import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I assist you today?" },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // For toggling chat visibility
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setUserInput("");

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    setIsLoading(true);

    try {
      // Send user input to the backend
      const response = await fetch(
        "https://animania-backend-dmjs.onrender.com/generateMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      const data = await response.json();

      // Add bot response to chat
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.text || "I couldn't process that." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "There was an error processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot Icon */}
      {!isChatOpen && (
        <button
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
          onClick={() => setIsChatOpen(true)}
        >
          <FontAwesomeIcon icon={faRobot} size="lg" />
        </button>
      )}

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="w-full sm:w-96 bg-gray-100 rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-blue-500 text-white px-4 py-2">
            <h3 className="font-bold text-lg">
              <FontAwesomeIcon icon={faRobot} className="mr-2" />
              AniMania ChatBot
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="h-64 sm:h-80 overflow-y-scroll p-4 bg-white"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                } max-w-xs`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="text-left">
                <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="flex items-center px-4 py-2 border-t bg-gray-50">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
