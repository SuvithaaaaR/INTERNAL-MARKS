import React, { useState, useEffect } from "react";
import {
  getCommunityService,
  createCommunityService,
  deleteCommunityService,
} from "../../services/api";
import { toast } from "react-toastify";

const CommunityServiceForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: "workshop",
    organization_name: "",
    activity_description: "",
    team_size: 1,
    date_conducted: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getCommunityService(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunityService({ ...formData, student_id: studentId });
      toast.success("Entry added successfully!");
      setShowForm(false);
      setFormData({
        activity_type: "workshop",
        organization_name: "",
        activity_description: "",
        team_size: 1,
        date_conducted: "",
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
        await deleteCommunityService(id);
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
            marginBottom: "15px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, marginBottom: "5px" }}>Community Service Related to Course</h3>
            <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
              School/NGO/Industry Engagement - Workshops, Coding Sessions (Team of max 3 members) | Max: 40 marks
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "+ Add Entry"}
          </button>
        </div>
        
        <div style={{ background: "#f0f7ff", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" }}>
          <strong>📝 Instructions:</strong> Add details of workshops, coding sessions, or training programs conducted at schools, NGOs, or industries. Maximum team size is 3 members. Each valid entry awards 40 marks.
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
            <div className="form-row">
              <div className="form-group">
                <label>Activity Type *</label>
                <select
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleChange}
                  required
                >
                  <option value="workshop">Workshop/Training Program</option>
                  <option value="coding_session">Coding Session</option>
                  <option value="awareness_program">Awareness Program</option>
                  <option value="skill_development">Skill Development</option>
                </select>
                <small style={{ color: "#666", fontSize: "12px" }}>Type of activity conducted</small>
              </div>
              <div className="form-group">
                <label>Organization Name *</label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  placeholder="e.g., ABC Public School, Chennai"
                  required
                />
                <small style={{ color: "#666", fontSize: "12px" }}>Full name of School/NGO/Industry</small>
              </div>
            </div>

            <div className="form-group">
              <label>Activity Description *</label>
              <textarea
                name="activity_description"
                value={formData.activity_description}
                onChange={handleChange}
                placeholder="Provide detailed description: Topics covered, duration, number of participants, impact created..."
                rows="4"
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>Describe what was taught/conducted and its impact</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Team Size * <span style={{ color: "#e74c3c", fontSize: "12px" }}>(Max 3 for 40 marks)</span></label>
                <input
                  type="number"
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
                <small style={{ color: "#666", fontSize: "12px" }}>Number of team members (1-3 eligible for full marks)</small>
              </div>
              <div className="form-group">
                <label>Date Conducted *</label>
                <input
                  type="date"
                  name="date_conducted"
                  value={formData.date_conducted}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
                <small style={{ color: "#666", fontSize: "12px" }}>Date when activity was conducted</small>
              </div>
            </div>

            <div className="form-group">
              <label>Proof Document (URL/Path) *</label>
              <input
                type="text"
                name="proof_document"
                value={formData.proof_document}
                onChange={handleChange}
                placeholder="https://drive.google.com/... or certificate number"
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>Certificate/Letter from organization (Google Drive link recommended)</small>
            </div>

            <button type="submit" className="btn btn-success" style={{ width: "100%", padding: "12px", fontSize: "16px", fontWeight: "600" }}>
              ✓ Submit Entry
            </button>
          </form>
        )}

        <div style={{ borderTop: "2px solid #e0e0e0", paddingTop: "20px", marginTop: "20px" }}>
          <h4 style={{ marginBottom: "15px" }}>📋 Submitted Entries ({entries.length})</h4>
          {entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", background: "#f9f9f9", borderRadius: "8px" }}>
              <p style={{ color: "#999", margin: 0 }}>No entries yet. Click "Add Entry" to submit your first activity.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="entry-card" style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, color: "#333" }}>{entry.organization_name}</h4>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span className="marks-badge" style={{ background: entry.marks_awarded > 0 ? "#d4edda" : "#f8d7da", color: entry.marks_awarded > 0 ? "#155724" : "#721c24" }}>
                      {entry.marks_awarded} marks
                    </span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: "4px 12px", fontSize: "12px" }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
                <div className="entry-details" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                  <div>
                    <strong style={{ color: "#666", fontSize: "12px" }}>Activity Type:</strong>
                    <div style={{ color: "#333" }}>{entry.activity_type}</div>
                  </div>
                  <div>
                    <strong style={{ color: "#666", fontSize: "12px" }}>Team Size:</strong>
                    <div style={{ color: "#333" }}>{entry.team_size} members</div>
                  </div>
                  <div>
                    <strong style={{ color: "#666", fontSize: "12px" }}>Date Conducted:</strong>
                    <div style={{ color: "#333" }}>{new Date(entry.date_conducted).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ marginTop: "12px" }}>
                  <strong style={{ color: "#666", fontSize: "12px" }}>Description:</strong>
                  <p style={{ margin: "5px 0", color: "#555", fontSize: "14px" }}>
                    {entry.activity_description}
                  </p>
                </div>
                {entry.proof_document && (
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#888" }}>
                    <strong style={{ color: "#666" }}>Proof:</strong> <a href={entry.proof_document} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>{entry.proof_document}</a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityServiceForm;