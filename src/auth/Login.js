import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseApi from './api';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      navigate("/view");
    }
  }, []);

  const handleLogin = () => {
    setUsernameError("");
    setPasswordError("");

    //validate
    if ("" === username) {
      setUsernameError("Please enter your username");
      return;
    }

    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    // Perform the login request
    axios
      .post(`${baseApi}auth/authenticate`, {
        username,
        password,
      })
      .then((response) => {
        // If login is successful, save the credentials
        let accessToken = response.data.accessToken; 
        let refreshToken = response.data.refreshToken; 
        const credentials = {
          username,
          accessToken,
          refreshToken
        };

        localStorage.setItem("credentials", JSON.stringify(credentials));

        console.log("Authenticated successfully!");

        setIsLoggedIn(true);
        navigate("/view");
      })
      .catch((error) => {
        setPasswordError("Invalid username or password");
      });
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <div>Login</div>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{usernameError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={"inputBox"}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={"inputContainer"}>
        <input
          className={"inputButton"}
          type="button"
          onClick={handleLogin}
          value={"Log in"}
        />
      </div>
    </div>
  );
};

export default Login;
