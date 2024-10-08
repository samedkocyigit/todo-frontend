import React, { useState } from "react";
import { login } from "../../services/authService";
import { useUserContext } from "../../store/UserContext";
import { useNavigate } from "react-router-dom";
import "../../styles/css/Login.css";

const Login = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useUserContext();

  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/auth/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(userData);
      const user = {
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.user.token,
        userId: response.data.user.userId,
      };

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      setError("Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="header">Login</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
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
            Login
          </button>
          <h2 className="h2">Not a member?</h2>
          <span
            className="login-link"
            onClick={goToRegister}
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
          >
            Register
          </span>
        </form>
      </div>
    </div>
  );
};

export default Login;
