// src/pages/Grades.jsx
import React, { useMemo, useState } from "react";
import Layout from "../layouts/Layout";
import Footer from "../components/Footer";
import courseContent from "../data/courseContent";
import "../styles/grades.css";

const COURSE_IDS = Object.keys(courseContent).sort((a, b) => Number(a) - Number(b));

const getStoredResults = () => {
  try {
    return JSON.parse(localStorage.getItem("assessmentResults")) || {};
  } catch (e) {
    return {};
  }
};

const getUnlockedModules = () => {
  try {
    return JSON.parse(localStorage.getItem("unlocked-modules")) || [];
  } catch {
    return [];
  }
};

const getCertificates = () => {
  try {
    return JSON.parse(localStorage.getItem("certificates")) || {};
  } catch {
    return {};
  }
};

const saveCertificates = (certs) => {
  localStorage.setItem("certificates", JSON.stringify(certs));
};

export default function Grades() {
  const [resultsState, setResultsState] = useState(getStoredResults());
  const [certificates, setCertificates] = useState(getCertificates());
  const unlockedModules = useMemo(() => getUnlockedModules(), [resultsState]);

  // helper to parse scores (0-100) or return null if not present
  const readScore = (id, type) => {
    const key = `${id}-${type}`;
    const r = resultsState[key];
    if (!r || typeof r.score !== "number") return null;
    return Number.isFinite(r.score) ? r.score : null;
  };

  const computeOverall = (p, q, f) => {
    const vals = [p, q, f].filter((v) => v !== null);
    if (!vals.length) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  const claimCertificate = (courseId) => {
    const certs = { ...certificates, [courseId]: true };
    setCertificates(certs);
    saveCertificates(certs);
    // feedback alert (simple)
    alert(`Certificate claimed for "${courseContent[courseId].title}". It is now marked as claimed.`);
  };

  const revokeCertificate = (courseId) => {
    const certs = { ...certificates };
    delete certs[courseId];
    setCertificates(certs);
    saveCertificates(certs);
    alert(`Certificate revoked for "${courseContent[courseId].title}".`);
  };

  const refreshFromStorage = () => {
    setResultsState(getStoredResults());
    setCertificates(getCertificates());
  };

  return (
    <Layout>
      <div className="grades-container">
        <div className="grades-header">
          <h1>📊 My Grades</h1>
          <div className="grades-actions">
            <button className="btn" onClick={refreshFromStorage}>Refresh</button>
          </div>
        </div>

        <p className="grades-subtitle">
          Shows Pre-Test, Quiz and Final results per module (pulled from your saved assessments).
          Progress bars show average; green = passed (≥ 80%), orange = borderline (60–79%), red = below 60%.
        </p>

        <div className="grades-grid">
          {COURSE_IDS.map((id) => {
            const course = courseContent[id];
            const pre = readScore(id, "pretest");
            const quiz = readScore(id, "quiz");
            const final = readScore(id, "final");

            const overall = computeOverall(pre, quiz, final);
            const progressPct = overall !== null ? overall : 0;

            // determine color
            let statusColor = "red";
            if (overall === null) statusColor = "muted";
            else if (overall >= 80) statusColor = "green";
            else if (overall >= 60) statusColor = "orange";
            else statusColor = "red";

            const finalPassed = final !== null && final >= 80;
            const unlocked = unlockedModules.includes(String(id));
            const certClaimed = Boolean(certificates[id]);

            return (
              <div key={id} className="grade-card">
                <div className="grade-card-header">
                  <h3 className="course-title">{course?.title || `Course ${id}`}</h3>
                  <div className="meta-row">
                    <span className={`badge ${unlocked ? "badge-unlocked" : "badge-locked"}`}>
                      {unlocked ? "Unlocked" : "Locked"}
                    </span>
                    <span
                      className={`badge ${finalPassed ? "badge-passed" : "badge-notpassed"}`}
                      title={finalPassed ? "Final passed" : "Final not passed or not attempted"}
                    >
                      {finalPassed ? "Final: Passed" : "Final: —"}
                    </span>
                  </div>
                </div>

                <div className="grades-list">
                  <p>
                    <span className="label">Pre-Test:</span>{" "}
                    <span className="value">{pre === null ? "—" : `${pre}%`}</span>
                  </p>
                  <p>
                    <span className="label">Quiz:</span>{" "}
                    <span className="value">{quiz === null ? "—" : `${quiz}%`}</span>
                  </p>
                  <p>
                    <span className="label">Final Exam:</span>{" "}
                    <span className="value">{final === null ? "—" : `${final}%`}</span>
                  </p>

                  <div className="overall-row">
                    <p className="overall">
                      <span className="label">Overall:</span>{" "}
                      <span className={`overall-value ${statusColor}`}>
                        {overall === null ? "—" : `${overall}%`}
                      </span>
                    </p>

                    <div className="progress-wrapper" aria-hidden>
                      <div className="progress">
                        <div
                          className={`progress-fill ${statusColor}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <div className="progress-number">{overall === null ? "0%" : `${progressPct}%`}</div>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  {finalPassed && !certClaimed && (
                    <button className="btn btn-primary" onClick={() => claimCertificate(id)}>
                      Claim Certificate
                    </button>
                  )}

                  {certClaimed && (
                    <>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          // In a real app this would trigger download
                          alert(`Certificate for "${course.title}" is available for download (mock).`);
                        }}
                      >
                        Download Certificate
                      </button>
                      <button className="btn" onClick={() => revokeCertificate(id)}>
                        Revoke Certificate
                      </button>
                    </>
                  )}

                  {!finalPassed && (
                    <button
                      className="btn btn-light"
                      onClick={() =>
                        alert(
                          `You need to pass the Final (≥ 80%) to claim a certificate for "${course.title}".`
                        )
                      }
                    >
                      How to get certificate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </Layout>
  );
}
