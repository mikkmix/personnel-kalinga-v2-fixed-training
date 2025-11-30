// src/pages/IncidentLogs.jsx
import React, { useState } from "react";
import Layout from "../layouts/Layout";
import Footer from "../components/Footer";
import { useTriage } from "../context/TriageProvider";
import { generateIncidentLogsFromTriage, hospitals } from "../lib/triageUtils.jsx";
import "../styles/incident-logs.css";

const incidentIcons = {
  Critical: "🔴",
  High: "🟠",
  Medium: "🟡",
  Low: "🟢",
};

const IncidentLogs = () => {
  const { triageData } = useTriage();
  const incidentLogs = generateIncidentLogsFromTriage(triageData || []);

  // 🔍 Filter state
  const [selectedHospital, setSelectedHospital] = useState("All");

  // 🔽 Hospital dropdown values (from triageUtils)
  const hospitalOptions = ["All", ...hospitals.map((h) => h.name)];

  // 🔎 Filter logs by selected hospital
  const filteredLogs =
    selectedHospital === "All"
      ? incidentLogs
      : incidentLogs.filter((log) => log.hospital === selectedHospital);

  return (
    <Layout>
      <div className="incident-logs-container">
        <h2>🚨 Incident Logs</h2>
        <p className="subtitle">Automatically generated from active triage cases</p>

        {/* 🔽 Hospital Filter */}
        <div className="filter-container">
          <label>Filter by Hospital:</label>
          <select
            className="hospital-filter"
            value={selectedHospital}
            onChange={(e) => setSelectedHospital(e.target.value)}
          >
            {hospitalOptions.map((hospital, idx) => (
              <option key={idx} value={hospital}>
                {hospital}
              </option>
            ))}
          </select>
        </div>

        {/* Logs */}
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500 text-center italic">No incidents found.</p>
        ) : (
          <div className="incident-grid">
            {filteredLogs.map((log) => (
              <div key={log.id} className="incident-card">
                <div className="card-content">
                  <div className="incident-header">
                    <h3>{log.location}</h3>
                    <span className="incident-icon">
                      {incidentIcons[log.status] || "⚠️"}
                    </span>
                  </div>

                  <p className="incident-type">
                    <strong>Incident:</strong> {log.type}
                  </p>

                  <p className="incident-status">
                    Level:{" "}
                    <span className={`status-${log.status.toLowerCase()}`}>
                      {log.status}
                    </span>
                  </p>

                  <p className="text-xs text-gray-500">
                    <strong>Hospital:</strong> {log.hospital}
                  </p>

                  <p className="text-xs text-gray-500">
                    <strong>Logged:</strong> {log.time}
                  </p>

                  <p className="text-xs text-gray-500">
                    <strong>Response:</strong> {log.response}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default IncidentLogs;
