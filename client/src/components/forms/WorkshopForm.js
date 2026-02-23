import React, { useState, useEffect } from "react";
import {
  getWorkshops,
  createWorkshop,
  deleteWorkshop,
} from "../../services/api";
import { toast } from "react-toastify";

const WorkshopForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_type: "workshop",
    event_name: "",
    institution_name: "",
    nirf_rank: "",
    date_attended: "",
    duration_days: 1,
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getWorkshops(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWorkshop({ ...formData, student_id: studentId });
      toast.success("Workshop/Seminar entry added successfully!");
      setShowForm(false);
      setFormData({
        event_type: "workshop",
        event_name: "",
        institution_name: "",
        nirf_rank: "",
        date_attended: "",
        duration_days: 1,
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
        await deleteWorkshop(id);
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
          <h3>Workshops & Seminars (Max: 20 marks)</h3>
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
          <strong>Marks:</strong> Attending at Top 200 NIRF Institutions: 20
          marks
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
                <label>Event Type *</label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleChange}
                  required
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                  <option value="conference">Conference</option>
                  <option value="fdp">FDP (Faculty Development Program)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Institution Name *</label>
                <input
                  type="text"
                  name="institution_name"
                  value={formData.institution_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>NIRF Rank (≤200 for 20 marks)</label>
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
                <label>Date Attended *</label>
                <input
                  type="date"
                  name="date_attended"
                  value={formData.date_attended}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  name="duration_days"
                  value={formData.duration_days}
                  onChange={handleChange}
                  min="1"
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
                placeholder="Certificate or attendance proof"
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
                  <h4>{entry.event_name}</h4>
                  <div className="entry-details">
                    <div>
                      <strong>Type:</strong> {entry.event_type}
                    </div>
                    <div>
                      <strong>Institution:</strong> {entry.institution_name}
                    </div>
                    {entry.nirf_rank && (
                      <div>
                        <strong>NIRF Rank:</strong> {entry.nirf_rank}
                      </div>
                    )}
                    <div>
                      <strong>Duration:</strong> {entry.duration_days} day(s)
                    </div>
                    <div>
                      <strong>Date:</strong> {entry.date_attended}
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

export default WorkshopForm;
