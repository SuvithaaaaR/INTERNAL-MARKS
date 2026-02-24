import React, { useState, useEffect } from "react";
import {
  getCodingPlatforms,
  createCodingPlatform,
  deleteCodingPlatform,
} from "../../services/api";
import { toast } from "react-toastify";

const CodingPlatformForm = ({ studentId, onSuccess, canDelete = true }) => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    platform: "hackerrank",
    score_rating: "",
    problems_solved: "",
    acceptance_rate: "",
    date_achieved: "",
    profile_link: "",
    screenshot: "",
  });

  useEffect(() => {
    fetchEntries();
  }, [studentId]);

  const fetchEntries = async () => {
    try {
      const response = await getCodingPlatforms(studentId);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCodingPlatform({ ...formData, student_id: studentId });
      toast.success("Coding platform entry added successfully!");
      setShowForm(false);
      setFormData({
        platform: "hackerrank",
        score_rating: "",
        problems_solved: "",
        acceptance_rate: "",
        date_achieved: "",
        profile_link: "",
        screenshot: "",
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
        await deleteCodingPlatform(id);
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
          <h3>Coding Competitions & Platform Scores (Max: 120 marks)</h3>
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
          <strong>Marks Allocation (Semester-wise):</strong>
          <br />
          <strong>HackerRank:</strong>
          <br />
          • Sem 2: 200-400 HackOS → 20-40 marks | Sem 3: 500-2000 HackOS → 40-80
          marks | Sem 4: 2500-5000 HackOS → 80-120 marks
          <br />
          <strong>CodeChef (Sem 3+):</strong>
          <br />
          • Rating 200-800 → 20 marks | 800-1400 → 40 marks | 1400-2000 → 80
          marks | 2000-2600 → 120 marks
          <br />
          <strong>LeetCode (Sem 3+):</strong>
          <br />• 2-50 problems → 20 marks | 50-100 → 40 marks | 100-150 → 80
          marks | 150-250 → 120 marks
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
                <label>Platform *</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                >
                  <option value="hackerrank">HackerRank (HackOS)</option>
                  <option value="codechef">CodeChef (Rating)</option>
                  <option value="leetcode">LeetCode (Problems Solved)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date Achieved *</label>
                <input
                  type="date"
                  name="date_achieved"
                  value={formData.date_achieved}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {formData.platform === "hackerrank" && (
              <div className="form-group">
                <label>HackOS Score *</label>
                <input
                  type="number"
                  name="score_rating"
                  value={formData.score_rating}
                  onChange={handleChange}
                  placeholder="e.g., 2500"
                  required
                />
              </div>
            )}

            {formData.platform === "codechef" && (
              <div className="form-group">
                <label>CodeChef Rating *</label>
                <input
                  type="number"
                  name="score_rating"
                  value={formData.score_rating}
                  onChange={handleChange}
                  placeholder="e.g., 1800"
                  required
                />
              </div>
            )}

            {formData.platform === "leetcode" && (
              <div className="form-row">
                <div className="form-group">
                  <label>Problems Solved *</label>
                  <input
                    type="number"
                    name="problems_solved"
                    value={formData.problems_solved}
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Acceptance Rate (%)</label>
                  <input
                    type="number"
                    name="acceptance_rate"
                    value={formData.acceptance_rate}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    step="0.1"
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Profile Link</label>
                <input
                  type="text"
                  name="profile_link"
                  value={formData.profile_link}
                  onChange={handleChange}
                  placeholder="Your profile URL"
                />
              </div>
              <div className="form-group">
                <label>Screenshot/Proof</label>
                <input
                  type="text"
                  name="screenshot"
                  value={formData.screenshot}
                  onChange={handleChange}
                  placeholder="Screenshot link or file path"
                />
              </div>
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
                      <h4 style={{ margin: 0 }}>
                        {entry.platform.toUpperCase()}
                      </h4>
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
                      {entry.platform === "leetcode" ? (
                        <>
                          <div>
                            <strong>Problems Solved:</strong>{" "}
                            {entry.problems_solved}
                          </div>
                          {entry.acceptance_rate && (
                            <div>
                              <strong>Acceptance Rate:</strong>{" "}
                              {entry.acceptance_rate}%
                            </div>
                          )}
                        </>
                      ) : (
                        <div>
                          <strong>Score/Rating:</strong> {entry.score_rating}
                        </div>
                      )}
                      <div>
                        <strong>Date:</strong> {entry.date_achieved}
                      </div>
                      {entry.profile_link && (
                        <div>
                          <strong>Profile:</strong>{" "}
                          <a
                            href={entry.profile_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </div>
                      )}
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

export default CodingPlatformForm;
