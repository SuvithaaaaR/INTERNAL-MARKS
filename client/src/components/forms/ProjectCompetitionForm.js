import React, { useState, useEffect } from "react";
import {
  getProjectCompetitions,
  createProjectCompetition,
  deleteProjectCompetition,
} from "../../services/api";
import { toast } from "react-toastify";

const ProjectCompetitionForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    competition_type: "participation",
    competition_name: "",
    institution_name: "",
    nirf_rank: "",
    result: "participated",
    industry_level: 0,
    date_participated: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getProjectCompetitions(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProjectCompetition({ ...formData, student_id: studentId });
      toast.success("Project competition entry added successfully!");
      setShowForm(false);
      setFormData({
        competition_type: "participation",
        competition_name: "",
        institution_name: "",
        nirf_rank: "",
        result: "participated",
        industry_level: 0,
        date_participated: "",
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
        await deleteProjectCompetition(id);
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
          <h3>Project Presentations & Competitions</h3>
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
          <strong>Marks:</strong> Participation (Top 300 NIRF): 40 | Won: 80 |
          Industry Project (Level 3-5): 160
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
              <label>Competition Name *</label>
              <input
                type="text"
                name="competition_name"
                value={formData.competition_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Competition Type *</label>
                <select
                  name="competition_type"
                  value={formData.competition_type}
                  onChange={handleChange}
                  required
                >
                  <option value="participation">Participation</option>
                  <option value="won">Won/Awarded</option>
                  <option value="industry_project">Industry Project</option>
                </select>
              </div>
              <div className="form-group">
                <label>Result</label>
                <select
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                >
                  <option value="participated">Participated</option>
                  <option value="won">Won</option>
                  <option value="runner_up">Runner Up</option>
                  <option value="finalist">Finalist</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Institution Name</label>
                <input
                  type="text"
                  name="institution_name"
                  value={formData.institution_name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>NIRF Rank (if applicable)</label>
                <input
                  type="number"
                  name="nirf_rank"
                  value={formData.nirf_rank}
                  onChange={handleChange}
                  placeholder="e.g., 150"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Industry Level (3-5 for 160 marks)</label>
                <select
                  name="industry_level"
                  value={formData.industry_level}
                  onChange={handleChange}
                >
                  <option value="0">Not Applicable</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3 (160 marks)</option>
                  <option value="4">Level 4 (160 marks)</option>
                  <option value="5">Level 5 (160 marks)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Participated *</label>
                <input
                  type="date"
                  name="date_participated"
                  value={formData.date_participated}
                  onChange={handleChange}
                  required
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
                placeholder="Certificate or participation proof"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Submit Entry
            </button>
          </form>
        )}

        <h4>Entries ({entries.length})</h4>
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
                <div>
                  <h4>{entry.competition_name}</h4>
                  <div className="entry-details">
                    <div>
                      <strong>Type:</strong> {entry.competition_type}
                    </div>
                    <div>
                      <strong>Institution:</strong>{" "}
                      {entry.institution_name || "N/A"}
                    </div>
                    <div>
                      <strong>NIRF Rank:</strong> {entry.nirf_rank || "N/A"}
                    </div>
                    <div>
                      <strong>Result:</strong> {entry.result}
                    </div>
                    {entry.industry_level > 0 && (
                      <div>
                        <strong>Industry Level:</strong> {entry.industry_level}
                      </div>
                    )}
                    <div>
                      <strong>Date:</strong> {entry.date_participated}
                    </div>
                    <div>
                      <strong>Marks:</strong>{" "}
                      <span className="badge badge-success">
                        {entry.marks_awarded}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectCompetitionForm;
