import { useState } from 'react';
import '../Chatbot/Chatbot.css'; // Ensure this path is correct

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hello, I'm Zen AI. Ask me anything health related!",
      sender: 'ChatGPT',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Function to send messages
  const handleSend = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(), // Using Date.now() for unique id generation
        text: newMessage,
        sender: 'user',
      };
      setMessages([...messages, userMessage]);

      setIsTyping(true);
      await processMessageToChatGPT(newMessage);
      setNewMessage('');
    }
  };

  // Function to process and get response from ChatGPT
  async function processMessageToChatGPT(message) {
    try {
      const response = await fetch('http://localhost:3000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const reply = {
        id: messages.length,
        text: data.reply,
        sender: "ChatGPT",
      };
      setMessages(prevMessages => [...prevMessages, reply]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    } finally {
      setIsTyping(false);
    }
  }

  // Function to handle input change and submit on Enter key press
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (e.key === 'Enter' && newMessage.trim()) {
      handleSend();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender === 'user' ? 'user' : ''}`}>
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
          onKeyDown={handleInputChange} // Added to handle Enter key for sending messages
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
