import React, { useState, useEffect } from "react";
import {
  getHackathons,
  createHackathon,
  deleteHackathon,
} from "../../services/api";
import { toast } from "react-toastify";

const HackathonForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hackathon_name: "",
    organizer: "",
    hackathon_type: "inter_intra_college",
    nirf_rank: "",
    result: "participated",
    organized_by_industry: false,
    date_participated: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getHackathons(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createHackathon({ ...formData, student_id: studentId });
      toast.success("Hackathon entry added successfully!");
      setShowForm(false);
      setFormData({
        hackathon_name: "",
        organizer: "",
        hackathon_type: "inter_intra_college",
        nirf_rank: "",
        result: "participated",
        organized_by_industry: false,
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
        await deleteHackathon(id);
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
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
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
          <h3>Hackathons & Contests (Max: Full FA marks - 240)</h3>
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
          • Participated (Inter/Intra College): 20 marks
          <br />
          • Participated (Top 200 NIRF Institution): 80 marks
          <br />
          • Won/Awarded: 160 marks
          <br />• Won (Industry/Government Organized): 240 marks (Full FA)
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
              <label>Hackathon Name *</label>
              <input
                type="text"
                name="hackathon_name"
                value={formData.hackathon_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Organizer *</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Institution, Company, or Organization"
                  required
                />
              </div>
              <div className="form-group">
                <label>Hackathon Type *</label>
                <select
                  name="hackathon_type"
                  value={formData.hackathon_type}
                  onChange={handleChange}
                  required
                >
                  <option value="inter_intra_college">
                    Inter/Intra College (20 marks)
                  </option>
                  <option value="nirf_top_200">
                    Top 200 NIRF Institution (80 marks)
                  </option>
                  <option value="industry">
                    Industry/Government (160-240 marks)
                  </option>
                </select>
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label>Result *</label>
                <select
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  required
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
                <label>Date Participated *</label>
                <input
                  type="date"
                  name="date_participated"
                  value={formData.date_participated}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <div className="checkbox-group" style={{ marginTop: "30px" }}>
                  <input
                    type="checkbox"
                    name="organized_by_industry"
                    checked={formData.organized_by_industry}
                    onChange={handleChange}
                    id="industry_org"
                  />
                  <label htmlFor="industry_org" style={{ marginBottom: 0 }}>
                    Organized by Industry/Government (240 marks if won)
                  </label>
                </div>
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
                      <h4 style={{ margin: 0 }}>{entry.hackathon_name}</h4>
                      <div
                        style={{
                          background: "#28a745",
                          color: "white",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        ✅ {entry.marks_awarded} Marks Awarded
                      </div>
                    </div>
                    <div className="entry-details">
                      <div>
                        <strong>Organizer:</strong> {entry.organizer}
                      </div>
                      <div>
                        <strong>Type:</strong> {entry.hackathon_type}
                      </div>
                      {entry.nirf_rank && (
                        <div>
                          <strong>NIRF Rank:</strong> {entry.nirf_rank}
                        </div>
                      )}
                      <div>
                        <strong>Result:</strong> {entry.result}
                      </div>
                      <div>
                        <strong>Date:</strong> {entry.date_participated}
                      </div>
                    </div>
                    {entry.organized_by_industry && (
                      <span
                        className="badge badge-primary"
                        style={{ marginTop: "8px" }}
                      >
                        Industry/Government Organized
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(entry.id)}
                    style={{ marginLeft: "15px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonForm;
