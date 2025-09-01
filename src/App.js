import React, { useState, useEffect } from "react";
import Editor from "./components/Editor";
import ChatPanel from "./components/ChatPanel";
import ActiveUsers from "./components/ActiveUsers";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const login = async () => {
    if (!username) return;
    await axios.post("http://localhost:5000/api/users/login", { username });
    setLoggedIn(true);
    const res = await axios.get("http://localhost:5000/api/documents");
    setDocuments(res.data);
  };

  const createDoc = async () => {
    const title = prompt("Enter document title:");
    if (title) {
      const res = await axios.post("http://localhost:5000/api/documents", { title });
      setDocuments([res.data, ...documents]);
    }
  };

  const openDoc = async (docId) => {
    const res = await axios.get(`http://localhost:5000/api/documents/${docId}`);
    setSelectedDoc(res.data);

    // 👉 join document only once here
    socket.emit("joinDocument", { docId, username });
  };

  useEffect(() => {
    return () => {
      if (selectedDoc) {
        socket.emit("leaveDocument", { docId: selectedDoc.document.id, username });
      }
    };
  }, [selectedDoc, username]);

  if (!loggedIn) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: "350px" }}>
          <h4 className="mb-3 text-center">Login</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn btn-primary w-100" onClick={login}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!selectedDoc) {
    return (
      <div className="container py-4">
        <h3 className="mb-3">Documents</h3>
        <button className="btn btn-success mb-3" onClick={createDoc}>
          + New Document
        </button>
        <ul className="list-group">
          {documents.map((doc) => (
            <li key={doc.id} className="list-group-item d-flex justify-content-between">
              <span>{doc.title}</span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => openDoc(doc.id)}
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <div className="flex-grow-1 border-end">
        <Editor username={username} doc={selectedDoc.document} socket={socket} />
      </div>
      <div className="d-flex flex-column" style={{ width: "350px" }}>
        <ActiveUsers docId={selectedDoc.document.id} username={username} socket={socket} />
        <ChatPanel
          username={username}
          docId={selectedDoc.document.id}
          chatHistory={selectedDoc.chat}
          socket={socket}
        />
      </div>
    </div>
  );
}

export default App;
