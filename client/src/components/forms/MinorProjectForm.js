import React, { useState, useEffect } from "react";
import {
  getMinorProjects,
  createMinorProject,
  deleteMinorProject,
} from "../../services/api";
import { toast } from "react-toastify";

const MinorProjectForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    project_title: "",
    problem_statement: "",
    industry_ngo_community: "",
    uniqueness_score: 20,
    project_description: "",
    github_link: "",
    demo_link: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getMinorProjects(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMinorProject({ ...formData, student_id: studentId });
      toast.success("Minor project entry added successfully!");
      setShowForm(false);
      setFormData({
        project_title: "",
        problem_statement: "",
        industry_ngo_community: "",
        uniqueness_score: 20,
        project_description: "",
        github_link: "",
        demo_link: "",
        proof_document: "",
      });
      fetchEntries();
      onSuccess();
    } catch (error) {
      console.error("Error creating entry:", error);
      toast.error("Failed to add entry");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteMinorProject(id);
        toast.success("Entry deleted successfully!");
        fetchEntries();
        onSuccess();
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Failed to delete entry");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h3>Minor Projects (Max: 160 marks)</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add Entry"}
          </button>
        </div>

        <div
          style={{
            background: "#e3f2fd",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          <strong>Marks Allocation:</strong>
          <br />
          • Base Marks (Uniqueness of Problem Statement): 20 marks
          <br />
          • Industry/NGO/Community Related Problem: Eligible for base marks
          <br />• Additional marks awarded for: Innovation, Implementation
          Quality, and Impact (up to 160 marks total)
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              marginBottom: "30px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                name="project_title"
                value={formData.project_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Problem Statement *</label>
              <textarea
                name="problem_statement"
                value={formData.problem_statement}
                onChange={handleChange}
                placeholder="Describe the problem your project addresses"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Related to (Industry/NGO/Community) *</label>
                <input
                  type="text"
                  name="industry_ngo_community"
                  value={formData.industry_ngo_community}
                  onChange={handleChange}
                  placeholder="e.g., Healthcare Industry, Local NGO, Community Service"
                  required
                />
              </div>
              <div className="form-group">
                <label>Marks (Based on Uniqueness) *</label>
                <select
                  name="uniqueness_score"
                  value={formData.uniqueness_score}
                  onChange={handleChange}
                  required
                >
                  <option value="20">20 - Unique Problem</option>
                  <option value="40">40 - Unique + Good Implementation</option>
                  <option value="60">60 - Unique + Great Implementation</option>
                  <option value="80">80 - Unique + Excellent + Scalable</option>
                  <option value="100">100 - Unique + Excellent + Impact</option>
                  <option value="120">120 - Outstanding Innovation</option>
                  <option value="140">140 - Exceptional Innovation</option>
                  <option value="160">160 - Industry-Grade Solution</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Project Description *</label>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleChange}
                placeholder="Describe your project, technologies used, and its impact"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GitHub Repository Link</label>
                <input
                  type="text"
                  name="github_link"
                  value={formData.github_link}
                  onChange={handleChange}
                  placeholder="https://github.com/username/project"
                />
              </div>
              <div className="form-group">
                <label>Demo/Live Link</label>
                <input
                  type="text"
                  name="demo_link"
                  value={formData.demo_link}
                  onChange={handleChange}
                  placeholder="https://demo-link.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Proof Document</label>
              <input
                type="text"
                name="proof_document"
                value={formData.proof_document}
                onChange={handleChange}
                placeholder="Project report, presentation, or certificate link"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Submit Entry
            </button>
          </form>
        )}

        <div
          style={{
            borderTop: "2px solid #e0e0e0",
            paddingTop: "20px",
            marginTop: "20px",
          }}
        >
          <h4 style={{ marginBottom: "15px" }}>Entries ({entries.length})</h4>
          {entries.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>
              No entries yet. Add your first entry above.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="entry-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <h4 style={{ margin: 0 }}>{entry.project_title}</h4>
                      <div
                        style={{
                          background: entry.staff_evaluated
                            ? "#28a745"
                            : "#ffc107",
                          color: entry.staff_evaluated ? "white" : "#000",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        {entry.staff_evaluated ? (
                          <>✅ {entry.marks_awarded} Marks Awarded</>
                        ) : (
                          <>⏳ Pending Evaluation</>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                      <strong>Problem Statement:</strong>
                      <p style={{ color: "#666", marginTop: "4px" }}>
                        {entry.problem_statement}
                      </p>
                    </div>
                    <div className="entry-details">
                      <div>
                        <strong>Context:</strong> {entry.industry_ngo_community}
                      </div>
                      <div>
                        <strong>Uniqueness Score:</strong>{" "}
                        {entry.uniqueness_score}
                      </div>
                      {entry.github_link && (
                        <div>
                          <strong>GitHub:</strong>{" "}
                          <a
                            href={entry.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Code
                          </a>
                        </div>
                      )}
                      {entry.demo_link && (
                        <div>
                          <strong>Demo:</strong>{" "}
                          <a
                            href={entry.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Live
                          </a>
                        </div>
                      )}
                    </div>
                    <p
                      style={{
                        marginTop: "10px",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      {entry.project_description}
                    </p>
                  </div>
                  {canDelete && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(entry.id)}
                      style={{ marginLeft: "15px" }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MinorProjectForm;
