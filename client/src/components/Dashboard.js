import React, { useState, useEffect } from "react";
import { getStudents, getSummaryReport } from "../services/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEntries: 0,
    avgMarks: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, reportRes] = await Promise.all([
        getStudents(),
        getSummaryReport(),
      ]);

      const students = studentsRes.data;
      const report = reportRes.data;

      const totalMarks = report.reduce(
        (sum, student) => sum + student.total_marks,
        0,
      );
      const avgMarks =
        students.length > 0 ? (totalMarks / students.length).toFixed(2) : 0;

      setStats({
        totalStudents: students.length,
        totalEntries: report.length,
        avgMarks,
      });

      setRecentStudents(students.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "8px", color: "#2c3e50" }}>📊 Internal Marks Dashboard</h2>
        <p style={{ fontSize: "16px", color: "#7f8c8d" }}>Comprehensive system for calculating internal marks across 9 activity components</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="stat-card" style={{ padding: "25px" }}>
          <h3 style={{ fontSize: "42px", margin: "0 0 10px 0", color: "#667eea" }}>{stats.totalStudents}</h3>
          <p style={{ margin: 0, fontSize: "16px", color: "#666" }}>Total Students Registered</p>
        </div>
        <div
          className="stat-card"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            padding: "25px"
          }}
        >
          <h3 style={{ fontSize: "42px", margin: "0 0 10px 0" }}>{stats.totalEntries}</h3>
          <p style={{ margin: 0, fontSize: "16px" }}>Total Activity Entries</p>
        </div>
        <div
          className="stat-card"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            padding: "25px"
          }}
        >
          <h3 style={{ fontSize: "42px", margin: "0 0 10px 0" }}>{stats.avgMarks}</h3>
          <p style={{ margin: 0, fontSize: "16px" }}>Average Marks Achieved</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#2c3e50", borderBottom: "3px solid #667eea", paddingBottom: "10px" }}>📋 Activity Components & Marks Allocation</h3>
        <div className="grid-2" style={{ gap: "15px" }}>
          <div className="component-item" style={{ padding: "15px", background: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #667eea" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>1️⃣ Community Service</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>School/NGO/Industry workshops & coding sessions (Team of max 3)</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#667eea" }}>Max: 40 marks</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#fff8e1", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>2️⃣ Patent Filing & Prototyping</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Prototype + Patent filing + IPM cell publication OR Tech transfer</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#f57c00" }}>Max: 240 marks (Full FA)</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#e8f5e9", borderRadius: "8px", borderLeft: "4px solid #4caf50" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>3️⃣ Scopus-Indexed Papers</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Conference/Journal publications with institute students & faculty</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#2e7d32" }}>Max: 240 marks (Full FA)</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#fce4ec", borderRadius: "8px", borderLeft: "4px solid #e91e63" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>4️⃣ Project Competitions</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Participation/Winning at NIRF institutions or Industry projects</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#c2185b" }}>Max: 100 marks</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#e1f5fe", borderRadius: "8px", borderLeft: "4px solid #03a9f4" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>5️⃣ Hackathons & Contests</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>College/NIRF/Industry/Government hackathons (Participation/Winning)</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#0277bd" }}>Max: 240 marks (Full FA)</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#f3e5f5", borderRadius: "8px", borderLeft: "4px solid #9c27b0" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>6️⃣ Workshops & Seminars</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Attending workshops/seminars at Top 200 NIRF institutions</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#7b1fa2" }}>Max: 20 marks</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#fff3e0", borderRadius: "8px", borderLeft: "4px solid #ff9800" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>7️⃣ Online Courses & Certifications</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>MOOC (Coursera, Udemy) & NPTEL courses (4/8 weeks)</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#e65100" }}>Max: 80 marks</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#e0f2f1", borderRadius: "8px", borderLeft: "4px solid #009688" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>8️⃣ Entrepreneurship Activities</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Udyam registration, DPIIT recognition, Funding/Incubation</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#00695c" }}>Max: 240 marks (Full FA)</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#ffebee", borderRadius: "8px", borderLeft: "4px solid #f44336" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>9️⃣ Coding Competitions</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>HackerRank, CodeChef, LeetCode (Semester-wise scoring)</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#c62828" }}>Max: 120 marks</p>
          </div>
          <div className="component-item" style={{ padding: "15px", background: "#ede7f6", borderRadius: "8px", borderLeft: "4px solid #673ab7" }}>
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>🔟 Minor Projects</h4>
            <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "#666" }}>Unique projects for Industry/NGO/Community</p>
            <p style={{ margin: 0, fontWeight: "600", color: "#4527a0" }}>Max: 160 marks</p>
          </div>
        </div>
        
        <div style={{ marginTop: "20px", padding: "15px", background: "#e3f2fd", borderRadius: "8px", borderLeft: "4px solid #2196f3" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
            <strong>💡 Note:</strong> Full FA (Formative Assessment) components are worth 240 marks each. Only the <strong>highest scoring</strong> Full FA component counts toward your total marks.
          </p>
        </div>
      </div>

      {recentStudents.length > 0 && (
        <div className="card">
          <h3>Recent Students</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Semester</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_name}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.semester}</td>
                  <td>{student.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
