import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudents, createStudent, deleteStudent } from "../services/api";
import { toast } from "react-toastify";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    student_name: "",
    roll_number: "",
    semester: 2,
    email: "",
    department: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.student_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.roll_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
      setFilteredStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(formData);
      toast.success("Student added successfully!");
      setShowModal(false);
      setFormData({
        student_name: "",
        roll_number: "",
        semester: 2,
        email: "",
        department: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error(error.response?.data?.error || "Failed to add student");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student? All related entries will be deleted.",
      )
    ) {
      try {
        await deleteStudent(id);
        toast.success("Student deleted successfully!");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Students Management</h2>
        <p>Manage student records and entries</p>
      </div>

      <div className="action-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Student
        </button>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="empty-state">
          <h3>No students found</h3>
          <p>Add your first student to get started</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Student
          </button>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Semester</th>
                <th>Email</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.student_name}</td>
                  <td>{student.roll_number}</td>
                  <td>{student.semester}</td>
                  <td>{student.email || "-"}</td>
                  <td>{student.department || "-"}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ marginRight: "8px" }}
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Student Name *</label>
                  <input
                    type="text"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Semester *</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="2">Semester 2</option>
                    <option value="3">Semester 3</option>
                    <option value="4">Semester 4</option>
                    <option value="5">Semester 5</option>
                    <option value="6">Semester 6</option>
                    <option value="7">Semester 7</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
