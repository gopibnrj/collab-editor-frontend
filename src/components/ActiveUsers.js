import React, { useEffect, useState } from "react";

function ActiveUsers({ docId, username, socket }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("presenceUpdate", (activeUsers) => {
      setUsers(activeUsers);
    });
    return () => {
      socket.off("presenceUpdate");
    };
  }, [docId, socket]);

  return (
    <div className="card border-0 rounded-0">
      <div className="card-body">
        <h6 className="border-bottom pb-2">Active Users</h6>
        <div className="d-flex flex-wrap gap-2">
          {users.map((u, i) => (
            <span key={i} className="badge bg-success">
              {u}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActiveUsers;
