// Updated Certifications.jsx with PDF generation & preview

import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import Footer from "../../components/Footer";
import "../../styles/personnel-style.css";
import {
  FaDownload,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import courseContent from "../../data/courseContent";

const Certifications = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [userName] = useState("Personnel User"); // Replace with stored name later

  useEffect(() => {
    const certs = JSON.parse(localStorage.getItem("certificates") || "{}");
    const results = JSON.parse(localStorage.getItem("assessmentResults") || "{}");

    const completed = Object.keys(certs)
      .filter((id) => certs[id])
      .map((id) => {
        const course = courseContent[id];
        const finalKey = `${id}-final`;
        const finished = results[finalKey]?.date || "-";

        return {
          id,
          title: course?.title || `Course ${id}`,
          dateCompleted: finished.split("T")[0] || "-",
        };
      });

    setCompletedCourses(completed);
  }, []);


// ------------------------
// CERTIFICATE HANDLER - using sample PDF file
// ------------------------
const openSamplePDF = (course) => {
  window.open(`/public/lessons/1/certificate.pdf`, "_blank");
};

  // --------------------------------------------
  // OPTIONAL: REAL PDF GENERATOR (kept for later)
  // --------------------------------------------
  const generatePDF = (course) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(28);
    doc.text("Certificate of Completion", 80, 40);

    doc.setFontSize(18);
    doc.text("This certifies that", 120, 60);

    doc.setFontSize(26);
    doc.text(userName, 110, 80);

    doc.setFontSize(18);
    doc.text("has successfully completed", 110, 100);

    doc.setFontSize(22);
    doc.text(course.title, 90, 120);

    doc.setFontSize(16);
    doc.text(`Date Completed: ${course.dateCompleted}`, 110, 140);

    doc.save(`${course.id}_certificate.pdf`);
  };

  return (
    <Layout>
      <div className="content">
        <h1 className="page-title">Certifications</h1>

        {/* Medical Licenses */}
        <div className="section">
          <h3>Medical Licenses</h3>
          <div className="card-list">
            <div className="gray-card">
              <p className="title">Registered Nurse (RN) License</p>
              <p className="subtitle">License No. / Expiration</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>
            <div className="gray-card">
              <p className="title">Dentist License</p>
              <p className="subtitle">License No. / Expiration</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>
            <div className="gray-card">
              <p className="title">Medical Technologist License</p>
              <p className="subtitle">License No./ Expiration</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>
            <div className="gray-card">
              <p className="title">Pharmacist License</p>
              <p className="subtitle">License No. / Expiration</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>
            <div className="gray-card">
              <p className="title">Physical & Occupational Therapist License</p>
              <p className="subtitle">License No. / Expiration</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>
          </div>
          <button className="btn-outline small">
            <FaPlus /> Add License
          </button>
        </div>

        {/* Advanced Certifications */}
        <div className="section">
          <h3>Advanced Certifications</h3>
          <div className="card-list">
            <div className="gray-card">
              <p className="title">PALS</p>
              <span className="status active">
                <FaCheckCircle /> Active
              </span>
            </div>

            <div className="gray-card">
              <p className="title">ACLS</p>
              <span className="status expired">
                <FaTimesCircle /> Expired
              </span>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="section">
          <h3>Completed Courses</h3>

          {completedCourses.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No completed courses yet.</p>
          ) : (
            <table className="cert-table">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Course</th>
                  <th style={{ width: "25%" }}>Date Completed</th>
                  <th style={{ width: "25%" }}>Certificate</th>
                </tr>
              </thead>

              <tbody>
                {completedCourses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.title}</td>
                    <td>{c.dateCompleted}</td>
                    <td>
                      <button
                        className="btn-download"
                        onClick={() => openSamplePDF(c)} // ← uses sample PDF
                      >
                        <FaDownload /> Download
                      </button>

                      {/* For real generated PDF, swap above with: */}
                      {/* <button className="btn-download" onClick={() => generatePDF(c)}>Generate</button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Other Certifications */}
        <div className="section">
          <h3>Other Certifications</h3>
          <div className="gray-card clickable">
            <FaPlus /> <span>Add Certification</span>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default Certifications;
