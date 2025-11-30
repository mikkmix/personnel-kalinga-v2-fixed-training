// src/pages/EmergencySOS.jsx
import React, { useState, useEffect, useMemo } from "react";
import Layout from "../layouts/Layout";
import Footer from "../components/Footer";
import "../styles/personnel-style.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { FaExclamationTriangle, FaUserMd } from "react-icons/fa";

/* =========================================
   Leaflet marker fix
   ========================================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =========================================
   Helper: move map to coords
   ========================================= */
const SetViewOnLocation = ({ coords, zoom = 11 }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, zoom);
  }, [coords, zoom, map]);
  return null;
};

/* =========================================
   Province centers (lat, lng) used to center map
   and to scatter synthetic positions for hospitals
   ========================================= */
const provinceCenters = {
  "Metro Manila": [14.5995, 120.9842],
  Laguna: [14.1701, 121.2436],
  Cavite: [14.4710, 120.9080],
  Baguio: [16.4023, 120.5960],
  Pampanga: [15.1376, 120.6932],
  Bulacan: [14.7951, 120.9756],
  "Nueva Ecija": [15.4700, 120.9876],
  Batangas: [13.7562, 121.0581],
};

/* =========================================
   Illustrative (exhaustive-style) hospital lists per province.
   Many entries; some major hospitals include coordinates.
   For hospitals without coords we will place them near province center.
   (If you have an authoritative dataset, we'll swap these in.)
   ========================================= */

const hospitalsByProvince = {
  "Metro Manila": [
    {
      name: "Philippine General Hospital (PGH)",
      position: [14.5737, 120.9831],
      level: "Tertiary",
    },
    {
      name: "St. Luke's Medical Center - Quezon City",
      position: [14.6425, 121.0450],
      level: "Tertiary",
    },
    { name: "Makati Medical Center", position: [14.5547, 121.0151], level: "Tertiary" },
    { name: "Manila Doctors Hospital", position: [14.5824, 120.9808], level: "Tertiary" },
    { name: "East Avenue Medical Center", position: [14.6410, 121.0480], level: "Tertiary" },
    { name: "Jose R. Reyes Memorial Medical Center", position: [14.6077, 120.9812], level: "Tertiary" },
    { name: "National Children's Hospital", position: [14.6020, 120.9940], level: "Specialty" },
    { name: "Quezon City General Hospital", level: "Secondary" },
    { name: "Ospital ng Maynila Medical Center", level: "Secondary" },
    { name: "San Lazaro Hospital", level: "Specialty" },
    { name: "Dr. Jose Fabella Memorial Hospital", level: "Primary" },
    { name: "Research Institute for Tropical Medicine", level: "Research / Specialty" },
    { name: "Veterans Memorial Medical Center", level: "Tertiary" },
    { name: "Philippine Heart Center", level: "Specialty" },
    { name: "National Kidney and Transplant Institute", level: "Specialty" },
    // ... add more Metro Manila entries here as needed
  ],

  Laguna: [
    { name: "Calamba Medical Center", level: "Tertiary" },
    { name: "Laguna Provincial Hospital System - Los Baños", level: "Tertiary" },
    { name: "ACL Cagas Hospital - San Pablo", level: "Secondary" },
    { name: "Josephine N. Cabanayan Medical Center - Santa Rosa", level: "Secondary" },
    { name: "San Pablo City General Hospital", level: "Primary" },
    { name: "Biñan Doctors Hospital", level: "Secondary" },
    { name: "Sta. Rosa Community Hospital", level: "Primary" },
    { name: "Calamba City Hospital", level: "Primary" },
    { name: "San Pedro Hospital", level: "Primary" },
    // ... (more Laguna facilities)
  ],

  Cavite: [
    { name: "Cavite Medical Center", level: "Tertiary" },
    { name: "St. Elizabeth Hospital - General Trias", level: "Secondary" },
    { name: "Amang Rodriguez Memorial Hospital - Cavite Branch", level: "Secondary" },
    { name: "Southern Luzon Hospital", level: "Primary" },
    { name: "De La Salle University Medical Center (Campus Clinic)", level: "Primary" },
    { name: "Tagaytay Medical Center", level: "Secondary" },
    // ... (more Cavite hospitals)
  ],

  Baguio: [
    { name: "Baguio General Hospital and Medical Center (BGHMC)", position: [16.4158, 120.5956], level: "Tertiary" },
    { name: "Northern Luzon Medical Center (NLMC)", level: "Tertiary" },
    { name: "Saint Louis University Hospital (Baguio)", level: "Secondary" },
    { name: "Gonzales Hospital", level: "Primary" },
    // ... (more Baguio entries)
  ],

  Pampanga: [
    {
      name: "Jose B. Lingad Memorial Regional Hospital (San Fernando)",
      position: [15.0476, 120.6921],
      level: "Tertiary",
    },
    { name: "Angeles University Foundation Medical Center", position: [15.1500, 120.5856], level: "Tertiary" },
    { name: "Dr. Amando G. Gonzaga Hospital (San Fernando)", level: "Secondary" },
    { name: "Rafael Lazatin Memorial Hospital", level: "Secondary" },
    { name: "Mabalacat District Hospital", level: "Secondary" },
    { name: "San Luis District Hospital", level: "Primary" },
    { name: "Holy Family Hospital - Angeles", level: "Primary" },
    // ... (more Pampanga)
  ],

  Bulacan: [
    { name: "Bulacan Medical Center", position: [14.8142, 120.9647], level: "Tertiary" },
    { name: "Meycauayan Doctors Hospital", level: "Secondary" },
    { name: "Baliwag District Hospital", level: "Secondary" },
    { name: "Hagonoy Municipal Hospital", level: "Primary" },
    { name: "San Jose del Monte General Hospital", level: "Primary" },
    // ... (more Bulacan)
  ],

  "Nueva Ecija": [
    { name: "Nueva Ecija Provincial Hospital (Cabanatuan)", position: [15.4850, 120.9724], level: "Tertiary" },
    { name: "Dr. Paulino J. Garcia Memorial Research and Medical Center", level: "Tertiary" },
    { name: "Gapan Medical Center", level: "Secondary" },
    { name: "Palayan City Hospital", level: "Primary" },
    // ... (more Nueva Ecija)
  ],

  Batangas: [
    { name: "Batangas Medical Center", position: [13.7569, 121.0620], level: "Tertiary" },
    { name: "Our Lady of Lourdes Hospital - Lipa", level: "Secondary" },
    { name: "Lipa Medix Medical Center", level: "Secondary" },
    { name: "Batangas City Medical Center", level: "Primary" },
    // ... (more Batangas)
  ],
};

/* =========================================
   Utility: if hospital has no coords, scatter it near the province center
   so map markers still show up.
   ========================================= */
function scatterNear(center, index) {
  // produce deterministic-ish offsets using index
  const rand = (seed) => {
    const x = Math.sin(seed * 987.654321) * 10000;
    return x - Math.floor(x);
  };
  const offsetLat = (rand(index + 1) - 0.5) * 0.08; // +/- ~0.04 deg (~4km)
  const offsetLng = (rand(index + 7) - 0.5) * 0.08;
  return [center[0] + offsetLat, center[1] + offsetLng];
}

/* =========================================
   Alert generator for hospitals (illustrative)
   ========================================= */
const makeAlertForHospital = (hospital) => {
  // sample templates
  const templates = [
    `**ER Load:** High patient intake at **${hospital.name}**. Triage requested.`,
    `**Code Blue:** Cardiac arrest reported at **${hospital.name}** ER. Immediate response required.`,
    `**Resource Shortage:** ${hospital.name} reports limited **oxygen** supply.`,
    `**Trauma Alert:** Multiple trauma cases incoming to **${hospital.name}**.`,
    `**NICU Notice:** Neonatal unit at **${hospital.name}** nearing capacity.`,
    `**ICU Occupancy:** ICU bed occupancy at **${hospital.name}** > 90%. Coordinate transfers.`,
  ];
  // pick based on hash of name (stable)
  const idx = Math.abs(
    hospital.name.split("").reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7)
  ) % templates.length;
  const time = `${10 + (idx % 12)}:${(10 + (idx * 7)) % 60}`.padStart(4, "0");
  return {
    hospitalName: hospital.name,
    message: templates[idx],
    time,
  };
};

/* =========================================
   Status helper
   ========================================= */
const statusOptions = ["Ongoing", "Responded", "Pending", "Investigating", "Critical"];
const pickStatus = (seed) =>
  statusOptions[Math.abs(seed) % statusOptions.length];

/* =========================================
   EmergencySOS component
   ========================================= */
const EmergencySOS = () => {
  const [selectedArea, setSelectedArea] = useState("Metro Manila");
  const [selectedRegion, setSelectedRegion] = useState("Luzon");
  const [userLocation, setUserLocation] = useState(null);

  // user location detection with Manila fallback
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(provinceCenters["Metro Manila"]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => setUserLocation(provinceCenters["Metro Manila"])
    );
  }, []);

  // Memoized hospitals for the selected area (with positions filled)
  const hospitals = useMemo(() => {
    const list = hospitalsByProvince[selectedArea] || [];
    const center = provinceCenters[selectedArea] || provinceCenters["Metro Manila"];
    return list.map((h, i) => {
      const position = h.position || scatterNear(center, i + 3);
      return {
        ...h,
        position,
      };
    });
  }, [selectedArea]);

  // Generate alerts for the hospitals (stable while in the same selection)
  const alerts = useMemo(() => {
    return hospitals.map((h, i) => {
      const alert = makeAlertForHospital(h);
      const seed = h.name.length + i;
      const status = pickStatus(seed);
      return {
        ...alert,
        status,
      };
    });
  }, [hospitals]);

  // Map center: prefer province center for selectedArea (zoom higher), else userLocation
  const mapCenter = provinceCenters[selectedArea] || userLocation || provinceCenters["Metro Manila"];
  const mapZoom = 11;

  /* render bold parsing: same parser you used earlier */
  const parseBold = (text) =>
    text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );

  return (
    <Layout>
      <div className="dashboard-content">
        <h2 className="page-title">LIVE EMERGENCY FEED</h2>

        {/* Controls */}
        <div className="controls">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="dropdown"
          >
            {Object.keys(hospitalsByProvince).map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="dropdown"
          >
            <option value="Luzon">Luzon</option>
            <option value="Visayas">Visayas</option>
            <option value="Mindanao">Mindanao</option>
          </select>
        </div>

        {/* Map */}
        <div
          className="map-section"
          style={{
            height: "420px",
            borderRadius: "10px",
            overflow: "hidden",
            marginTop: "1rem",
          }}
        >
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* User marker */}
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>You are here 📍</Popup>
              </Marker>
            )}

            {/* Hospital markers */}
            {hospitals.map((h, i) => (
              <Marker key={i} position={h.position}>
                <Popup>
                  <strong>{h.name}</strong>
                  <br />
                  {h.level ? <em>{h.level}</em> : null}
                  <br />
                  {h.position ? `${h.position[0].toFixed(4)}, ${h.position[1].toFixed(4)}` : null}
                </Popup>
              </Marker>
            ))}

            <SetViewOnLocation coords={mapCenter} zoom={mapZoom} />
          </MapContainer>
        </div>

        {/* Emergency Alerts: hospital-based */}
        <div className="card reports-card" style={{ marginTop: "1.5rem" }}>
          <h3 className="card-title">Emergency Alerts — {selectedArea}</h3>

          <ul className="alert-list">
            {alerts.map((a, idx) => (
              <li key={idx} className="alert-item">
                <div className="alert-icon">
                  {/* choose icon by severity/status */}
                  {a.status === "Critical" || a.status === "Ongoing" ? (
                    <FaExclamationTriangle className="icon warning" />
                  ) : (
                    <FaUserMd className="icon resource" />
                  )}
                </div>

                <div className="alert-content">
                  <span className="alert-text">{parseBold(a.message)}</span>
                  <div className="alert-sub">
                    <small className="alert-hospital">{a.hospitalName}</small>
                    <div className="alert-time">⏱ {a.time}</div>
                  </div>
                </div>

                <span className={`status-badge ${a.status.toLowerCase().replace(" ", "-")}`}>
                  {a.status}
                </span>
              </li>
            ))}

            {alerts.length === 0 && <p style={{ padding: "1rem" }}>No alerts for this area.</p>}
          </ul>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

export default EmergencySOS;