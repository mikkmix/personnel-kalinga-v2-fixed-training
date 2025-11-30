import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaUserMd } from "react-icons/fa";
import "../styles/personnel-style.css";

const Reports = () => {
  const hospitalAlerts = [
    "Philippine General Hospital (PGH) is nearing **full capacity** in the Emergency Department. Prepare for **patient redirection**.",
    "East Avenue Medical Center ICU occupancy at **92%**. Coordinate **overflow arrangements**.",
    "Rizal Medical Center reports **limited oxygen supply**. Request **urgent replenishment**.",
    "National Children’s Hospital **NICU nearing full capacity**. Redirect overflow to **PGH Pediatrics Department**.",
  ];

  const specialistAlerts = [
    "PGH currently lacks available **Cardiologists**. Redirect cardiac patients to **St. Luke’s Medical Center (Quezon City)**.",
    "Jose R. Reyes Memorial Medical Center has no **Neurologists** on duty. Redirect critical cases to **East Avenue Medical Center**.",
    "Manila Doctors Hospital **Orthopedic team on rotation leave**. Transfer trauma cases to **Rizal Medical Center**.",
    "Ospital ng Maynila requires additional **Pediatricians**. Coordinate support from **National Children’s Hospital**.",
  ];

  const renderAlert = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
  };

  const generateStatuses = (length) => {
    const options = ["Ongoing", "Responded", "Pending"];
    return Array.from({ length }, () => options[Math.floor(Math.random() * options.length)]);
  };

  const [hospitalStatuses, setHospitalStatuses] = useState(generateStatuses(hospitalAlerts.length));
  const [specialistStatuses, setSpecialistStatuses] = useState(generateStatuses(specialistAlerts.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setHospitalStatuses(generateStatuses(hospitalAlerts.length));
      setSpecialistStatuses(generateStatuses(specialistAlerts.length));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Ongoing":
        return "status-ongoing";
      case "Responded":
        return "status-responded";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  return (
    <div className="card reports-card">
      <h3 className="card-title">DOH Hospital Reports</h3>

      {/* Hospital Alerts */}
      <div className="section">
        <h4 className="section-title">🏥 Hospital Capacity Alerts</h4>
        <ul className="alert-list">
          {hospitalAlerts.map((alert, i) => (
            <li key={i} className="alert-item">
              <div className="alert-icon">
                <FaExclamationTriangle className="icon warning" />
              </div>
              <div className="alert-content">
                <span className="alert-text">{renderAlert(alert)}</span>
              </div>
              <span className={`status-badge ${getStatusClass(hospitalStatuses[i])}`}>
                {hospitalStatuses[i]}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Specialist Alerts */}
      <div className="section">
        <h4 className="section-title">👨‍⚕️ Specialist Availability</h4>
        <ul className="alert-list">
          {specialistAlerts.map((alert, i) => (
            <li key={i} className="alert-item">
              <div className="alert-icon">
                <FaUserMd className="icon resource" />
              </div>
              <div className="alert-content">
                <span className="alert-text">{renderAlert(alert)}</span>
              </div>
              <span className={`status-badge ${getStatusClass(specialistStatuses[i])}`}>
                {specialistStatuses[i]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;
