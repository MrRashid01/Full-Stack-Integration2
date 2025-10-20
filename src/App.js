import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const msgData = { user: username, text: message };
    socket.emit("send_message", msgData);
    setMessage("");
  };

  if (!joined) {
    return (
      <div className="joinContainer">
        <h2>💬 Welcome to Real-Time Chat</h2>
        <input
          type="text"
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="nameInput"
        />
        <button onClick={() => setJoined(true)} className="joinBtn">
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="chatContainer">
      <div className="chatHeader">Hi {username} 👋 — Start chatting!</div>

      <div className="chatBox">
        {chat.length === 0 ? (
          <p className="noMessages">No messages yet...</p>
        ) : (
          chat.map((msg, i) => (
            <div
              key={i}
              className={`message ${
                msg.user === username ? "ownMessage" : "otherMessage"
              }`}
            >
              <div className="messageUser">
                {msg.user === username ? "You" : msg.user}
              </div>
              <div className="messageText">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="inputArea">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="messageInput"
        />
        <button onClick={sendMessage} className="sendBtn">
          Send 🚀
        </button>
      </div>
    </div>
  );
}

export default App;
