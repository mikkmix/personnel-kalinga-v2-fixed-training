// src/pages/TriageSystem.jsx
import React, { useMemo, useState } from "react";
import Layout from "../layouts/Layout";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/triage-system.css";
import { useTriage } from "../context/TriageProvider"; // optional

// ===== Example hospitals (DOH accredited sample) =====
const hospitalsExample = [
  { hospital: "Philippine General Hospital (PGH)", specialty: "Emergency, Cardiology, Pediatrics", beds: 120 },
  { hospital: "East Avenue Medical Center", specialty: "Neurology, Trauma, Internal Medicine", beds: 140 },
  { hospital: "Rizal Medical Center", specialty: "Surgery, OB-GYN, General Medicine", beds: 90 },
  { hospital: "Jose R. Reyes Memorial Medical Center", specialty: "Emergency, Neurosurgery, Pediatrics", beds: 100 },
  { hospital: "St. Luke’s Medical Center (Quezon City)", specialty: "Cardiology, Oncology, Orthopedics", beds: 200 },
];

// ===== Helper: generate fallback triage data (self-contained demo) =====
const complaintsList = ["Chest pain", "Difficulty breathing", "Dizziness", "Fever", "Seizure", "Wound/Fracture", "Abdominal pain"];
const recommendedForComplaint = (c, spo2, temp, mental) => {
  if (mental === "U") return "Emergency Medicine";
  if (c.includes("Chest")) return "Cardiologist";
  if (c.includes("breathing") || spo2 < 92) return "Pulmonologist";
  if (c.includes("Seizure") || c.includes("Dizziness")) return "Neurologist";
  if (temp > 39) return "Infectious Disease";
  return "General Practitioner";
};

const generateFallbackTriage = () =>
  hospitalsExample.map((h, idx) => {
    // buckets (low, medium, high, very-high, critical)
    const values = Array.from({ length: 5 }, () => Math.floor(Math.random() * 28));
    const counts = { low: values[0], medium: values[1], high: values[2], "very-high": values[3], critical: values[4] };
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const patients = Array.from({ length: total }).map((_, id) => {
      const r = Math.random();
      let level;
      if (r > 0.94) level = "critical";
      else if (r > 0.82) level = "very-high";
      else if (r > 0.65) level = "high";
      else if (r > 0.35) level = "medium";
      else level = "low";

      const complaint = complaintsList[Math.floor(Math.random() * complaintsList.length)];
      const spo2 = Math.floor(Math.random() * 18) + 82;
      const temp = parseFloat((36 + Math.random() * 4).toFixed(1));
      const mentalStatus = ["A", "V", "P", "U"][Math.floor(Math.random() * 4)];
      const recommendedDoctor = recommendedForComplaint(complaint, spo2, temp, mentalStatus);

      return {
        id: `${idx}-${id}`,
        age: Math.floor(Math.random() * 70) + 6,
        temp,
        heartRate: Math.floor(Math.random() * 60) + 60,
        spo2,
        complaint,
        mentalStatus,
        level,
        recommendedDoctor,
      };
    });

    // topDoctor
    const doctorCount = {};
    patients.forEach((p) => (doctorCount[p.recommendedDoctor] = (doctorCount[p.recommendedDoctor] || 0) + 1));
    const topDoctor = Object.entries(doctorCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "General Practitioner";

    return { hospital: h.hospital, specialty: h.specialty, counts, patients, beds: h.beds, topDoctor };
  });

// ===== Colors =====
const SEVERITY_COLORS = {
  low: "#16a34a",
  medium: "#f59e0b",
  high: "#e67e22",
  "very-high": "#b91c1c",
  critical: "#c0392b",
};
const PIE_COLORS = ["#1E2A78", "#C0392B", "#145A32", "#F1C40F", "#8E44AD"];

// ===== Utils =====
const flattenCountsForChart = (triageData) => triageData.map((h) => ({ name: h.hospital, ...h.counts }));

const calculatePersonnelNeeds = (hospital) => {
  let doctors = 2,
    nurses = 4,
    techs = 1,
    specialists = 0;
  hospital.patients.forEach((p) => {
    if (p.level === "critical") {
      doctors += 2;
      nurses += 3;
      techs += 1;
      if (p.recommendedDoctor !== "General Practitioner") specialists += 1;
    } else if (p.level === "very-high") {
      doctors += 1;
      nurses += 2;
      techs += 1;
      if (p.recommendedDoctor !== "General Practitioner") specialists += 1;
    } else if (p.level === "high") {
      doctors += 1;
      nurses += 1;
    }
  });
  return [
    { name: "Doctors", value: doctors },
    { name: "Nurses", value: nurses },
    { name: "Technicians", value: techs },
    { name: "Specialists", value: specialists },
  ];
};

// ===== Component =====
export default function TriageSystem() {
  // try context; fallback to generator
  const ctx = (() => {
    try {
      return useTriage();
    } catch {
      return null;
    }
  })();

  const initialData = ctx?.triageData?.length ? ctx.triageData : generateFallbackTriage();
  const [triageData] = useState(initialData);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({ key: "total", dir: "desc" });
  const [filterSeverity, setFilterSeverity] = useState(null);
  const [compare, setCompare] = useState({ a: null, b: null });

  const list = useMemo(() => {
    let arr = triageData.slice();
    if (search)
      arr = arr.filter(
        (r) => r.hospital.toLowerCase().includes(search.toLowerCase()) || r.specialty.toLowerCase().includes(search.toLowerCase())
      );
    if (filterSeverity) arr = arr.filter((r) => (r.counts[filterSeverity] || 0) > 0);
    arr = arr.map((r) => ({ ...r, total: Object.values(r.counts).reduce((a, b) => a + b, 0) }));
    arr.sort((x, y) => {
      const a = x.counts[sortBy.key] || x[sortBy.key] || 0;
      const b = y.counts[sortBy.key] || y[sortBy.key] || 0;
      return sortBy.dir === "asc" ? a - b : b - a;
    });
    return arr;
  }, [triageData, search, sortBy, filterSeverity]);

  const totalPatients = list.reduce((s, h) => s + h.total, 0);
  const totalCritical = list.reduce((s, h) => s + (h.counts?.critical || 0), 0);
  const totalBeds = list.reduce((s, h) => s + (h.beds || 0), 0);
  const occupancy = totalBeds ? ((totalPatients / totalBeds) * 100).toFixed(0) : "NaN";
  const alertCount = list.filter((h) => h.counts.critical > 3).length;

  const stackedData = useMemo(() => flattenCountsForChart(list), [list]);
  const trendData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => ({
      hour: `${i * 2}h`,
      low: Math.floor(Math.random() * 40),
      medium: Math.floor(Math.random() * 30),
      high: Math.floor(Math.random() * 20),
      critical: Math.floor(Math.random() * 8),
    }));
    return hours;
  }, []);

  const toggleSort = (key) => setSortBy((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
  const personnelForSelected = selectedHospital ? calculatePersonnelNeeds(selectedHospital) : [];

  const hospitalA = compare.a ? triageData.find((h) => h.hospital === compare.a) : null;
  const hospitalB = compare.b ? triageData.find((h) => h.hospital === compare.b) : null;

  return (
    <Layout>
      <div className="triage-fullpage">
        {/* Header / top controls */}
        <div className="top-controls">
          <div className="left-controls">
            <h1>DOH Triage — Region Overview</h1>
            <p className="subtitle">Real-time triage dashboard — severity stacks, personnel needs, alerts, and trends.</p>
          </div>

          <div className="right-controls header-widgets">
            <div className="status-widget">
              <div className="status-item">
                <span className="label">🛏 Bed Occupancy</span>
                <span className="value">{occupancy}%</span>
              </div>
              <div className="status-item">
                <span className="label">👥 Patients</span>
                <span className="value">{totalPatients}</span>
              </div>
              <div className="status-item">
                <span className="label">🚨 Alerts</span>
                <span className={`value alert ${alertCount > 0 ? "active" : ""}`}>{alertCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters row */}
        <div className="right-controls filters-row">
          <input placeholder="Search hospital or specialty..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select onChange={(e) => setFilterSeverity(e.target.value || null)} defaultValue="">
            <option value="">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="very-high">Very High</option>
            <option value="critical">Critical</option>
          </select>

          <div className="compare-selects">
            <select value={compare.a || ""} onChange={(e) => setCompare((c) => ({ ...c, a: e.target.value || null }))}>
              <option value="">Compare A</option>
              {triageData.map((h) => <option key={h.hospital} value={h.hospital}>{h.hospital}</option>)}
            </select>
            <select value={compare.b || ""} onChange={(e) => setCompare((c) => ({ ...c, b: e.target.value || null }))}>
              <option value="">Compare B</option>
              {triageData.map((h) => <option key={h.hospital} value={h.hospital}>{h.hospital}</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid-cards">
          {/* Summary chart */}
          <motion.div className="card summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Severity Overview</h3>
            <p className="muted">{list.length} hospitals reporting • {totalCritical} critical cases</p>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stackedData} stackOffset="expand">
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="low" stackId="a" fill={SEVERITY_COLORS.low} />
                  <Bar dataKey="medium" stackId="a" fill={SEVERITY_COLORS.medium} />
                  <Bar dataKey="high" stackId="a" fill={SEVERITY_COLORS.high} />
                  <Bar dataKey="very-high" stackId="a" fill={SEVERITY_COLORS["very-high"]} />
                  <Bar dataKey="critical" stackId="a" fill={SEVERITY_COLORS.critical} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div className="card table-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="table-header">
              <h3>Hospitals</h3>
              <div className="sort-controls">
                <button onClick={() => toggleSort("total")}>Sort total</button>
                <button onClick={() => toggleSort("critical")}>Sort critical</button>
              </div>
            </div>

            <div className="table-scroll">
              <table className="triage-table modern-table">
                <thead>
                  <tr>
                    <th>Hospital</th>
                    <th>Low</th>
                    <th>Medium</th>
                    <th>High</th>
                    <th>Very High</th>
                    <th>Critical</th>
                    <th>Total</th>
                    <th>Top Doctor</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => (
                    <tr key={row.hospital} className="clickable-row" onClick={() => setSelectedHospital(row)}>
                      <td>
                        <strong>{row.hospital}</strong>
                        <div className="subtext">{row.specialty}</div>
                      </td>
                      <td className="low align-center">{row.counts.low}</td>
                      <td className="medium align-center">{row.counts.medium}</td>
                      <td className="high align-center">{row.counts.high}</td>
                      <td className="very-high align-center">{row.counts["very-high"]}</td>
                      <td className="critical align-center">{row.counts.critical}</td>
                      <td className="align-center">{row.total}</td>
                      <td><span className="doctor-badge">{row.topDoctor}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Trends */}
          <motion.div className="card trends" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Triage Trends (sample)</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="low" stroke={SEVERITY_COLORS.low} dot={false} />
                  <Line type="monotone" dataKey="medium" stroke={SEVERITY_COLORS.medium} dot={false} />
                  <Line type="monotone" dataKey="high" stroke={SEVERITY_COLORS.high} dot={false} />
                  <Line type="monotone" dataKey="critical" stroke={SEVERITY_COLORS.critical} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Personnel */}
          <motion.div className="card personnel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Personnel Needs (Selected Hospital)</h3>
            {selectedHospital ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={personnelForSelected} dataKey="value" innerRadius={30} outerRadius={60} label>
                      {personnelForSelected.map((entry, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="personnel-list">
                  {personnelForSelected.map((p) => <li key={p.name}>{p.name}: <b>{p.value}</b></li>)}
                </ul>
              </>
            ) : (
              <p className="muted">Select a hospital to view personnel estimation.</p>
            )}
          </motion.div>

          {/* Alerts */}
          <motion.div className="card alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Emergency Alerts</h3>
            <div className="alerts-list">
              {list.filter((h) => h.counts.critical > 3).length === 0 ? (
                <p className="muted">No critical spike detected.</p>
              ) : (
                list.filter((h) => h.counts.critical > 3).map((h) => (
                  <div key={h.hospital} className="alert-card critical">
                    <strong>{h.hospital}</strong>
                    <div>{h.counts.critical} critical cases — immediate attention required</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Compare */}
          <motion.div className="card compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3>Hospital Comparison</h3>
            {hospitalA && hospitalB ? (
              <div className="compare-bars">
                {[hospitalA, hospitalB].map((h) => (
                  <div key={h.hospital}>
                    <p className="muted">{h.hospital}</p>
                    <div className="bar-row">
                      <div className="bar-fill" style={{ width: `${(h.counts.critical / Math.max(1, h.beds)) * 100}%`, background: SEVERITY_COLORS.critical }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">Select two hospitals from the dropdowns above to compare.</p>
            )}
          </motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedHospital && (
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedHospital(null)}>
              <motion.div className="modal-content" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setSelectedHospital(null)}>✖</button>
                <h3>{selectedHospital.hospital}</h3>
                <p className="modal-subtext">{selectedHospital.specialty}</p>

                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Age</th>
                      <th>Temp</th>
                      <th>HR</th>
                      <th>SpO₂</th>
                      <th>Complaint</th>
                      <th>Mental</th>
                      <th>Level</th>
                      <th>Doctor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedHospital.patients.slice(0, 200).map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.age}</td>
                        <td>{p.temp}</td>
                        <td>{p.heartRate}</td>
                        <td>{p.spo2}</td>
                        <td>{p.complaint}</td>
                        <td>{p.mentalStatus}</td>
                        <td className={p.level.replace("very-high", "very-high")}>{p.level}</td>
                        <td>{p.recommendedDoctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="close-btn" onClick={() => setSelectedHospital(null)}>Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </Layout>
  );
}
