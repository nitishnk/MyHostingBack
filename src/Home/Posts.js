import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";
import "./Posts.css";

function Posts({ currentCategory }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3002");
    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    setMessages([]); // ✅ Clear messages immediately when switching category
    if (currentCategory && socketRef.current) {
      socketRef.current.emit("joinCategory", currentCategory);
      fetchMessages();
    }
  }, [currentCategory]);

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("🟢 Received message from socket:", message);
  
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some((msg) => msg._id === message._id);
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    };
  
    // ✅ Remove old listener before adding a new one
    socketRef.current.off("receiveMessage", handleMessage);
    socketRef.current.on("receiveMessage", handleMessage);
  
    return () => {
      socketRef.current.off("receiveMessage", handleMessage);
    };
  }, [currentCategory]); // ✅ Only re-run when category changes
  

  // ✅ Fetch messages from DB without duplication
  const fetchMessages = async () => {
    if (!currentCategory) return;
  
    try {
      console.log(`📥 Fetching messages for category: ${currentCategory}`);
      const response = await fetch(`http://localhost:3002/chats/${currentCategory}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
  
      if (!response.ok) throw new Error("Failed to fetch messages");
  
      const data = await response.json();
      console.log("✅ Fetched messages:", data);
  
      // ✅ Only add new messages, prevent duplication
      setMessages((prevMessages) => {
        const newMessages = data.filter((msg) => !prevMessages.some((m) => m._id === msg._id));
        return [...prevMessages, ...newMessages];
      });
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };
  
  // ✅ Send message & store it in DB
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("⚠️ You must be logged in to send messages.");
      return;
    }
  
    const newMessage = {
      text: inputValue.trim(),
      userId: user.id,
      sender: user.name,
      category: currentCategory,
    };
  
    console.log("📤 Sending message to backend via fetch:", newMessage);
  
    try {
      // ✅ Prevent sending duplicate messages
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.text === newMessage.text && msg.userId === newMessage.userId)) {
          console.warn("⚠️ Duplicate message detected in frontend, skipping send.");
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
  
      // ✅ Send message to backend
      const response = await fetch("http://localhost:3002/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMessage),
      });
  
      const savedMessage = await response.json();
      console.log("✅ Message saved in DB:", savedMessage);
  
      // ✅ Emit to Socket.io only if message was saved successfully
      if (savedMessage && savedMessage._id) {
        console.log("📤 Emitting message to socket:", savedMessage);
        socketRef.current.emit("sendMessage", {
          category: currentCategory,
          message: savedMessage,
          token,
        });
      }
  
      setInputValue("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };
  
  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  return (
    <div className="posts">
      <div className="chat-header">
        <h2>
          {currentCategory
            ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1).toLowerCase()
            : "Select a Category"}
        </h2>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message._id} className="message-container">
            <div className="message">
              <div className="message-sender">
                {message.sender
                  ? message.sender.charAt(0).toUpperCase() + message.sender.slice(1).toLowerCase()
                  : "Unknown"}
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Posts;
