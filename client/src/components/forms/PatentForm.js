import React, { useState, useEffect } from "react";
import { getPatents, createPatent, deletePatent } from "../../services/api";
import { toast } from "react-toastify";

const PatentForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patent_type: "filed",
    patent_title: "",
    application_number: "",
    filing_date: "",
    status: "filed",
    prototype_developed: false,
    technology_transfer: false,
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getPatents(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatent({ ...formData, student_id: studentId });
      toast.success("Patent entry added successfully!");
      setShowForm(false);
      setFormData({
        patent_type: "filed",
        patent_title: "",
        application_number: "",
        filing_date: "",
        status: "filed",
        prototype_developed: false,
        technology_transfer: false,
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
        await deletePatent(id);
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
          <h3>Patent Filing & Prototyping (Max: 240 marks - Full FA)</h3>
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
          • Requirements: Prototype Development + Patent Filing + IPM Cell
          Publication
          <br />
          • OR Technology Transfer/Commercialization
          <br />• All requirements met: 240 marks (Full FA)
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
              <label>Patent Title *</label>
              <input
                type="text"
                name="patent_title"
                value={formData.patent_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Patent Type *</label>
                <select
                  name="patent_type"
                  value={formData.patent_type}
                  onChange={handleChange}
                  required
                >
                  <option value="filed">Filed</option>
                  <option value="published">Published</option>
                  <option value="granted">Granted</option>
                </select>
              </div>
              <div className="form-group">
                <label>Application Number</label>
                <input
                  type="text"
                  name="application_number"
                  value={formData.application_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Filing Date *</label>
                <input
                  type="date"
                  name="filing_date"
                  value={formData.filing_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="filed">Filed</option>
                  <option value="under_review">Under Review</option>
                  <option value="published">Published</option>
                  <option value="granted">Granted</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="prototype_developed"
                    checked={formData.prototype_developed}
                    onChange={handleChange}
                    id="prototype"
                  />
                  <label htmlFor="prototype" style={{ marginBottom: 0 }}>
                    Working Prototype Developed (240 marks)
                  </label>
                </div>
              </div>
              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="technology_transfer"
                    checked={formData.technology_transfer}
                    onChange={handleChange}
                    id="transfer"
                  />
                  <label htmlFor="transfer" style={{ marginBottom: 0 }}>
                    Technology Transfer/Commercialization (240 marks)
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
                placeholder="Certificate, acknowledgement, or file link"
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
                      <h4 style={{ margin: 0 }}>{entry.patent_title}</h4>
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
                        <strong>Type:</strong> {entry.patent_type}
                      </div>
                      <div>
                        <strong>Application:</strong>{" "}
                        {entry.application_number || "N/A"}
                      </div>
                      <div>
                        <strong>Filing Date:</strong> {entry.filing_date}
                      </div>
                      <div>
                        <strong>Status:</strong> {entry.status}
                      </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      {entry.prototype_developed && (
                        <span
                          className="badge badge-primary"
                          style={{ marginRight: "8px" }}
                        >
                          Prototype Developed
                        </span>
                      )}
                      {entry.technology_transfer && (
                        <span className="badge badge-primary">
                          Technology Transfer
                        </span>
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

export default PatentForm;
