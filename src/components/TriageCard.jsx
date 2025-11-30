import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/triage-style.css";
import { useTriage } from "../context/TriageProvider"; // 🧠 shared context

const TriageCard = ({ userType = "Cardiologist" }) => {
  const { triageData } = useTriage(); // 🧠 shared from context
  const [updatedDoctor, setUpdatedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [recommendedActions, setRecommendedActions] = useState([]);

  // 🩺 Trigger glow animation when triage data refreshes
  useEffect(() => {
    if (!triageData) return;
    setUpdatedDoctor(Date.now()); // triggers glow pulse
  }, [triageData]);

  // 🧩 Filter top 5 patients requiring the current user's specialization
  useEffect(() => {
    if (!triageData) return;

    const actions = triageData
      .flatMap((row) =>
        row.patients
          .filter((p) => p.recommendedDoctor === userType)
          .map((p) => ({
            hospital: row.hospital,
            complaint: p.complaint,
            level: p.level,
          }))
      )
      .slice(0, 5);

    setRecommendedActions(actions);
  }, [triageData, userType]);

  return (
    <div className="card triage-card modern-card">
      <h3 className="card-title">Patients Triage Monitoring</h3>
      <p className="card-subtitle">
        Sensor-based real-time triage per DOH-accredited hospital
      </p>

      {/* 🏥 Hospital Summary Table */}
      <div className="triage-table-wrapper">
        <table className="triage-table modern-table">
          <thead>
            <tr>
              <th>Hospital</th>
              <th className="low">Low</th>
              <th className="medium">Medium</th>
              <th className="high">High</th>
              <th className="very-high">Very High</th>
              <th className="critical">Critical</th>
              <th>Priority Specialist</th>
            </tr>
          </thead>
          <tbody>
            {triageData.map((row, i) => (
              <tr
                key={i}
                onClick={() => setSelectedHospital(row)}
                className="clickable-row"
              >
                <td>
                  <strong>{row.hospital}</strong>
                  <div className="subtext">{row.specialty}</div>
                </td>
                <td className="low align-center">{row.counts?.low || 0}</td>
                <td className="medium align-center">{row.counts?.medium || 0}</td>
                <td className="high align-center">{row.counts?.high || 0}</td>
                <td className="very-high align-center">{row.counts?.["very-high"] || 0}</td>
                <td className="critical align-center">{row.counts?.critical || 0}</td>

                {/* 🩺 Priority Specialist with Glow Animation */}
                <td>
                  <span
                    className={`doctor-badge ${row.topDoctor
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")} ${updatedDoctor ? "updated" : ""}`}
                  >
                    {row.topDoctor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧭 Legend */}
      <div className="triage-legend">
        <span><span className="legend-dot low"></span> Low</span>
        <span><span className="legend-dot medium"></span> Medium</span>
        <span><span className="legend-dot high"></span> High</span>
        <span><span className="legend-dot very-high"></span> Very High</span>
        <span><span className="legend-dot critical"></span> Critical</span>
      </div>

      {/* 🧠 Recommended Actions */}
      <div className="recommendations-card">
        <h4>Recommended Actions for {userType}</h4>
        {recommendedActions.length > 0 ? (
          <ul className="recommendations-list">
            {recommendedActions.map((rec, idx) => (
              <li key={idx} className="recommendation-item">
                <span className="recommendation-icon">📍</span>
                <div className="recommendation-text">
                  <b>{rec.hospital}</b> — Patient with <b>{rec.complaint}</b>
                </div>
                <span className={`priority-badge ${rec.level}`}>
                  {rec.level} priority
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
            No current patients requiring {userType} attention.
          </p>
        )}
      </div>

      {/* 🏥 Modal View for Hospital Details */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            className="modal-overlay"
            onClick={() => setSelectedHospital(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedHospital(null)}
              >
                ✖
              </button>
              <h3>{selectedHospital.hospital}</h3>
              <p className="modal-subtext">{selectedHospital.specialty}</p>

              <table className="modal-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Temp (°C)</th>
                    <th>HR (bpm)</th>
                    <th>SpO₂ (%)</th>
                    <th>Comorbidity</th>
                    <th>Complaint</th>
                    <th>Mental Status</th>
                    <th>Level</th>
                    <th>Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedHospital.patients.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.id}</td>
                      <td>{p.age}</td>
                      <td>{p.temp}</td>
                      <td>{p.heartRate}</td>
                      <td>{p.spo2}</td>
                      <td>{p.comorbidity ? "Yes" : "No"}</td>
                      <td>{p.complaint}</td>
                      <td>{p.mentalStatus}</td>
                      <td className={p.level}>{p.level}</td>
                      <td>{p.recommendedDoctor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                className="close-btn"
                onClick={() => setSelectedHospital(null)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TriageCard;
