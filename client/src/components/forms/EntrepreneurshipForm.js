import React, { useState, useEffect } from "react";
import {
  getEntrepreneurship,
  createEntrepreneurship,
  deleteEntrepreneurship,
} from "../../services/api";
import { toast } from "react-toastify";

const EntrepreneurshipForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startup_name: "",
    registration_type: "udyam",
    registration_number: "",
    registration_date: "",
    funding_secured: false,
    funding_amount: "",
    incubation_status: false,
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getEntrepreneurship(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEntrepreneurship({ ...formData, student_id: studentId });
      toast.success("Entrepreneurship entry added successfully!");
      setShowForm(false);
      setFormData({
        startup_name: "",
        registration_type: "udyam",
        registration_number: "",
        registration_date: "",
        funding_secured: false,
        funding_amount: "",
        incubation_status: false,
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
        await deleteEntrepreneurship(id);
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
          <h3>Entrepreneurship Activities (Max: Full FA marks - 240)</h3>
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
          <strong>Marks Allocation (240 marks - Full FA):</strong>
          <br />
          • Udyam Registration: 240 marks
          <br />
          • DPIIT Recognition: 240 marks
          <br />
          • Secured Funding/Incubation: 240 marks
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
                <label>Start-up Name *</label>
                <input
                  type="text"
                  name="startup_name"
                  value={formData.startup_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration Type *</label>
                <select
                  name="registration_type"
                  value={formData.registration_type}
                  onChange={handleChange}
                  required
                >
                  <option value="udyam">Udyam Registration</option>
                  <option value="dpiit">DPIIT Recognition (240 marks)</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Registration Number *</label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration Date *</label>
                <input
                  type="date"
                  name="registration_date"
                  value={formData.registration_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="funding_secured"
                    checked={formData.funding_secured}
                    onChange={handleChange}
                    id="funding"
                  />
                  <label htmlFor="funding" style={{ marginBottom: 0 }}>
                    Funding Secured (240 marks)
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Funding Amount (if applicable)</label>
                <input
                  type="number"
                  name="funding_amount"
                  value={formData.funding_amount}
                  onChange={handleChange}
                  placeholder="Amount in INR"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="incubation_status"
                  checked={formData.incubation_status}
                  onChange={handleChange}
                  id="incubation"
                />
                <label htmlFor="incubation" style={{ marginBottom: 0 }}>
                  Secured Incubation (240 marks)
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Proof Document</label>
              <input
                type="text"
                name="proof_document"
                value={formData.proof_document}
                onChange={handleChange}
                placeholder="Registration certificate or proof link"
              />
            </div>

            <button type="submit" className="btn btn-success">
              Submit Entry
            </button>
          </form>
        )}

        <div style={{ borderTop: "2px solid #e0e0e0", paddingTop: "20px", marginTop: "20px" }}>
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h4 style={{ margin: 0 }}>{entry.startup_name}</h4>
                    <div style={{ 
                      background: "#28a745", 
                      color: "white", 
                      padding: "8px 16px", 
                      borderRadius: "6px",
                      fontWeight: "bold",
                      fontSize: "16px"
                    }}>
                      ✅ {entry.marks_awarded} Marks Awarded
                    </div>
                  </div>
                  <div className="entry-details">
                    <div>
                      <strong>Type:</strong> {entry.registration_type}
                    </div>
                    <div>
                      <strong>Registration:</strong> {entry.registration_number}
                    </div>
                    <div>
                      <strong>Date:</strong> {entry.registration_date}
                    </div>
                    {entry.funding_secured && entry.funding_amount && (
                      <div>
                        <strong>Funding:</strong> ₹{entry.funding_amount}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {entry.funding_secured && (
                      <span
                        className="badge badge-primary"
                        style={{ marginRight: "8px" }}
                      >
                        Funding Secured
                      </span>
                    )}
                    {entry.incubation_status && (
                      <span className="badge badge-primary">Incubated</span>
                    )}
                  </div>
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

export default EntrepreneurshipForm;
