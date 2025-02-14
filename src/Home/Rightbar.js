import React, { useState, useEffect } from "react";
import "./Sidebar.css";

function Rightbar() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3002/users"); // Adjust URL if needed
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect to call fetchUsers when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className="rightbar scrollable-section">
      <h3 className="section-title">All Users</h3>
      {loading ? (
        <p>Loading users...</p>
      ) : (
          <ul className="user-list">
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user._id} className="user-item">
                  <span className="user-name">
                    {user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()}
                  </span>
                  <button className="follow-btn">DM</button>
                </li>
              ))
            ) : (
              <p>No users found.</p>
            )}
          </ul>
      )}
    </div>
  );
}

export default Rightbar;