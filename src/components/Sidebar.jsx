// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  AlertCircle,
  Activity,
  BookOpen,
  Settings,
  Menu,
  MessageSquare, // NEW ICON
} from "lucide-react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Menu size={32} className="icon" />
      </div>

      <ul>
        <li className={isActive("/dashboard") ? "active" : ""}>
          <Link to="/dashboard">
            <Home className="icon" />
            <span className="link-text">Dashboard</span>
          </Link>
        </li>

        <li className={isActive("/incident-logs") ? "active" : ""}>
          <Link to="/incident-logs">
            <FileText className="icon" />
            <span className="link-text">Incident Logs</span>
          </Link>
        </li>

        <li className={isActive("/emergency-sos") ? "active" : ""}>
          <Link to="/emergency-sos">
            <AlertCircle className="icon" />
            <span className="link-text">Emergency SOS</span>
          </Link>
        </li>

        <li className={isActive("/triage-system") ? "active" : ""}>
          <Link to="/triage-system">
            <Activity className="icon" />
            <span className="link-text">Triage System</span>
          </Link>
        </li>

        {/* NEW CHAT PAGE MENU ITEM */}
        <li className={isActive("/chat") ? "active" : ""}>
          <Link to="/chat">
            <MessageSquare className="icon" />
            <span className="link-text">Message</span>
          </Link>
        </li>

        {/* Online Training submenu */}
        <li
          className={`has-submenu ${
            isActive("/online-training") ||
            isActive("/modules") ||
            isActive("/certifications")
              ? "active"
              : ""
          }`}
        >
          <div className="menu-item">
            <Link to="/online-training">
              <BookOpen className="icon" />
              <span className="link-text">Online Training</span>
            </Link>
          </div>

          <ul className="submenu">
            <li className={isActive("/modules") ? "active" : ""}>
              <Link to="/modules">
                <span className="link-text">Modules</span>
              </Link>
            </li>

            <li className={isActive("/certifications") ? "active" : ""}>
              <Link to="/certifications">
                <span className="link-text">Certifications</span>
              </Link>
            </li>
          </ul>
        </li>

        <li className={isActive("/settings") ? "active" : ""}>
          <Link to="/settings">
            <Settings className="icon" />
            <span className="link-text">Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
