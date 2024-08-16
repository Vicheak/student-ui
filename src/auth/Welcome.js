import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const onLogout = () => {
    localStorage.removeItem("credentials");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const onLogin = () => {
    navigate("/login");
  };

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <div>Welcome!</div>
      </div>
      <div className={"buttonContainer"}>
        {!isLoggedIn ? (
          <input
            className={"inputButton"}
            type="button"
            onClick={onLogin}
            value="Login"
          />
        ) : (
          <input
            className={"inputButton inputBtnClose"}
            type="button"
            onClick={onLogout}
            value="Logout"
          />
        )}
      </div>
    </div>
  );
};

export default Welcome;
