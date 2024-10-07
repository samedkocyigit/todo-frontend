import React, { useState } from "react";
import { register } from "../../services/authService";
import "../../styles/css/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/auth/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(userData);
      console.log("Registered successfully:", response.data);
      navigate("/auth/login");
    } catch (err) {
      setError("Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="header">Register</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div>
            <label>Email</label>
            <input
              className="input"
              type="email"
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label>Username</label>
            <input
              className="input"
              type="text"
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label>Password</label>
            <input
              className="input"
              type="password"
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <button className="button" type="submit">
            Register
          </button>
          <h2 className="h2">You already have an account?</h2>
          <span
            className="login-link"
            onClick={goToLogin}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
          >
            Login
          </span>
        </form>
      </div>
    </div>
  );
}

export default Register;
