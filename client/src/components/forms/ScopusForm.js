import React, { useState, useEffect } from "react";
import {
  getScopusPapers,
  createScopusPaper,
  deleteScopusPaper,
} from "../../services/api";
import { toast } from "react-toastify";

const ScopusForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    paper_title: "",
    publication_type: "conference",
    journal_conference_name: "",
    publication_date: "",
    scopus_indexed: true,
    co_authors: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getScopusPapers(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createScopusPaper({ ...formData, student_id: studentId });
      toast.success("Scopus paper entry added successfully!");
      setShowForm(false);
      setFormData({
        paper_title: "",
        publication_type: "conference",
        journal_conference_name: "",
        publication_date: "",
        scopus_indexed: true,
        co_authors: "",
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
        await deleteScopusPaper(id);
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
          <h3>Scopus-Indexed Papers (Max: Full FA marks - 240)</h3>
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
          • Scopus-Indexed Conference/Journal Publication: 240 marks (Full FA)
          <br />
          • Must be indexed in Scopus database
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
              <label>Paper Title *</label>
              <input
                type="text"
                name="paper_title"
                value={formData.paper_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Publication Type *</label>
                <select
                  name="publication_type"
                  value={formData.publication_type}
                  onChange={handleChange}
                  required
                >
                  <option value="conference">Conference</option>
                  <option value="journal">Journal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Journal/Conference Name *</label>
                <input
                  type="text"
                  name="journal_conference_name"
                  value={formData.journal_conference_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Publication Date *</label>
                <input
                  type="date"
                  name="publication_date"
                  value={formData.publication_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <div className="checkbox-group" style={{ marginTop: "30px" }}>
                  <input
                    type="checkbox"
                    name="scopus_indexed"
                    checked={formData.scopus_indexed}
                    onChange={handleChange}
                    id="scopus_indexed"
                  />
                  <label htmlFor="scopus_indexed" style={{ marginBottom: 0 }}>
                    Scopus Indexed (240 marks)
                  </label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Co-Authors (comma-separated)</label>
              <input
                type="text"
                name="co_authors"
                value={formData.co_authors}
                onChange={handleChange}
                placeholder="e.g., Dr. John Doe, Dr. Jane Smith, Student Name"
              />
            </div>

            <div className="form-group">
              <label>Proof Document</label>
              <input
                type="text"
                name="proof_document"
                value={formData.proof_document}
                onChange={handleChange}
                placeholder="Publication certificate, DOI, or link"
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
                    <h4 style={{ margin: 0 }}>{entry.paper_title}</h4>
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
                      <strong>Type:</strong> {entry.publication_type}
                    </div>
                    <div>
                      <strong>Venue:</strong> {entry.journal_conference_name}
                    </div>
                    <div>
                      <strong>Date:</strong> {entry.publication_date}
                    </div>
                  </div>
                  {entry.co_authors && (
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <strong>Co-authors:</strong> {entry.co_authors}
                    </p>
                  )}
                  {entry.scopus_indexed && (
                    <span
                      className="badge badge-primary"
                      style={{ marginTop: "8px" }}
                    >
                      Scopus Indexed
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

export default ScopusForm;
