// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import "../styles/personnel-style.css";
import {
  FaUserShield,
  FaUser,
  FaBell,
  FaCogs,
  FaLock,
  FaTimes,
  FaSave,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const ACCENT = "#0A9B61";

const defaultData = {
  name: "John Doe",
  email: "johndoe@gmail.com",
  phone: "09123456789",
  role: "Youth Leader",
  availability: "Weekends",
  language: "English",
  theme: "Light",
  visibility: "Public",
  notificationType: "In-App",
  priorityAlerts: "Enabled",
  muteSnooze: "Off",
  reminders: "On",
};

const MODAL_CONFIG = {
  personalInfo: {
    title: "Personal Information",
    fields: [
      { label: "Full Name", name: "name", type: "text" },
      { label: "Email Address", name: "email", type: "email" },
      { label: "Phone Number", name: "phone", type: "tel" },
    ],
  },
  rolePosition: {
    title: "Role & Position",
    fields: [{ label: "Role", name: "role", type: "text" }],
  },
  availability: {
    title: "Availability",
    fields: [{ label: "Availability", name: "availability", type: "text" }],
  },
  language: {
    title: "Language",
    fields: [
      {
        label: "Language",
        name: "language",
        type: "select",
        options: ["English", "Filipino"],
      },
    ],
  },
  theme: {
    title: "Theme",
    fields: [
      {
        label: "Theme Mode",
        name: "theme",
        type: "select",
        options: ["Light", "Dark"],
      },
    ],
  },
  visibilitySettings: {
    title: "Visibility",
    fields: [
      {
        label: "Profile Visibility",
        name: "visibility",
        type: "select",
        options: ["Public", "Private", "Friends Only"],
      },
    ],
  },
  notificationType: {
    title: "Notification Type",
    fields: [
      {
        label: "Receive via",
        name: "notificationType",
        type: "select",
        options: ["Email", "SMS", "In-App"],
      },
    ],
  },
  priorityAlerts: {
    title: "Priority Alerts",
    fields: [
      {
        label: "Priority Alerts",
        name: "priorityAlerts",
        type: "select",
        options: ["Enabled", "Disabled"],
      },
    ],
  },
  muteSnooze: {
    title: "Mute / Snooze",
    fields: [
      {
        label: "Mute / Snooze",
        name: "muteSnooze",
        type: "select",
        options: ["Off", "Muted 1 hour", "Muted 8 hours", "Muted 24 hours"],
      },
    ],
  },
  reminders: {
    title: "Reminders",
    fields: [
      { label: "Reminders", name: "reminders", type: "select", options: ["On", "Off"] },
    ],
  },
  loginDevices: {
    title: "Login Devices",
    description: "Manage devices connected to your account (coming soon).",
    fields: [],
  },
};

export default function Settings() {
  const [formData, setFormData] = useState(defaultData);
  const [activeModal, setActiveModal] = useState(null);
  const [openSection, setOpenSection] = useState("account"); // accordion
  const [search, setSearch] = useState("");

  // load saved settings
  useEffect(() => {
    const saved = localStorage.getItem("kalinga_user_settings");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch {
        setFormData(defaultData);
      }
    }
  }, []);

  // apply theme immediately (Light / Dark)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", formData.theme?.toLowerCase() || "light");
    localStorage.setItem("kalinga_user_settings", JSON.stringify(formData));
  }, [formData]);

  const toggleSection = (key) => setOpenSection(openSection === key ? null : key);

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? (checked ? "On" : "Off") : value;
    setFormData((p) => ({ ...p, [name]: val }));
  };

  const saveModal = () => {
    localStorage.setItem("kalinga_user_settings", JSON.stringify(formData));
    setActiveModal(null);
    // small UI feedback - could be replaced with toast
    const el = document.querySelector(".save-feedback");
    if (el) {
      el.classList.add("show");
      setTimeout(() => el.classList.remove("show"), 1400);
    }
  };

  const sections = [
    {
      key: "account",
      title: "Account & Security",
      icon: <FaUserShield />,
      items: [
        { key: "personalInfo", label: "Personal Information" },
        { key: "loginDevices", label: "Login Devices" },
      ],
    },
    {
      key: "professional",
      title: "Professional Information",
      icon: <FaUser />,
      items: [
        { key: "rolePosition", label: "Role & Position" },
        { key: "availability", label: "Availability" },
      ],
    },
    {
      key: "notifications",
      title: "Notifications",
      icon: <FaBell />,
      items: [
        { key: "notificationType", label: "Notification Type" },
        { key: "priorityAlerts", label: "Priority Alerts" },
        { key: "muteSnooze", label: "Mute / Snooze" },
        { key: "reminders", label: "Reminders" },
      ],
    },
    {
      key: "system",
      title: "System Preferences",
      icon: <FaCogs />,
      items: [
        { key: "language", label: "Language" },
        { key: "theme", label: "Theme" },
      ],
    },
    {
      key: "privacy",
      title: "Privacy & Data",
      icon: <FaLock />,
      items: [{ key: "visibilitySettings", label: "Visibility Settings" }],
    },
  ];

  // filter helper for search
  const matchesSearch = (label) =>
    !search || label.toLowerCase().includes(search.toLowerCase());

  return (
    <Layout>
      <div className="settings-wrap">
        <div className="settings-header">
          <h1>Settings</h1>
          <p className="muted">Customize your account, notifications and preferences</p>
        </div>

        <div className="settings-top">
          <input
            className="settings-searchbox"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find the setting you need..."
          />

          <div className="current-summary">
            <div>
              <strong>Theme</strong>
              <div className="mini pill">{formData.theme}</div>
            </div>
            <div>
              <strong>Language</strong>
              <div className="mini pill">{formData.language}</div>
            </div>
          </div>
        </div>

        <div className="settings-grid">
          {/* left column - sections */}
          <div className="settings-list">
            {sections.map((section) => (
              <div className="settings-section" key={section.key}>
                <button
                  className="section-header"
                  onClick={() => toggleSection(section.key)}
                  aria-expanded={openSection === section.key}
                >
                  <div className="section-title">
                    <span className="icon">{section.icon}</span>
                    <span>{section.title}</span>
                  </div>
                  <span className="chev">
                    {openSection === section.key ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                {openSection === section.key && (
                  <ul className="section-items">
                    {section.items
                      .filter((it) => matchesSearch(it.label))
                      .map((it) => (
                        <li key={it.key} onClick={() => openModal(it.key)} className="section-item">
                          <span>{it.label}</span>
                          <div className="item-meta">
                            {/* show current value preview */}
                            <small>{formData[it.key] || formData[it.key.replace(/([A-Z])/g, (m) => m.toLowerCase())] || ""}</small>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* right column - preview / quick actions */}
          <div className="settings-preview">
            <div className="card glass preview-card">
              <h3>Quick Preferences</h3>

              <div className="field-row">
                <label>Theme</label>
                <div className="control">
                  <select name="theme" value={formData.theme} onChange={handleFieldChange}>
                    <option>Light</option>
                    <option>Dark</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <label>Language</label>
                <div className="control">
                  <select name="language" value={formData.language} onChange={handleFieldChange}>
                    <option>English</option>
                    <option>Filipino</option>
                  </select>
                </div>
              </div>

              <div className="field-row">
                <label>Priority Alerts</label>
                <div className="control">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="priorityAlerts"
                      checked={formData.priorityAlerts === "Enabled"}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, priorityAlerts: e.target.checked ? "Enabled" : "Disabled" }))
                      }
                    />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="field-row last">
                <label />
                <button className="save-primary" onClick={() => { localStorage.setItem("kalinga_user_settings", JSON.stringify(formData)); }}>
                  <FaSave /> Save All
                </button>
                <div className="save-feedback">Saved ✓</div>
              </div>
            </div>

            <div className="card glass help-card">
              <h4>Need help?</h4>
              <p className="muted">Contact admin or check the user manual for advanced settings.</p>
            </div>
          </div>
        </div>

        {/* Dynamic modal */}
        {activeModal && (() => {
          const modalCfg = MODAL_CONFIG[activeModal] || {};
          return (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>
                  <FaTimes />
                </button>

                <h2>{modalCfg.title ?? "Settings"}</h2>
                {modalCfg.description && <p className="muted">{modalCfg.description}</p>}

                <div className="modal-fields">
                  {(modalCfg.fields?.length ? modalCfg.fields : []).map((f, i) => (
                    <div className="field-row" key={i}>
                      <label>{f.label}</label>

                      {f.type === "select" ? (
                        <select name={f.name} value={formData[f.name]} onChange={handleFieldChange}>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={f.type || "text"}
                          name={f.name}
                          value={formData[f.name] || ""}
                          onChange={handleFieldChange}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button className="btn ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  {modalCfg.fields?.length > 0 && (
                    <button className="btn primary" onClick={saveModal}>
                      <FaSave /> Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </Layout>
  );
}