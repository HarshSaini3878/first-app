"use client";
import { useState, useEffect } from "react";

export default function Home() {
 
  const [messages, setMessages] = useState([]);


  const generateText = async (userMessage) => {
    try {
      // Add user's message to the chat history
      const userMessageObj = { text: userMessage, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessageObj]);

      
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: userMessage }), 
      });

      
      const data = await response.json();

     
      const aiMessage = {
        text: data.output || "Sorry, I couldn't generate a response.",
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = { text: "Error: Could not fetch the interview response.", isUser: false };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-6">
      <div className="z-10 max-w-xl w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-center text-3xl font-semibold text-blue-800">React Internship Interview Chatbot</h1>

        <div className="overflow-y-auto max-h-96 space-y-4 p-4 bg-blue-50 rounded-lg shadow-inner">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.isUser
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-700 border border-blue-300"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-between items-center">
          <input
            type="text"
            placeholder="Your response..."
            className="w-full p-2 border border-blue-300 rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value.trim()) {
                generateText(e.target.value); // Send response when Enter is pressed
                e.target.value = ""; // Clear input field
              }
            }}
          />
          <button
            onClick={() => generateText(document.querySelector("input").value)}
            className="ml-4 p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
