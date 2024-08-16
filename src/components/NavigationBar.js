import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NavigationBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary bg-dark"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <Link to={`/`} className="navbar-brand">
            Student Management
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to={`/`} className="nav-link">
                  Home
                </Link>
              </li>
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link to={`/view`} className="nav-link">
                      View
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/search`} className="nav-link">
                      Search
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/create`} className="nav-link">
                      Create New
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={`/chat`} className="nav-link">
                      Chat
                    </Link>
                  </li>
                </>
              )}
            </ul>
            {isLoggedIn ? (
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link to={`/login`} className="btn btn-outline-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
