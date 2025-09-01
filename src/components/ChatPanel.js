import React, { useEffect, useState } from "react";

function ChatPanel({ username, docId, chatHistory, socket }) {
  const [messages, setMessages] = useState(chatHistory || []);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chatMessage");
    };
  }, [docId, socket]);

  const sendMessage = () => {
    if (!text) return;
    socket.emit("chatMessage", { docId, username, message: text });
    setText("");
  };

  return (
    <div className="card flex-grow-1 border-0 rounded-0">
      <div className="card-body d-flex flex-column">
        <h6 className="border-bottom pb-2">Chat</h6>
        <div className="flex-grow-1 overflow-auto mb-2">
          <ul className="list-group list-group-flush">
            {messages.map((msg, i) => {
              const time = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";
              return (
                <li
                  key={i}
                  className={`list-group-item px-0 ${
                    msg.system ? "text-muted fst-italic" : ""
                  }`}
                >
                  {msg.system ? (
                    <span>
                      [{time}] {msg.message}
                    </span>
                  ) : (
                    <span>
                      <strong>{msg.username}</strong>: {msg.message}{" "}
                      <small className="text-muted">[{time}]</small>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="btn btn-primary ms-2" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
