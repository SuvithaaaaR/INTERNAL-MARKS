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
        evaluationData,
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
        <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
          Staff Evaluation Dashboard
        </h2>

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
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>Evaluated</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>
              <strong>Activity Type:</strong>
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>
              <strong>Filter:</strong>
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="pending">Pending Only</option>
              <option value="all">All Entries</option>
            </select>
          </div>
        </div>

        {/* Entries List */}
        <div>
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#333",
              fontSize: "20px",
              borderBottom: "2px solid #e9ecef",
              paddingBottom: "10px",
            }}
          >
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
              <div
                key={entry.id}
                className="entry-card"
                style={{
                  marginBottom: "15px",
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          color: "#333",
                        }}
                      >
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
                            padding: "5px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ✓ Evaluated
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "#ffc107",
                            color: "#000",
                            padding: "5px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ⏳ Pending
                        </span>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "10px",
                        fontSize: "14px",
                        color: "#555",
                        marginBottom: "15px",
                        paddingBottom: "15px",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      <div>
                        <strong>Student:</strong>{" "}
                        {getStudentName(entry.student_id)} (
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
                              <strong>Evaluated By:</strong>{" "}
                              {entry.staff_evaluated_by}
                            </div>
                          )}
                          {entry.staff_evaluated_at && (
                            <div>
                              <strong>Evaluated On:</strong>{" "}
                              {new Date(
                                entry.staff_evaluated_at,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Detailed Activity Information */}
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "15px",
                        borderRadius: "6px",
                        marginBottom: "10px",
                      }}
                    >
                      <h5
                        style={{
                          marginTop: 0,
                          marginBottom: "12px",
                          color: "#1976d2",
                        }}
                      >
                        📋 Entry Details
                      </h5>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                          gap: "12px",
                          fontSize: "14px",
                        }}
                      >
                        {/* Hackathons */}
                        {activityType === "hackathons" && (
                          <>
                            {entry.organizer && (
                              <div>
                                <strong>Organizer:</strong> {entry.organizer}
                              </div>
                            )}
                            {entry.hackathon_type && (
                              <div>
                                <strong>Type:</strong>{" "}
                                {entry.hackathon_type
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            )}
                            {entry.nirf_rank && (
                              <div>
                                <strong>NIRF Rank:</strong> {entry.nirf_rank}
                              </div>
                            )}
                            {entry.result && (
                              <div>
                                <strong>Result:</strong>{" "}
                                <span
                                  style={{
                                    color:
                                      entry.result === "won"
                                        ? "#28a745"
                                        : "#666",
                                  }}
                                >
                                  {entry.result.toUpperCase()}
                                </span>
                              </div>
                            )}
                            {entry.organized_by_industry !== undefined && (
                              <div>
                                <strong>Industry Organized:</strong>{" "}
                                {entry.organized_by_industry ? "Yes" : "No"}
                              </div>
                            )}
                            {entry.date_participated && (
                              <div>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  entry.date_participated,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </>
                        )}

                        {/* Online Courses */}
                        {activityType === "online-courses" && (
                          <>
                            {entry.platform && (
                              <div>
                                <strong>Platform:</strong> {entry.platform}
                              </div>
                            )}
                            {entry.course_duration && (
                              <div>
                                <strong>Duration:</strong>{" "}
                                {entry.course_duration} weeks
                              </div>
                            )}
                            {entry.completion_date && (
                              <div>
                                <strong>Completed:</strong>{" "}
                                {new Date(
                                  entry.completion_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.certificate_number && (
                              <div>
                                <strong>Certificate #:</strong>{" "}
                                {entry.certificate_number}
                              </div>
                            )}
                          </>
                        )}

                        {/* Minor Projects */}
                        {activityType === "minor-projects" && (
                          <>
                            {entry.problem_statement && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Problem Statement:</strong>
                                <p
                                  style={{ margin: "5px 0 0 0", color: "#666" }}
                                >
                                  {entry.problem_statement}
                                </p>
                              </div>
                            )}
                            {entry.technologies_used && (
                              <div>
                                <strong>Technologies:</strong>{" "}
                                {entry.technologies_used}
                              </div>
                            )}
                            {entry.project_duration && (
                              <div>
                                <strong>Duration:</strong>{" "}
                                {entry.project_duration} months
                              </div>
                            )}
                            {entry.team_size && (
                              <div>
                                <strong>Team Size:</strong> {entry.team_size}
                              </div>
                            )}
                            {entry.project_description && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Description:</strong>
                                <p
                                  style={{ margin: "5px 0 0 0", color: "#666" }}
                                >
                                  {entry.project_description}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Project Competitions */}
                        {activityType === "project-competitions" && (
                          <>
                            {entry.organizer && (
                              <div>
                                <strong>Organizer:</strong> {entry.organizer}
                              </div>
                            )}
                            {entry.project_theme && (
                              <div>
                                <strong>Theme:</strong> {entry.project_theme}
                              </div>
                            )}
                            {entry.prize_won && (
                              <div>
                                <strong>Prize:</strong>{" "}
                                <span style={{ color: "#28a745" }}>
                                  {entry.prize_won}
                                </span>
                              </div>
                            )}
                            {entry.team_size && (
                              <div>
                                <strong>Team Size:</strong> {entry.team_size}
                              </div>
                            )}
                            {entry.date_participated && (
                              <div>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  entry.date_participated,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </>
                        )}

                        {/* Workshops */}
                        {activityType === "workshops" && (
                          <>
                            {entry.organizer && (
                              <div>
                                <strong>Organizer:</strong> {entry.organizer}
                              </div>
                            )}
                            {entry.workshop_type && (
                              <div>
                                <strong>Type:</strong>{" "}
                                {entry.workshop_type
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            )}
                            {entry.duration_days && (
                              <div>
                                <strong>Duration:</strong> {entry.duration_days}{" "}
                                days
                              </div>
                            )}
                            {entry.date_attended && (
                              <div>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  entry.date_attended,
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </>
                        )}

                        {/* Community Service */}
                        {activityType === "community-service" && (
                          <>
                            {entry.activity_type && (
                              <div>
                                <strong>Activity Type:</strong>{" "}
                                {entry.activity_type}
                              </div>
                            )}
                            {entry.team_size && (
                              <div>
                                <strong>Team Size:</strong> {entry.team_size}
                              </div>
                            )}
                            {entry.date_conducted && (
                              <div>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  entry.date_conducted,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.activity_description && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Description:</strong>
                                <p
                                  style={{ margin: "5px 0 0 0", color: "#666" }}
                                >
                                  {entry.activity_description}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Patents */}
                        {activityType === "patents" && (
                          <>
                            {entry.patent_type && (
                              <div>
                                <strong>Type:</strong>{" "}
                                {entry.patent_type
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            )}
                            {entry.application_number && (
                              <div>
                                <strong>Application #:</strong>{" "}
                                {entry.application_number}
                              </div>
                            )}
                            {entry.application_status && (
                              <div>
                                <strong>Status:</strong>{" "}
                                {entry.application_status
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            )}
                            {entry.filing_date && (
                              <div>
                                <strong>Filed:</strong>{" "}
                                {new Date(
                                  entry.filing_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.technology_transfer && (
                              <div>
                                <strong>Tech Transfer:</strong>{" "}
                                {entry.technology_transfer ? "Yes" : "No"}
                              </div>
                            )}
                            {entry.technology_description && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Description:</strong>
                                <p
                                  style={{ margin: "5px 0 0 0", color: "#666" }}
                                >
                                  {entry.technology_description}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Scopus Papers */}
                        {activityType === "scopus" && (
                          <>
                            {entry.journal_name && (
                              <div>
                                <strong>Journal:</strong> {entry.journal_name}
                              </div>
                            )}
                            {entry.publication_date && (
                              <div>
                                <strong>Published:</strong>{" "}
                                {new Date(
                                  entry.publication_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.scopus_indexed !== undefined && (
                              <div>
                                <strong>Scopus Indexed:</strong>{" "}
                                <span
                                  style={{
                                    color: entry.scopus_indexed
                                      ? "#28a745"
                                      : "#666",
                                  }}
                                >
                                  {entry.scopus_indexed ? "Yes ✓" : "No"}
                                </span>
                              </div>
                            )}
                            {entry.doi_link && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>DOI:</strong>{" "}
                                <a
                                  href={entry.doi_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#1976d2" }}
                                >
                                  {entry.doi_link}
                                </a>
                              </div>
                            )}
                          </>
                        )}

                        {/* Entrepreneurship */}
                        {activityType === "entrepreneurship" && (
                          <>
                            {entry.registration_type && (
                              <div>
                                <strong>Registration:</strong>{" "}
                                {entry.registration_type
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </div>
                            )}
                            {entry.registration_number && (
                              <div>
                                <strong>Registration #:</strong>{" "}
                                {entry.registration_number}
                              </div>
                            )}
                            {entry.registration_date && (
                              <div>
                                <strong>Registered:</strong>{" "}
                                {new Date(
                                  entry.registration_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.incubation_status && (
                              <div>
                                <strong>Incubated:</strong>{" "}
                                <span style={{ color: "#28a745" }}>Yes ✓</span>
                              </div>
                            )}
                            {entry.business_description && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Description:</strong>
                                <p
                                  style={{ margin: "5px 0 0 0", color: "#666" }}
                                >
                                  {entry.business_description}
                                </p>
                              </div>
                            )}
                          </>
                        )}

                        {/* Coding Platforms */}
                        {activityType === "coding-platforms" && (
                          <>
                            {entry.contest_name && (
                              <div>
                                <strong>Contest:</strong> {entry.contest_name}
                              </div>
                            )}
                            {entry.rank_achieved && (
                              <div>
                                <strong>Rank:</strong>{" "}
                                <span
                                  style={{
                                    color: "#1976d2",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {entry.rank_achieved}
                                </span>
                              </div>
                            )}
                            {entry.score && (
                              <div>
                                <strong>Score:</strong> {entry.score}
                              </div>
                            )}
                            {entry.contest_date && (
                              <div>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  entry.contest_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {entry.profile_link && (
                              <div style={{ gridColumn: "1 / -1" }}>
                                <strong>Profile:</strong>{" "}
                                <a
                                  href={entry.profile_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#1976d2" }}
                                >
                                  {entry.profile_link}
                                </a>
                              </div>
                            )}
                          </>
                        )}

                        {/* Proof Document */}
                        {entry.proof_document && (
                          <div
                            style={{
                              gridColumn: "1 / -1",
                              marginTop: "8px",
                              paddingTop: "8px",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            <strong>📎 Proof Document:</strong>{" "}
                            <a
                              href={entry.proof_document}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "underline",
                              }}
                            >
                              View Document
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Staff Evaluation Comments */}
                    {entry.staff_evaluated && entry.staff_comments && (
                      <div
                        style={{
                          background: "#e8f5e9",
                          padding: "12px",
                          borderRadius: "6px",
                          marginTop: "10px",
                        }}
                      >
                        <strong style={{ color: "#2e7d32" }}>
                          ✓ Staff Comments:
                        </strong>
                        <p style={{ margin: "5px 0 0 0", color: "#1b5e20" }}>
                          {entry.staff_comments}
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => handleEvaluate(entry)}
                    style={{
                      marginLeft: "15px",
                      whiteSpace: "nowrap",
                      alignSelf: "flex-start",
                      flexShrink: 0,
                    }}
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
            padding: "20px",
          }}
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              margin: "0 auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Evaluate Entry</h3>

            {/* Student Info */}
            <div
              style={{
                marginBottom: "15px",
                padding: "15px",
                background: "#e3f2fd",
                borderRadius: "6px",
                border: "1px solid #90caf9",
              }}
            >
              <p style={{ margin: "0 0 5px 0" }}>
                <strong>Student:</strong>{" "}
                {getStudentName(selectedEntry.student_id)} (
                {getStudentRollNumber(selectedEntry.student_id)})
              </p>
              <p style={{ margin: "0" }}>
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

            {/* Detailed Entry Information */}
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                background: "#f8f9fa",
                borderRadius: "6px",
                border: "1px solid #dee2e6",
              }}
            >
              <h4
                style={{ marginTop: 0, marginBottom: "12px", color: "#1976d2" }}
              >
                📋 Complete Entry Details
              </h4>
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                  fontSize: "14px",
                }}
              >
                {/* Hackathons */}
                {activityType === "hackathons" && (
                  <>
                    {selectedEntry.organizer && (
                      <p style={{ margin: 0 }}>
                        <strong>Organizer:</strong> {selectedEntry.organizer}
                      </p>
                    )}
                    {selectedEntry.hackathon_type && (
                      <p style={{ margin: 0 }}>
                        <strong>Type:</strong>{" "}
                        {selectedEntry.hackathon_type
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    )}
                    {selectedEntry.nirf_rank && (
                      <p style={{ margin: 0 }}>
                        <strong>NIRF Rank:</strong> {selectedEntry.nirf_rank}
                      </p>
                    )}
                    {selectedEntry.result && (
                      <p style={{ margin: 0 }}>
                        <strong>Result:</strong>{" "}
                        <span
                          style={{
                            color:
                              selectedEntry.result === "won"
                                ? "#28a745"
                                : "#666",
                            fontWeight: "bold",
                          }}
                        >
                          {selectedEntry.result.toUpperCase()}
                        </span>
                      </p>
                    )}
                    {selectedEntry.organized_by_industry !== undefined && (
                      <p style={{ margin: 0 }}>
                        <strong>Industry Organized:</strong>{" "}
                        {selectedEntry.organized_by_industry ? "Yes" : "No"}
                      </p>
                    )}
                    {selectedEntry.date_participated && (
                      <p style={{ margin: 0 }}>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          selectedEntry.date_participated,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}

                {/* Online Courses */}
                {activityType === "online-courses" && (
                  <>
                    {selectedEntry.platform && (
                      <p style={{ margin: 0 }}>
                        <strong>Platform:</strong> {selectedEntry.platform}
                      </p>
                    )}
                    {selectedEntry.course_duration && (
                      <p style={{ margin: 0 }}>
                        <strong>Duration:</strong>{" "}
                        {selectedEntry.course_duration} weeks
                      </p>
                    )}
                    {selectedEntry.completion_date && (
                      <p style={{ margin: 0 }}>
                        <strong>Completed:</strong>{" "}
                        {new Date(
                          selectedEntry.completion_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.certificate_number && (
                      <p style={{ margin: 0 }}>
                        <strong>Certificate #:</strong>{" "}
                        {selectedEntry.certificate_number}
                      </p>
                    )}
                  </>
                )}

                {/* Minor Projects */}
                {activityType === "minor-projects" && (
                  <>
                    {selectedEntry.problem_statement && (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <strong>Problem Statement:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {selectedEntry.problem_statement}
                        </p>
                      </div>
                    )}
                    {selectedEntry.technologies_used && (
                      <p style={{ margin: 0 }}>
                        <strong>Technologies:</strong>{" "}
                        {selectedEntry.technologies_used}
                      </p>
                    )}
                    {selectedEntry.project_duration && (
                      <p style={{ margin: 0 }}>
                        <strong>Duration:</strong>{" "}
                        {selectedEntry.project_duration} months
                      </p>
                    )}
                    {selectedEntry.team_size && (
                      <p style={{ margin: 0 }}>
                        <strong>Team Size:</strong> {selectedEntry.team_size}
                      </p>
                    )}
                    {selectedEntry.project_description && (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <strong>Description:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {selectedEntry.project_description}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Project Competitions */}
                {activityType === "project-competitions" && (
                  <>
                    {selectedEntry.organizer && (
                      <p style={{ margin: 0 }}>
                        <strong>Organizer:</strong> {selectedEntry.organizer}
                      </p>
                    )}
                    {selectedEntry.project_theme && (
                      <p style={{ margin: 0 }}>
                        <strong>Theme:</strong> {selectedEntry.project_theme}
                      </p>
                    )}
                    {selectedEntry.prize_won && (
                      <p style={{ margin: 0 }}>
                        <strong>Prize:</strong>{" "}
                        <span style={{ color: "#28a745", fontWeight: "bold" }}>
                          {selectedEntry.prize_won}
                        </span>
                      </p>
                    )}
                    {selectedEntry.team_size && (
                      <p style={{ margin: 0 }}>
                        <strong>Team Size:</strong> {selectedEntry.team_size}
                      </p>
                    )}
                    {selectedEntry.date_participated && (
                      <p style={{ margin: 0 }}>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          selectedEntry.date_participated,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}

                {/* Workshops */}
                {activityType === "workshops" && (
                  <>
                    {selectedEntry.organizer && (
                      <p style={{ margin: 0 }}>
                        <strong>Organizer:</strong> {selectedEntry.organizer}
                      </p>
                    )}
                    {selectedEntry.workshop_type && (
                      <p style={{ margin: 0 }}>
                        <strong>Type:</strong>{" "}
                        {selectedEntry.workshop_type
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    )}
                    {selectedEntry.duration_days && (
                      <p style={{ margin: 0 }}>
                        <strong>Duration:</strong> {selectedEntry.duration_days}{" "}
                        days
                      </p>
                    )}
                    {selectedEntry.date_attended && (
                      <p style={{ margin: 0 }}>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          selectedEntry.date_attended,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}

                {/* Community Service */}
                {activityType === "community-service" && (
                  <>
                    {selectedEntry.activity_type && (
                      <p style={{ margin: 0 }}>
                        <strong>Activity Type:</strong>{" "}
                        {selectedEntry.activity_type}
                      </p>
                    )}
                    {selectedEntry.team_size && (
                      <p style={{ margin: 0 }}>
                        <strong>Team Size:</strong> {selectedEntry.team_size}
                      </p>
                    )}
                    {selectedEntry.date_conducted && (
                      <p style={{ margin: 0 }}>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          selectedEntry.date_conducted,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.activity_description && (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <strong>Description:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {selectedEntry.activity_description}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Patents */}
                {activityType === "patents" && (
                  <>
                    {selectedEntry.patent_type && (
                      <p style={{ margin: 0 }}>
                        <strong>Type:</strong>{" "}
                        {selectedEntry.patent_type
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    )}
                    {selectedEntry.application_number && (
                      <p style={{ margin: 0 }}>
                        <strong>Application #:</strong>{" "}
                        {selectedEntry.application_number}
                      </p>
                    )}
                    {selectedEntry.application_status && (
                      <p style={{ margin: 0 }}>
                        <strong>Status:</strong>{" "}
                        {selectedEntry.application_status
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    )}
                    {selectedEntry.filing_date && (
                      <p style={{ margin: 0 }}>
                        <strong>Filed:</strong>{" "}
                        {new Date(
                          selectedEntry.filing_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.technology_transfer && (
                      <p style={{ margin: 0 }}>
                        <strong>Tech Transfer:</strong>{" "}
                        <span style={{ color: "#28a745" }}>Yes ✓</span>
                      </p>
                    )}
                    {selectedEntry.technology_description && (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <strong>Description:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {selectedEntry.technology_description}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Scopus Papers */}
                {activityType === "scopus" && (
                  <>
                    {selectedEntry.journal_name && (
                      <p style={{ margin: 0 }}>
                        <strong>Journal:</strong> {selectedEntry.journal_name}
                      </p>
                    )}
                    {selectedEntry.publication_date && (
                      <p style={{ margin: 0 }}>
                        <strong>Published:</strong>{" "}
                        {new Date(
                          selectedEntry.publication_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.scopus_indexed !== undefined && (
                      <p style={{ margin: 0 }}>
                        <strong>Scopus Indexed:</strong>{" "}
                        <span
                          style={{
                            color: selectedEntry.scopus_indexed
                              ? "#28a745"
                              : "#666",
                            fontWeight: "bold",
                          }}
                        >
                          {selectedEntry.scopus_indexed ? "Yes ✓" : "No"}
                        </span>
                      </p>
                    )}
                    {selectedEntry.doi_link && (
                      <p style={{ margin: 0 }}>
                        <strong>DOI:</strong>{" "}
                        <a
                          href={selectedEntry.doi_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2" }}
                        >
                          {selectedEntry.doi_link}
                        </a>
                      </p>
                    )}
                  </>
                )}

                {/* Entrepreneurship */}
                {activityType === "entrepreneurship" && (
                  <>
                    {selectedEntry.registration_type && (
                      <p style={{ margin: 0 }}>
                        <strong>Registration:</strong>{" "}
                        {selectedEntry.registration_type
                          .replace(/_/g, " ")
                          .toUpperCase()}
                      </p>
                    )}
                    {selectedEntry.registration_number && (
                      <p style={{ margin: 0 }}>
                        <strong>Registration #:</strong>{" "}
                        {selectedEntry.registration_number}
                      </p>
                    )}
                    {selectedEntry.registration_date && (
                      <p style={{ margin: 0 }}>
                        <strong>Registered:</strong>{" "}
                        {new Date(
                          selectedEntry.registration_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.incubation_status && (
                      <p style={{ margin: 0 }}>
                        <strong>Incubated:</strong>{" "}
                        <span style={{ color: "#28a745" }}>Yes ✓</span>
                      </p>
                    )}
                    {selectedEntry.business_description && (
                      <div
                        style={{
                          background: "#fff",
                          padding: "10px",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <strong>Description:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {selectedEntry.business_description}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Coding Platforms */}
                {activityType === "coding-platforms" && (
                  <>
                    {selectedEntry.contest_name && (
                      <p style={{ margin: 0 }}>
                        <strong>Contest:</strong> {selectedEntry.contest_name}
                      </p>
                    )}
                    {selectedEntry.rank_achieved && (
                      <p style={{ margin: 0 }}>
                        <strong>Rank:</strong>{" "}
                        <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                          {selectedEntry.rank_achieved}
                        </span>
                      </p>
                    )}
                    {selectedEntry.score && (
                      <p style={{ margin: 0 }}>
                        <strong>Score:</strong> {selectedEntry.score}
                      </p>
                    )}
                    {selectedEntry.contest_date && (
                      <p style={{ margin: 0 }}>
                        <strong>Date:</strong>{" "}
                        {new Date(
                          selectedEntry.contest_date,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {selectedEntry.profile_link && (
                      <p style={{ margin: 0 }}>
                        <strong>Profile:</strong>{" "}
                        <a
                          href={selectedEntry.profile_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2" }}
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </>
                )}

                {/* Proof Document */}
                {selectedEntry.proof_document && (
                  <div
                    style={{
                      marginTop: "10px",
                      paddingTop: "10px",
                      borderTop: "2px solid #dee2e6",
                    }}
                  >
                    <strong>📎 Proof Document:</strong>{" "}
                    <a
                      href={selectedEntry.proof_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        fontWeight: "bold",
                      }}
                    >
                      View/Download Document
                    </a>
                  </div>
                )}
              </div>
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
                  style={{ width: "100%" }}
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
                  style={{ width: "100%", resize: "vertical" }}
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
                  style={{ width: "100%" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                  marginTop: "25px",
                }}
              >
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSelectedEntry(null)}
                  style={{ background: "#666", color: "white" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ background: "#28a745", color: "white" }}
                >
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
