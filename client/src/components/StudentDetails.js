import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStudent, getCalculations } from "../services/api";
import { toast } from "react-toastify";

// Import all component forms
import CommunityServiceForm from "./forms/CommunityServiceForm";
import PatentForm from "./forms/PatentForm";
import ScopusForm from "./forms/ScopusForm";
import ProjectCompetitionForm from "./forms/ProjectCompetitionForm";
import HackathonForm from "./forms/HackathonForm";
import WorkshopForm from "./forms/WorkshopForm";
import OnlineCourseForm from "./forms/OnlineCourseForm";
import EntrepreneurshipForm from "./forms/EntrepreneurshipForm";
import CodingPlatformForm from "./forms/CodingPlatformForm";
import MinorProjectForm from "./forms/MinorProjectForm";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [calculations, setCalculations] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const [studentRes, calcRes] = await Promise.all([
        getStudent(id),
        getCalculations(id),
      ]);
      setStudent(studentRes.data);
      setCalculations(calcRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student data:", error);
      toast.error("Failed to load student data");
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchStudentData();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container">
        <div className="alert alert-danger">Student not found</div>
      </div>
    );
  }

  const components = [
    { id: "summary", name: "Summary", component: null },
    {
      id: "community",
      name: "Community Service",
      component: CommunityServiceForm,
    },
    { id: "patent", name: "Patent Filing", component: PatentForm },
    { id: "scopus", name: "Scopus Papers", component: ScopusForm },
    {
      id: "project",
      name: "Project Competition",
      component: ProjectCompetitionForm,
    },
    { id: "hackathon", name: "Hackathons", component: HackathonForm },
    { id: "workshop", name: "Workshops", component: WorkshopForm },
    { id: "course", name: "Online Courses", component: OnlineCourseForm },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship",
      component: EntrepreneurshipForm,
    },
    { id: "coding", name: "Coding Platforms", component: CodingPlatformForm },
    { id: "minor", name: "Minor Projects", component: MinorProjectForm },
  ];

  return (
    <div className="container">
      <div className="card">
        <h2>{student.student_name}</h2>
        <div className="grid-2" style={{ marginTop: "20px" }}>
          <div className="info-item">
            <label>Roll Number</label>
            <span>{student.roll_number}</span>
          </div>
          <div className="info-item">
            <label>Semester</label>
            <span>{student.semester}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{student.email || "-"}</span>
          </div>
          <div className="info-item">
            <label>Department</label>
            <span>{student.department || "-"}</span>
          </div>
        </div>
      </div>

      <div className="tabs">
        {components.map((comp) => (
          <button
            key={comp.id}
            className={`tab ${activeTab === comp.id ? "active" : ""}`}
            onClick={() => setActiveTab(comp.id)}
          >
            {comp.name}
          </button>
        ))}
      </div>

      {activeTab === "summary" && calculations && (
        <div>
          <div className="summary-card">
            <h3>
              Total Marks:{" "}
              <span className="marks-badge">{calculations.totalMarks}</span>
            </h3>

            <div style={{ marginTop: "20px" }}>
              <div className="summary-item">
                <span>1. Community Service</span>
                <span className="marks-badge">
                  {calculations.breakdown.communityService.capped} /{" "}
                  {calculations.breakdown.communityService.cap}
                </span>
              </div>

              <div className="summary-item">
                <span>
                  2-4, 7. Full FA Marks (Best of
                  Patent/Scopus/Competition/Hackathon/Entrepreneurship)
                </span>
                <span className="marks-badge">
                  {calculations.breakdown.fullFAMarks.total} / 240
                </span>
              </div>

              <div className="summary-item">
                <span>5. Workshops & Seminars</span>
                <span className="marks-badge">
                  {calculations.breakdown.workshops.capped} /{" "}
                  {calculations.breakdown.workshops.cap}
                </span>
              </div>

              <div className="summary-item">
                <span>6. Online Courses</span>
                <span className="marks-badge">
                  {calculations.breakdown.onlineCourses.capped} /{" "}
                  {calculations.breakdown.onlineCourses.cap}
                </span>
              </div>

              <div className="summary-item">
                <span>8. Coding Platforms</span>
                <span className="marks-badge">
                  {calculations.breakdown.codingPlatforms.capped} /{" "}
                  {calculations.breakdown.codingPlatforms.cap}
                </span>
              </div>

              <div className="summary-item">
                <span>9. Minor Projects</span>
                <span className="marks-badge">
                  {calculations.breakdown.minorProjects.capped} /{" "}
                  {calculations.breakdown.minorProjects.cap}
                </span>
              </div>

              <div className="summary-item total">
                <span>TOTAL MARKS</span>
                <span>{calculations.totalMarks}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }} className="card">
            <h3>Detailed Breakdown</h3>

            <h4 style={{ marginTop: "20px", color: "#666" }}>
              Patent Filing: {calculations.breakdown.patentFiling.total} marks
            </h4>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {calculations.breakdown.patentFiling.entries.length} entries
            </p>

            <h4 style={{ marginTop: "15px", color: "#666" }}>
              Scopus Papers: {calculations.breakdown.scopusPapers.total} marks
            </h4>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {calculations.breakdown.scopusPapers.entries.length} entries
            </p>

            <h4 style={{ marginTop: "15px", color: "#666" }}>
              Project Competitions:{" "}
              {calculations.breakdown.projectCompetitions.total} marks
            </h4>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {calculations.breakdown.projectCompetitions.entries.length}{" "}
              entries
            </p>

            <h4 style={{ marginTop: "15px", color: "#666" }}>
              Hackathons: {calculations.breakdown.hackathons.total} marks
            </h4>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {calculations.breakdown.hackathons.entries.length} entries
            </p>

            <h4 style={{ marginTop: "15px", color: "#666" }}>
              Entrepreneurship: {calculations.breakdown.entrepreneurship.total}{" "}
              marks
            </h4>
            <p style={{ fontSize: "14px", color: "#888" }}>
              {calculations.breakdown.entrepreneurship.entries.length} entries
            </p>
          </div>
        </div>
      )}

      {activeTab === "community" && (
        <CommunityServiceForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "patent" && (
        <PatentForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "scopus" && (
        <ScopusForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "project" && (
        <ProjectCompetitionForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "hackathon" && (
        <HackathonForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "workshop" && (
        <WorkshopForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "course" && (
        <OnlineCourseForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "entrepreneurship" && (
        <EntrepreneurshipForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "coding" && (
        <CodingPlatformForm studentId={id} onSuccess={refreshData} />
      )}
      {activeTab === "minor" && (
        <MinorProjectForm studentId={id} onSuccess={refreshData} />
      )}
    </div>
  );
};

export default StudentDetails;
