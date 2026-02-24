import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import StudentDetails from "./components/StudentDetails";
import Reports from "./components/Reports";
import StaffEvaluation from "./components/StaffEvaluation";

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <h1>Internal Marks Calculator</h1>
            </div>
            <ul className="nav-menu">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/students">Students</Link>
              </li>
              <li>
                <Link to="/staff-evaluation">Staff Evaluation</Link>
              </li>
              <li>
                <Link to="/reports">Reports</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetails />} />
            <Route path="/staff-evaluation" element={<StaffEvaluation />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2026 Internal Marks Calculator System</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
