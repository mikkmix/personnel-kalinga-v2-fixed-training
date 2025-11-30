import React, { useState } from "react";
import Layout from "../layouts/Layout";
import "../styles/profile.css";
import { FaLinkedin, FaEnvelope, FaEdit, FaTimes } from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [affiliationModal, setAffiliationModal] = useState(null);

  const [profile, setProfile] = useState({
    name: "John Santos",
    role: "Medical Responder",
    age: "27 years old",
    address: "123 Mabini St., San Pedro, Laguna",
    registered: "September 15, 2025",
    id: "KAL-2025-0342",
    email: "john.santos@email.com",
    linkedin: "https://linkedin.com/in/johnsantos",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  // Sample training data
  const trainings = [
    { name: "First Aid Basics", status: "completed" },
    { name: "Mass Casualty Management", status: "in-progress", progress: 60 },
    { name: "Advanced Trauma Care", status: "locked" },
  ];

  // Sample activity logs
  const activityLogs = [
    {
      title: "Responded to PGH Cardiology Shortage",
      description:
        "After the system flagged PGH lacking Cardiologists, personnel was dispatched to assist in screening and redirecting cardiac patients.",
      date: "Oct 28, 2025",
      alertType: "shortage",
      location: "Philippine General Hospital",
    },
    {
      title: "Assisted in ICU Overflow – East Avenue Medical Center",
      description:
        "Supported triage and patient reassessment after ICU reached 92% capacity.",
      date: "Oct 25, 2025",
      alertType: "overflow",
      location: "East Avenue Medical Center",
    },
    {
      title: "Redirection Support at Rizal Medical Center",
      description:
        "Helped redirect moderate-case patients due to limited oxygen supply reported by the system.",
      date: "Oct 22, 2025",
      alertType: "resource-limit",
      location: "Rizal Medical Center",
    },
    {
      title: "Emergency Deployment – Sector 3B Accident",
      description:
        "Responded to multi-vehicle collision after alert triggered in the Emergency SOS feed.",
      date: "Oct 19, 2025",
      alertType: "emergency",
      location: "Sector 3B",
    },
  ];

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-grid">
          {/* === Profile Card === */}
          <div className="card profile-card">
            <button
              className="edit-btn"
              onClick={() => setIsEditing(!isEditing)}
            >
              <FaEdit /> {isEditing ? "Cancel" : "Edit"}
            </button>

            <div
              className={`profile-header side-by-side ${
                isEditing ? "editing-mode" : ""
              }`}
            >
              <div className="profile-main">
                {!isEditing && (
                  <div className="profile-avatar-large">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="white"
                      width="60"
                      height="60"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </div>
                )}

                {!isEditing ? (
                  <div className="profile-info">
                    <h3 className="profile-name">{profile.name}</h3>
                    <p>
                      <span className="label">Role:</span> {profile.role}
                    </p>
                    <p>
                      <span className="label">Age:</span> {profile.age}
                    </p>
                    <p>
                      <span className="label">Address:</span> {profile.address}
                    </p>
                    <p>
                      <span className="label">Registered:</span>{" "}
                      {profile.registered}
                    </p>
                    <p>
                      <span className="label">ID Number:</span> {profile.id}
                    </p>

                    <div className="profile-buttons">
                      <a
                        href={`mailto:${profile.email}`}
                        className="profile-btn email"
                      >
                        <FaEnvelope /> Email
                      </a>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-btn linkedin"
                      >
                        <FaLinkedin /> LinkedIn
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="profile-edit-form">
                    <label>Name:</label>
                    <input
                      name="name"
                      value={tempProfile.name}
                      onChange={handleChange}
                    />
                    <label>Role:</label>
                    <input
                      name="role"
                      value={tempProfile.role}
                      onChange={handleChange}
                    />
                    <label>Age:</label>
                    <input
                      name="age"
                      value={tempProfile.age}
                      onChange={handleChange}
                    />
                    <label>Address:</label>
                    <input
                      name="address"
                      value={tempProfile.address}
                      onChange={handleChange}
                    />
                    <label>Email:</label>
                    <input
                      name="email"
                      value={tempProfile.email}
                      onChange={handleChange}
                    />
                    <label>LinkedIn:</label>
                    <input
                      name="linkedin"
                      value={tempProfile.linkedin}
                      onChange={handleChange}
                    />
                    <label>Registered:</label>
                    <input
                      name="registered"
                      value={tempProfile.registered}
                      onChange={handleChange}
                    />
                    <label>ID Number:</label>
                    <input
                      name="id"
                      value={tempProfile.id}
                      onChange={handleChange}
                    />
                    <button className="save-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {!isEditing && (
                <div
                  className="profile-qr cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <h4>Profile QR Code</h4>
                  <QRCodeCanvas
                    value={`Name: ${profile.name}\nRole: ${profile.role}\nID: ${profile.id}`}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#02462E"
                    level="H"
                    includeMargin={true}
                  />
                  <p className="qr-caption">Click to verify profile</p>
                </div>
              )}
            </div>
          </div>

          {/* === Affiliations === */}
          <div className="card status-card">
            <span className="status-badge active">● Active - On Duty</span>
            <h4 className="affiliation-title">Affiliations:</h4>

            <div className="affiliations-timeline">
              <div className="affiliation-item">
                <div className="dot"></div>
                <div>
                  <strong>Philippine General Hospital</strong>
                  <div className="affiliation-role">Resident Physician</div>
                </div>
              </div>

              <div className="affiliation-item">
                <div className="dot"></div>
                <div>
                  <strong>Philippine Heart Center</strong>
                  <div className="affiliation-role">
                    Emergency Responder Pool
                  </div>
                </div>
              </div>

              <div className="affiliation-item">
                <div className="dot"></div>
                <div>
                  <strong>St. Luke’s Medical Center</strong>
                  <div className="affiliation-role">
                    Training Partner – BLS Program
                  </div>
                </div>
              </div>
            </div>

            <h4 className="badges-title">Badges:</h4>
          </div>

          {/* === Activity Overview === */}
          <div className="activity-overview">
            <h3>Activity Overview</h3>

            {/* === Recent Logs === */}
            <div className="card recent-logs">
              <h4>Recent Logs</h4>
              <ul className="timeline">
                {activityLogs.map((log, idx) => (
                  <li
                    key={idx}
                    className={`log-item ${log.alertType}`}
                    onClick={() => setAffiliationModal(log)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="dot"></span>
                    <div>
                      <strong>{log.title}</strong>
                      <p>{log.description}</p>
                      <p className="log-date">{log.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* === Training Progress === */}
            <div className="card training-progress">
              <h4>Training Progress</h4>
              <ul className="timeline">
                {trainings.map((t, i) => (
                  <li key={i}>
                    <span className="dot"></span>
                    <div>
                      <strong
                        className={
                          t.status === "in-progress"
                            ? "in-progress"
                            : t.status === "locked"
                            ? "locked"
                            : ""
                        }
                      >
                        {t.name}
                      </strong>
                      <p>
                        {t.status === "in-progress"
                          ? `In Progress - ${t.progress}%`
                          : t.status === "locked"
                          ? "Locked"
                          : "Completed"}
                      </p>
                      {t.status === "in-progress" && (
                        <div className="progress-bar">
                          <div
                            className="progress"
                            style={{ width: `${t.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ Modal for QR verification */}
        {showModal && (
          <div
            className="profile-modal-overlay"
            onClick={() => setShowModal(false)}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
              <h3>Verified Profile Information</h3>
              <p>
                <strong>Name:</strong> {profile.name}
              </p>
              <p>
                <strong>Role:</strong> {profile.role}
              </p>
              <p>
                <strong>Age:</strong> {profile.age}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Registered:</strong> {profile.registered}
              </p>
              <p>
                <strong>ID:</strong> {profile.id}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Modal for activity log details */}
        {affiliationModal && (
          <div
            className="profile-modal-overlay"
            onClick={() => setAffiliationModal(null)}
          >
            <div
              className="profile-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={() => setAffiliationModal(null)}
              >
                <FaTimes />
              </button>
              <h3>{affiliationModal.title}</h3>
              <p>{affiliationModal.description}</p>
              {affiliationModal.location && (
                <p>
                  <strong>Location:</strong> {affiliationModal.location}
                </p>
              )}
              {affiliationModal.date && (
                <p>
                  <strong>Date:</strong> {affiliationModal.date}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;