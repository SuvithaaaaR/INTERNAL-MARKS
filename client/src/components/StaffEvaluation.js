import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const StaffEvaluation = () => {
  const [activityType, setActivityType] = useState("hackathons");
  const [entries, setEntries] = useState([]);
  const [students, setStudents] = useState({});
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [evaluationData, setEvaluationData] = useState({
    marks_awarded: 0,
    staff_comments: "",
    staff_evaluated_by: "",
  });
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("pending"); // 'pending' or 'all'
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { value: "hackathons", label: "Hackathons & Contests" },
    { value: "coding_platforms", label: "Coding Platforms" },
    { value: "project_competitions", label: "Project Competitions" },
    { value: "minor_projects", label: "Minor Projects" },
    { value: "online_courses", label: "Online Courses" },
    { value: "workshops_seminars", label: "Workshops & Seminars" },
    { value: "community_service", label: "Community Service" },
    { value: "entrepreneurship", label: "Entrepreneurship" },
    { value: "patent_filing", label: "Patent Filing" },
    { value: "scopus_papers", label: "Scopus Papers" },
  ];

  useEffect(() => {
    fetchStats();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [activityType, filter]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/staff-evaluation/stats`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      const studentMap = {};
      response.data.forEach((student) => {
        studentMap[student.id] = student;
      });
      setStudents(studentMap);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const endpoint =
        filter === "pending"
          ? `${API_URL}/staff-evaluation/pending/${activityType}`
          : `${API_URL}/staff-evaluation/all/${activityType}`;
      const response = await axios.get(endpoint);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to fetch entries");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (entry) => {
    setSelectedEntry(entry);
    setEvaluationData({
      marks_awarded: entry.marks_awarded || 0,
      staff_comments: entry.staff_comments || "",
      staff_evaluated_by: "",
    });
  };

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    if (!evaluationData.staff_evaluated_by.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/staff-evaluation/evaluate/${activityType}/${selectedEntry.id}`,
        evaluationData
      );
      toast.success("Evaluation submitted successfully!");
      setSelectedEntry(null);
      setEvaluationData({
        marks_awarded: 0,
        staff_comments: "",
        staff_evaluated_by: "",
      });
      fetchEntries();
      fetchStats();
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation");
    }
  };

  const getStudentName = (studentId) => {
    return students[studentId]?.student_name || `Student ID: ${studentId}`;
  };

  const getStudentRollNumber = (studentId) => {
    return students[studentId]?.roll_number || "N/A";
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Staff Evaluation Dashboard</h2>

        {/* Statistics */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                background: "#e3f2fd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "32px", color: "#1976d2" }}>
                {stats.overall.total}
              </h3>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Total Entries
              </p>
            </div>
            <div
              style={{
                background: "#fff3cd",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "32px", color: "#f57c00" }}>
                {stats.overall.pending}
              </h3>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Pending Evaluation
              </p>
            </div>
            <div
              style={{
                background: "#d4edda",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "32px", color: "#28a745" }}>
                {stats.overall.evaluated}
              </h3>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Evaluated
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1", minWidth: "250px" }}>
            <label>
              <strong>Activity Type:</strong>
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "0 0 200px" }}>
            <label>
              <strong>Filter:</strong>
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: "100%", marginTop: "5px" }}
            >
              <option value="pending">Pending Only</option>
              <option value="all">All Entries</option>
            </select>
          </div>
        </div>

        {/* Entries List */}
        <div>
          <h3>
            {activityTypes.find((t) => t.value === activityType)?.label} (
            {entries.length})
          </h3>

          {loading ? (
            <p>Loading...</p>
          ) : entries.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
              No entries found.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="entry-card" style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                      <h4 style={{ margin: 0 }}>
                        {entry.hackathon_name ||
                          entry.course_name ||
                          entry.project_title ||
                          entry.competition_name ||
                          entry.event_name ||
                          entry.startup_name ||
                          entry.patent_title ||
                          entry.paper_title ||
                          entry.platform ||
                          entry.organization_name ||
                          "Entry"}
                      </h4>
                      {entry.staff_evaluated ? (
                        <span
                          style={{
                            background: "#28a745",
                            color: "white",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          ✓ Evaluated
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#ffc107",
                            color: "#000",
                            padding: "4px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          ⏳ Pending
                        </span>
                      )}
                    </div>

                    <div className="entry-details">
                      <div>
                        <strong>Student:</strong> {getStudentName(entry.student_id)} (
                        {getStudentRollNumber(entry.student_id)})
                      </div>
                      <div>
                        <strong>Current Marks:</strong>{" "}
                        <span
                          style={{
                            color: entry.staff_evaluated ? "#28a745" : "#666",
                            fontWeight: "bold",
                          }}
                        >
                          {entry.marks_awarded}
                        </span>
                      </div>
                      <div>
                        <strong>Submitted:</strong>{" "}
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                      {entry.staff_evaluated && (
                        <>
                          {entry.staff_evaluated_by && (
                            <div>
                              <strong>Evaluated By:</strong> {entry.staff_evaluated_by}
                            </div>
                          )}
                          {entry.staff_evaluated_at && (
                            <div>
                              <strong>Evaluated On:</strong>{" "}
                              {new Date(entry.staff_evaluated_at).toLocaleDateString()}
                            </div>
                          )}
                          {entry.staff_comments && (
                            <div>
                              <strong>Comments:</strong> {entry.staff_comments}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => handleEvaluate(entry)}
                    style={{ marginLeft: "15px" }}
                  >
                    {entry.staff_evaluated ? "Re-evaluate" : "Evaluate"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      {selectedEntry && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Evaluate Entry</h3>
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Student:</strong> {getStudentName(selectedEntry.student_id)} (
                {getStudentRollNumber(selectedEntry.student_id)})
              </p>
              <p>
                <strong>Entry:</strong>{" "}
                {selectedEntry.hackathon_name ||
                  selectedEntry.course_name ||
                  selectedEntry.project_title ||
                  selectedEntry.competition_name ||
                  selectedEntry.event_name ||
                  selectedEntry.startup_name ||
                  selectedEntry.patent_title ||
                  selectedEntry.paper_title ||
                  selectedEntry.platform ||
                  selectedEntry.organization_name ||
                  "Entry"}
              </p>
            </div>

            <form onSubmit={handleSubmitEvaluation}>
              <div className="form-group">
                <label>Marks Awarded *</label>
                <input
                  type="number"
                  value={evaluationData.marks_awarded}
                  onChange={(e) =>
                    setEvaluationData({
                      ...evaluationData,
                      marks_awarded: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="240"
                  required
                />
              </div>

              <div className="form-group">
                <label>Staff Comments/Feedback</label>
                <textarea
                  value={evaluationData.staff_comments}
                  onChange={(e) =>
                    setEvaluationData({
                      ...evaluationData,
                      staff_comments: e.target.value,
                    })
                  }
                  rows="4"
                  placeholder="Optional: Add comments about the evaluation..."
                />
              </div>

              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={evaluationData.staff_evaluated_by}
                  onChange={(e) =>
                    setEvaluationData({
                      ...evaluationData,
                      staff_evaluated_by: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSelectedEntry(null)}
                  style={{ background: "#666" }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffEvaluation;
