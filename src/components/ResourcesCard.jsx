import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useTriage } from "../context/TriageProvider";
import "../styles/personnel-style.css";

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#facc15", "#8b5cf6"];

const calculatePersonnelNeeds = (hospital) => {
  let doctors = 2,
    surgeons = 1,
    cardiologists = 1,
    nurses = 5,
    techs = 2;

  hospital.patients.forEach((p) => {
    switch (p.severity) {
      case "critical":
        doctors += 2;
        surgeons += 1;
        cardiologists += 1;
        nurses += 3;
        techs += 1;
        break;
      case "high":
        doctors += 1;
        nurses += 2;
        techs += 1;
        break;
      case "medium":
        doctors += 1;
        nurses += 1;
        break;
      default:
        break;
    }
  });

  return [
    { name: "General Doctors", value: doctors },
    { name: "Surgeons", value: surgeons },
    { name: "Cardiologists", value: cardiologists },
    { name: "Nurses", value: nurses },
    { name: "Technicians", value: techs },
  ];
};

const ResourcesCard = () => {
  const { triageData, lastUpdated } = useTriage();

  // Derive hospital data with specialty
  const hospitalsData = triageData.map((h) => ({
    name: h.hospital,
    specialty: h.specialty,
    data: calculatePersonnelNeeds(h),
  }));

  // Combine total data
  const allData = hospitalsData
    .flatMap((h) => h.data)
    .reduce((acc, cur) => {
      const existing = acc.find((a) => a.name === cur.name);
      if (existing) existing.value += cur.value;
      else acc.push({ ...cur });
      return acc;
    }, []);

  return (
    <motion.div
      className="card resources-card enhanced-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="resources-header">
        <div>
          <h3 className="card-title">Personnel Requirements Dashboard</h3>
          <p className="card-subtitle">
            Live estimation of staff needs across major hospitals.
          </p>
        </div>
        <div className="last-updated">
          ⏱️ Updated {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Layout */}
      <div className="resources-layout">
        {/* 📊 Overall Donut Chart */}
        <motion.div
          className="resources-main-chart"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h4>Overall Personnel Requirement</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={allData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {allData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  color: "#f9fafb",
                  borderRadius: "8px",
                  border: "none",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 🧮 Summary */}
        <div className="resources-summary modern-summary">
          <h4>All Hospitals Summary</h4>
          <ul>
            {allData.map((item, i) => (
              <li key={i}>
                <span
                  className="summary-dot"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></span>
                {item.name}
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🏥 Hospital Breakdown */}
      <div className="resources-hospitals">
        {hospitalsData.map((hospital, i) => {
          const totalStaff = hospital.data.reduce(
            (sum, item) => sum + item.value,
            0
          );

          return (
            <motion.div
              key={i}
              className="hospital-mini-card modern-card"
              style={{
                borderTop: `4px solid ${COLORS[i % COLORS.length]}`,
              }}
              whileHover={{ scale: 1.04, y: -3 }}
            >
              <div className="hospital-info">
                <div className="hospital-name">{hospital.name}</div>
                <div className="hospital-specialty">{hospital.specialty}</div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={hospital.data}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                  >
                    {hospital.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      color: "#f3f4f6",
                      borderRadius: "6px",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="hospital-total">
                Total Staff: <strong>{totalStaff}</strong>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ResourcesCard;
