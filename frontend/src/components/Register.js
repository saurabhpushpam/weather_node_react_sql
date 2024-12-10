import React, { useEffect, useState } from "react";
import axios from "axios";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);

      if (response.status === 200) {

        toast.success("Registration successful!");
        setFormData({ username: "", email: "", password: "" });
        navigate("/login");
      } else {
        console.log(response.data);
        toast.error(response.data.msg || "An error occurred. Please try again.");
        setFormData({ username: "", email: "", password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Registration failed. Please try again.");
      setFormData({ username: "", email: "", password: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <div className="icon-container">
        <FaUserCircle size={100} color="#fff" />
      </div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>

        <div className="input-group">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Name"
          />
          <FaUserCircle className="input-icon" />
        </div>

        <div className="input-group">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
          />
          <FaEnvelope className="input-icon" />
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
          />
          <FaLock className="input-icon" />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="already-registered">
        Already registered? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
