import React, { useState, useEffect } from "react";
import {
  getOnlineCourses,
  createOnlineCourse,
  deleteOnlineCourse,
} from "../../services/api";
import { toast } from "react-toastify";

const OnlineCourseForm = ({ studentId, onSuccess }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_type: "mooc",
    course_name: "",
    platform: "",
    duration_weeks: 4,
    completion_date: "",
    certificate_number: "",
    proof_document: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getOnlineCourses(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOnlineCourse({ ...formData, student_id: studentId });
      toast.success("Online course entry added successfully!");
      setShowForm(false);
      setFormData({
        course_type: "mooc",
        course_name: "",
        platform: "",
        duration_weeks: 4,
        completion_date: "",
        certificate_number: "",
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
        await deleteOnlineCourse(id);
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
          <h3>Online Courses & Certifications (Max: 80 marks)</h3>
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
          <strong>Marks:</strong> MOOC: 20 | NPTEL 4-week: 40 | NPTEL 8-week: 80
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
                <label>Course Type *</label>
                <select
                  name="course_type"
                  value={formData.course_type}
                  onChange={handleChange}
                  required
                >
                  <option value="mooc">
                    MOOC (Coursera, Udemy, etc.) - 20 marks
                  </option>
                  <option value="nptel_4week">
                    NPTEL 4-week Course - 40 marks
                  </option>
                  <option value="nptel_8week">
                    NPTEL 8-week+ Course - 80 marks
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>Platform *</label>
                <input
                  type="text"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  placeholder="e.g., NPTEL, Coursera, Udemy"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Course Name *</label>
              <input
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration (weeks) *</label>
                <input
                  type="number"
                  name="duration_weeks"
                  value={formData.duration_weeks}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Completion Date *</label>
                <input
                  type="date"
                  name="completion_date"
                  value={formData.completion_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Certificate Number</label>
                <input
                  type="text"
                  name="certificate_number"
                  value={formData.certificate_number}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Proof Document (link)</label>
                <input
                  type="text"
                  name="proof_document"
                  value={formData.proof_document}
                  onChange={handleChange}
                  placeholder="Certificate link or file path"
                />
              </div>
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
                  <h4>{entry.course_name}</h4>
                  <div className="entry-details">
                    <div>
                      <strong>Platform:</strong> {entry.platform}
                    </div>
                    <div>
                      <strong>Type:</strong> {entry.course_type}
                    </div>
                    <div>
                      <strong>Duration:</strong> {entry.duration_weeks} weeks
                    </div>
                    <div>
                      <strong>Completed:</strong> {entry.completion_date}
                    </div>
                    {entry.certificate_number && (
                      <div>
                        <strong>Certificate:</strong> {entry.certificate_number}
                      </div>
                    )}
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

export default OnlineCourseForm;
