import { useState, useEffect } from "react";
import "../Chatbot/Chatbot.css";

function Chatbot() {
  const initialMessage = "Hello, I'm Zen AI. Ask me anything health-related!";
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: initialMessage,
      sender: "ChatGPT",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to send messages
  const handleSend = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        sender: "user",
      };
      const updatedMessagesWithUser = [...messages, userMessage];
      setMessages(updatedMessagesWithUser);

      setIsTyping(true);
      await processMessageToChatGPT(newMessage);
      setNewMessage("");

      // Save the updated chat history to LocalStorage
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessagesWithUser)
      );
    }
  };

  // Function to process and get response from ChatGPT
  async function processMessageToChatGPT(message) {
    try {
      const userMessage = {
        id: Date.now(),
        text: message,
        sender: "user",
      };

      // Add user's message to the state
      const updatedMessagesWithUser = [...messages, userMessage];
      setMessages(updatedMessagesWithUser);

      setIsTyping(true);
      const response = await fetch("http://localhost:3000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const aiReply = {
        id: Date.now(),
        text: data.reply,
        sender: "ChatGPT",
      };

      // Add AI's response to the state separately
      const updatedMessagesWithAI = [...updatedMessagesWithUser, aiReply];
      setMessages(updatedMessagesWithAI);

      // Save the updated chat history to LocalStorage
      localStorage.setItem(
        "chatHistory",
        JSON.stringify(updatedMessagesWithAI)
      );
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setIsTyping(false);
    }
  }

  // Function to handle input change and submit on Enter key press
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.key === "Enter" && newMessage.trim()) {
      handleSend();
    }
  };

  // Function to clear chat history and LocalStorage
  const handleClearChat = () => {
    localStorage.removeItem("chatHistory");
    setMessages([
      {
        id: 0,
        text: initialMessage,
        sender: "ChatGPT",
      },
    ]);
  };

  // Load chat history from LocalStorage on component mount
  useEffect(() => {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    if (chatHistory.length > 0) {
      setMessages(chatHistory);
    }
  }, []);

  return (
    <div className="chatbot-container">
      <div className="message-list">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === "user" ? "user" : ""}`}
          >
            {message.text}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Zen is typing...</div>}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type message here"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleInputChange}
        />
        <button onClick={handleSend}>Send</button>
        <button onClick={handleClearChat}>Clear Chat</button>
      </div>
    </div>
  );
}

export default Chatbot;
