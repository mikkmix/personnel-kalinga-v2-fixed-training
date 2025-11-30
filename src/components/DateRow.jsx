// src/components/DateRow.jsx
import React from "react";
import "../styles/topbar.css";

const DateRow = ({ selectedCity, selectedHospital, onCityChange, onHospitalChange }) => {
  const today = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options).toUpperCase();
  const weekday = today
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  return (
    <div className="date-row">
      <span className="date-text">
        <strong>{formattedDate}</strong>{" "}
        <span className="weekday">{weekday}</span>
      </span>

      <div className="dropdowns">
        {/* Metro Manila Cities */}
        <select value={selectedCity} onChange={(e) => onCityChange(e.target.value)}>
          <option>Metro Manila (All)</option>
          <option>Manila</option>
          <option>Quezon City</option>
          <option>Makati</option>
          <option>Pasig</option>
          <option>Taguig</option>
          <option>Caloocan</option>
          <option>Mandaluyong</option>
          <option>Pasay</option>
          <option>Marikina</option>
        </select>

        {/* DOH-Accredited Hospitals */}
        <select value={selectedHospital} onChange={(e) => onHospitalChange(e.target.value)}>
          <option>All DOH Hospitals</option>
          <option>Philippine General Hospital (PGH)</option>
          <option>East Avenue Medical Center</option>
          <option>Rizal Medical Center</option>
          <option>Jose R. Reyes Memorial Medical Center</option>
          <option>St. Luke’s Medical Center (Quezon City)</option>
        </select>
      </div>
    </div>
  );
};

export default DateRow;
