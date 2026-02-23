import React, { useState, useEffect } from "react";
import { getSummaryReport } from "../services/api";
import { toast } from "react-toastify";

const Reports = () => {
  const [report, setReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState("all");

  useEffect(() => {
    fetchReport();
  }, []);

  useEffect(() => {
    if (semesterFilter === "all") {
      setFilteredReport(report);
    } else {
      setFilteredReport(
        report.filter((s) => s.semester === parseInt(semesterFilter)),
      );
    }
  }, [semesterFilter, report]);

  const fetchReport = async () => {
    try {
      const response = await getSummaryReport();
      setReport(response.data);
      setFilteredReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load report");
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Name",
      "Roll Number",
      "Semester",
      "Department",
      "Community Service",
      "Patent",
      "Scopus",
      "Competition",
      "Hackathon",
      "Workshop",
      "Course",
      "Entrepreneurship",
      "Coding",
      "Projects",
      "Full FA Marks",
      "Total Marks",
    ];

    const csvData = filteredReport.map((student) => [
      student.student_name,
      student.roll_number,
      student.semester,
      student.department || "",
      student.community_service_marks,
      student.patent_marks,
      student.scopus_marks,
      student.competition_marks,
      student.hackathon_marks,
      student.workshop_marks,
      student.course_marks,
      student.entrepreneurship_marks,
      student.coding_marks,
      student.project_marks,
      student.full_fa_marks,
      student.total_marks,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `internal_marks_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      <div className="page-header">
        <h2>Reports</h2>
        <p>View and export marks summary</p>
      </div>

      <div className="action-bar">
        <div>
          <label style={{ marginRight: "10px" }}>Filter by Semester:</label>
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
          >
            <option value="all">All Semesters</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
          </select>
        </div>
        <button className="btn btn-success" onClick={exportToCSV}>
          Export to CSV
        </button>
      </div>

      {filteredReport.length === 0 ? (
        <div className="empty-state">
          <h3>No data available</h3>
          <p>Add students and their entries to generate reports</p>
        </div>
      ) : (
        <div className="card" style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Sem</th>
                <th>Dept</th>
                <th>Community</th>
                <th>Patent</th>
                <th>Scopus</th>
                <th>Competition</th>
                <th>Hackathon</th>
                <th>Workshop</th>
                <th>Course</th>
                <th>Startup</th>
                <th>Coding</th>
                <th>Projects</th>
                <th>Full FA</th>
                <th style={{ fontWeight: "bold", color: "#007bff" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredReport.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_name}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.semester}</td>
                  <td>{student.department || "-"}</td>
                  <td>{student.community_service_marks}</td>
                  <td>{student.patent_marks}</td>
                  <td>{student.scopus_marks}</td>
                  <td>{student.competition_marks}</td>
                  <td>{student.hackathon_marks}</td>
                  <td>{student.workshop_marks}</td>
                  <td>{student.course_marks}</td>
                  <td>{student.entrepreneurship_marks}</td>
                  <td>{student.coding_marks}</td>
                  <td>{student.project_marks}</td>
                  <td>
                    <strong>{student.full_fa_marks}</strong>
                  </td>
                  <td>
                    <strong style={{ color: "#007bff" }}>
                      {student.total_marks}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reports;
