import React, { useEffect, useState } from "react";

function Editor({ username, doc, socket }) {
  const [content, setContent] = useState(doc.content);

  useEffect(() => {
    socket.on("documentUpdate", (newContent) => setContent(newContent));
    return () => {
      socket.off("documentUpdate");
    };
  }, [doc.id, socket]);

  const handleChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    socket.emit("editDocument", { docId: doc.id, content: newContent });
  };

  return (
    <textarea
      className="form-control border-0 h-100"
      style={{ fontSize: "16px" }}
      value={content}
      onChange={handleChange}
    />
  );
}

export default Editor;
