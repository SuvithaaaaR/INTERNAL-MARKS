import React, { useState, useEffect } from "react";
import {
  getCommunityService,
  createCommunityService,
  deleteCommunityService,
} from "../../services/api";
import { toast } from "react-toastify";

const CommunityServiceForm = ({ studentId, onSuccess, canDelete = true }) => {
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
            marginBottom: "20px",
          }}
        >
          <h3>Community Service Related to Course (Max: 40 marks)</h3>
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
          • Conducted Workshop/Coding Session at School/NGO/Industry: 40 marks
          per entry
          <br />
          • Requirement: Team of maximum 3 members
          <br />• Must provide certificate/letter from organization
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Team Size * (Max 3)</label>
                <input
                  type="number"
                  name="team_size"
                  value={formData.team_size}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Date Conducted *</label>
                <input
                  type="date"
                  name="date_conducted"
                  value={formData.date_conducted}
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
                placeholder="Certificate URL or file link"
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
                      <h4 style={{ margin: 0 }}>{entry.organization_name}</h4>
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
                    <div className="entry-details">
                      <div>
                        <strong>Activity Type:</strong> {entry.activity_type}
                      </div>
                      <div>
                        <strong>Team Size:</strong> {entry.team_size} members
                      </div>
                      <div>
                        <strong>Date Conducted:</strong> {entry.date_conducted}
                      </div>
                      <div>
                        <strong>Description:</strong>{" "}
                        {entry.activity_description}
                      </div>
                    </div>
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

export default CommunityServiceForm;
