import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, [setUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);

      if (response.status === 200) {
        const userData = response.data.data;
        console.log('object', userData);
        localStorage.setItem("token", JSON.stringify(userData.token));
        setUser(userData);
        toast.success("Login successful!");
        setFormData({ email: "", password: "" });
        navigate("/weather");
      } else {
        toast.error(response.data?.msg || "Invalid login credentials.");
        setFormData({ email: "", password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <div className="login-box">
        <div className="header">
          <h2>Login</h2>
        </div>
        <div className="avatar">
          <FaUserCircle size={100} color="#fff" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="input-icon">
              <FaEnvelope />
            </div>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className="input-icon">
              <FaLock />
            </div>
          </div>

          <button type="submit" className="login-button">
            LOGIN
          </button>

          <div className="options">
            <p className="not-registered">
              New User? <Link to="/">Register Now</Link>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;


