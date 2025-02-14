import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min'
import "./index.css";
import Leftbar from '../Home/Leftbar'
import Rightbar from '../Home/Rightbar'
import Posts from '../Home/Posts'

function Home() {
  const [currentCategory, setCurrentCategory] = useState(""); 
  const [userName, setUserName] = useState(""); 
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      const formattedName = storedUser.name.charAt(0).toUpperCase() + storedUser.name.slice(1);
      setUserName(formattedName);
    }
  }, []);

  const menuToggle = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("active");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <>
      <header className="top container-fluid m-0 p-4"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          zIndex: 1000,
        }}
      >
        <div className="row">
          <div className="col-2 m-0 p-0">
            <img
              src="./assets/Strugglers_logo.png"
              alt="Company Logo"
              width="260"
              height="83"
              className="ourlogo"
            />
          </div>
          <div className="all col-8 p-0 d-flex justify-content-end">
            <span className="feed">Struggle is Real</span>
            <a href="blank" className="chat navbar-icon">
              <img src="./assets/Chats.png" alt="Chat Icon" width="35" height="35" />
            </a>
            <a href="#" className="notif navbar-icon">
              <img
                src="./assets/notifications.png"
                alt="Notifications Icon"
                width="35"
                height="35"
              />
            </a>
          </div>
          <div className="action" width="10%">
            <div className="profile" onClick={menuToggle}>
              <img
                src="./assets/profile.png"
                alt="myprofile"
                width="40"
                height="40"
              />
            </div>
            <div className="menu" ref={menuRef}>
              <h3>{userName ? userName : "Guest"}</h3>
              <ul>
                <li>
                  <img src="./assets/icons/user.png" />
                  <a href="#">My profile</a>
                </li>
                <li>
                  <img src="./assets/icons/edit.png" />
                  <a href="#">Edit profile</a>
                </li>
                <li>
                  <img src="./assets/icons/settings.png" />
                  <a href="#">Setting</a>
                </li>
                <li>
                  <img src="./assets/icons/question.png" />
                  <a href="#">Help</a>
                </li>
                <li onClick={handleLogout}>
                  <img src="./assets/icons/log-out.png" alt="Logout Icon" />
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className="container-fluid main-content m-0 p-0"
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "80px",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: "0 0 15vw", overflow: "hidden" }}>
          <Leftbar setCurrentCategory={setCurrentCategory} />
        </div>

        <div style={{ 
          flex: "1", 
          overflowY: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          marginLeft: "0vw",
          width: "70vw"
        }}>
         <Posts currentCategory={currentCategory} />
        </div>

        <div style={{ flex: "0 0 15vw", overflow: "hidden" }}>
          <Rightbar />
        </div>
      </div>
    </>
  );
}
export default Home;
