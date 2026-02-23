import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Students
export const getStudents = () => api.get("/students");
export const getStudent = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const searchStudents = (term) => api.get(`/students/search/${term}`);

// Community Service
export const getCommunityService = (studentId) =>
  api.get(`/community-service/student/${studentId}`);
export const createCommunityService = (data) =>
  api.post("/community-service", data);
export const updateCommunityService = (id, data) =>
  api.put(`/community-service/${id}`, data);
export const deleteCommunityService = (id) =>
  api.delete(`/community-service/${id}`);

// Patents
export const getPatents = (studentId) =>
  api.get(`/patents/student/${studentId}`);
export const createPatent = (data) => api.post("/patents", data);
export const updatePatent = (id, data) => api.put(`/patents/${id}`, data);
export const deletePatent = (id) => api.delete(`/patents/${id}`);

// Scopus Papers
export const getScopusPapers = (studentId) =>
  api.get(`/scopus/student/${studentId}`);
export const createScopusPaper = (data) => api.post("/scopus", data);
export const updateScopusPaper = (id, data) => api.put(`/scopus/${id}`, data);
export const deleteScopusPaper = (id) => api.delete(`/scopus/${id}`);

// Project Competitions
export const getProjectCompetitions = (studentId) =>
  api.get(`/project-competitions/student/${studentId}`);
export const createProjectCompetition = (data) =>
  api.post("/project-competitions", data);
export const updateProjectCompetition = (id, data) =>
  api.put(`/project-competitions/${id}`, data);
export const deleteProjectCompetition = (id) =>
  api.delete(`/project-competitions/${id}`);

// Hackathons
export const getHackathons = (studentId) =>
  api.get(`/hackathons/student/${studentId}`);
export const createHackathon = (data) => api.post("/hackathons", data);
export const updateHackathon = (id, data) => api.put(`/hackathons/${id}`, data);
export const deleteHackathon = (id) => api.delete(`/hackathons/${id}`);

// Workshops
export const getWorkshops = (studentId) =>
  api.get(`/workshops/student/${studentId}`);
export const createWorkshop = (data) => api.post("/workshops", data);
export const updateWorkshop = (id, data) => api.put(`/workshops/${id}`, data);
export const deleteWorkshop = (id) => api.delete(`/workshops/${id}`);

// Online Courses
export const getOnlineCourses = (studentId) =>
  api.get(`/online-courses/student/${studentId}`);
export const createOnlineCourse = (data) => api.post("/online-courses", data);
export const updateOnlineCourse = (id, data) =>
  api.put(`/online-courses/${id}`, data);
export const deleteOnlineCourse = (id) => api.delete(`/online-courses/${id}`);

// Entrepreneurship
export const getEntrepreneurship = (studentId) =>
  api.get(`/entrepreneurship/student/${studentId}`);
export const createEntrepreneurship = (data) =>
  api.post("/entrepreneurship", data);
export const updateEntrepreneurship = (id, data) =>
  api.put(`/entrepreneurship/${id}`, data);
export const deleteEntrepreneurship = (id) =>
  api.delete(`/entrepreneurship/${id}`);

// Coding Platforms
export const getCodingPlatforms = (studentId) =>
  api.get(`/coding-platforms/student/${studentId}`);
export const createCodingPlatform = (data) =>
  api.post("/coding-platforms", data);
export const updateCodingPlatform = (id, data) =>
  api.put(`/coding-platforms/${id}`, data);
export const deleteCodingPlatform = (id) =>
  api.delete(`/coding-platforms/${id}`);

// Minor Projects
export const getMinorProjects = (studentId) =>
  api.get(`/minor-projects/student/${studentId}`);
export const createMinorProject = (data) => api.post("/minor-projects", data);
export const updateMinorProject = (id, data) =>
  api.put(`/minor-projects/${id}`, data);
export const deleteMinorProject = (id) => api.delete(`/minor-projects/${id}`);

// Calculations
export const getCalculations = (studentId) =>
  api.get(`/calculations/${studentId}`);
export const getSummaryReport = () => api.get("/calculations/report/summary");

export default api;
