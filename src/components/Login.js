import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./indexlogin.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Login = () => {
  const navigate = useNavigate();

  // Login States
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Registration States
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerDob, setRegisterDob] = useState("");
  const [registerError, setRegisterError] = useState("");

  const API_URL = "http://localhost:3002/auth"; 

  // ✅ Login User Function
  const loginUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      if (!response.data.user || !response.data.token) {
        throw new Error("Invalid response from server");
      }
  
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
  
      console.log("✅ Login successful:", response.data.user);
  
      // ✅ Force re-fetch user after login
      navigate("/"); // ✅ Navigate first

      setTimeout(() => {
        window.location.reload(); // ✅ Reload after a short delay
      }, 100)
    } catch (error) {
      console.error("❌ Login Error:", error);
      setLoginError(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Register User Function (Unchanged)
  const registerUser = async (userData) => {
    try {
      await axios.post(`${API_URL}/register`, userData);
      alert("Registration successful! Please login.");
    } catch (error) {
      setRegisterError(error.response?.data?.message || "Registration failed");
    }
  };

  // ✅ Handle Login
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    console.log("🔹 Login Form Submitted:", { email: loginEmail, password: loginPassword });
    await loginUser({ email: loginEmail, password: loginPassword });
  };

  // ✅ Handle Registration (Unchanged)
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    await registerUser({ name: registerName, email: registerEmail, password: registerPassword, dob: registerDob });
  };

  return (
    <>
      <div className="section" style={{ backgroundColor: "#1f2029" }}>
        <div className="container">
          <div className="logo">
            <img src="./assets/Strugglers_logo.png" alt="" />
          </div>
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In </span>
                  <span>Sign Up</span>
                </h6>
                <input className="checkbox" type="checkbox" id="reg-log" name="reg-log" />
                <label htmlFor="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Log In</h4>
                          <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                              <input 
                                onChange={(e) => setLoginEmail(e.target.value)} 
                                type="email" 
                                name="loginEmail" 
                                className="form-style" 
                                placeholder="Your Email" 
                                required 
                              />
                            </div>
                            <div className="form-group mt-2">
                              <input 
                                onChange={(e) => setLoginPassword(e.target.value)} 
                                type="password" 
                                name="loginPassword" 
                                className="form-style" 
                                placeholder="Your Password" 
                                required 
                              />
                            </div>
                            <button type="submit" className="btn1 btn mt-4">Submit</button>
                            <p className="mb-0 mt-4 text-center">
                              <a href="#0" className="link">Forgot your password?</a>
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="section text-center">
                          <h4 className="mb-4 pb-3">Sign Up</h4>
                          <form onSubmit={handleRegisterSubmit}>
                            <div className="form-group">
                              <input 
                                onChange={(e) => setRegisterName(e.target.value)} 
                                type="text" 
                                name="registerName" 
                                className="form-style" 
                                placeholder="Your Full Name" 
                                required 
                              />
                            </div>
                            <div className="form-group mt-2">
                              <input 
                                onChange={(e) => setRegisterEmail(e.target.value)} 
                                type="email" 
                                name="registerEmail" 
                                className="form-style" 
                                placeholder="Your Email" 
                                required 
                              />
                            </div>
                            <div className="form-group mt-2">
                              <input 
                                onChange={(e) => setRegisterPassword(e.target.value)} 
                                type="password" 
                                name="registerPassword" 
                                className="form-style" 
                                placeholder="Your Password" 
                                required 
                              />
                            </div>
                            <button type="submit" className="btn1 btn mt-4">Submit</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
