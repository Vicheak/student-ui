import "./style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import ListStudent from "./components/ListStudent";
import SearchStudent from "./components/SearchStudent";
import CreateNewStudent from "./components/CreateNewStudent";
import StudentDetail from "./components/StudentDetail";
import UpdateStudent from "./components/UpdateStudent";
import Welcome from "./auth/Welcome";
import Login from "./auth/Login";
import NotFound from "./components/NotFound";
import Chat from "./components/Chat";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <div>
          <NavigationBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/view" element={<ListStudent />} />
            <Route path="/search" element={<SearchStudent />} />
            <Route path="/create" element={<CreateNewStudent />} />
            <Route path="/detail/:id" element={<StudentDetail />} />
            <Route path="/update/:id" element={<UpdateStudent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
