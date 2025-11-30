// src/components/Topbar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/topbar.css";

import {
  fetchNotifications,
  markAllRead,
  deleteNotification,
  markRead,
  createMockIncoming,
} from "../services/notificationsService";

const Topbar = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  // Routes for search suggestions
  const searchRoutes = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Triage Reports", path: "/triage" },
    { label: "Incident Logs", path: "/incident-logs" },
    { label: "Settings", path: "/settings" },
    { label: "Profile", path: "/profile" },
    { label: "Grades", path: "/grades" },
    { label: "Notifications", path: "/notifications" },
  ];

  // Filter suggestions
  const filteredSuggestions = searchRoutes.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Select suggestion → navigate
  const handleSelectSuggestion = (route) => {
    navigate(route.path);
    setSearchQuery("");
    setSearchActive(false);
  };

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // load notifications on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchNotifications();
        if (mounted) setNotifications(data);
      } catch (err) {
        console.error("Load notifications failed:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // click-outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setNotifOpen(false);
      }
      setSearchActive(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleOpenNotification = async (id, navPath = null) => {
    try {
      await markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      if (navPath) navigate(navPath);
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  const showToast = (message) => {
    setToast({ message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Simulate incoming notifications
  useEffect(() => {
    let running = true;
    async function simulateIncoming() {
      while (running) {
        const delay = 25000 + Math.floor(Math.random() * 15000);
        await new Promise((r) => setTimeout(r, delay));
        try {
          const payload = {
            title: "New Triage Report",
            message: "A new triage report needs your review.",
            time: "Just now",
          };
          const created = await createMockIncoming(payload);
          setNotifications((prev) => [created, ...prev]);
          showToast(`${created.title}: ${created.message}`);
        } catch (err) {}
      }
    }
    simulateIncoming();
    return () => {
      running = false;
    };
  }, []);

  return (
    <>
      <div className="topbar-container">
        <div className="topbar">
          <div className="logo-text">
            <img src="/kalinga-logo.svg" alt="Logo" className="logo-image" />
            <span className="highlight">KALINGA</span>
          </div>

          <div className="topbar-right">

            {/* ====================== SEARCH BAR ====================== */}
            <div className={`search-box ${searchActive ? "active" : ""}`}>
              <FaSearch className="search-icon" />

              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onFocus={() => setSearchActive(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Clear button */}
              {searchQuery.length > 0 && (
                <button className="clear-btn" onClick={() => setSearchQuery("")}>
                  ×
                </button>
              )}

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {searchActive && searchQuery.length > 0 && (
                  <motion.div
                    className="search-suggestions"
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.15 }}
                  >
                    {filteredSuggestions.length === 0 ? (
                      <div className="suggestion-item empty">No results found</div>
                    ) : (
                      filteredSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          className="suggestion-item"
                          onMouseDown={() => handleSelectSuggestion(item)}
                        >
                          {item.label}
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* ======================================================= */}

            {/* Notifications */}
            <div className="notif-container" ref={notifRef}>
              <button
                className="icon-button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="Open notifications"
              >
                <FaBell />
                {unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    className="notif-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <h4 className="notif-title">Notifications</h4>

                    <div className="notif-list">
                      {notifications.length === 0 && (
                        <div className="notif-item empty">No notifications</div>
                      )}

                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notif-item ${notif.read ? "" : "unread"}`}
                        >
                          <div
                            className="notif-content"
                            onClick={() => handleOpenNotification(notif.id)}
                            role="button"
                            tabIndex={0}
                          >
                            <h5>{notif.title}</h5>
                            <p>{notif.message}</p>
                            <span className="time">{notif.time}</span>
                          </div>

                          <div className="notif-actions">
                            <button
                              className="btn-icon"
                              title="Delete"
                              onClick={() => handleDelete(notif.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="notif-footer"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User */}
            <div className="user-menu" ref={menuRef}>
              <button
                className="icon-button"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <FaUserCircle />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ul>
                      <li onClick={() => navigate("/profile")}>
                        <FaUser className="menu-icon" /> Profile
                      </li>
                      <li onClick={() => navigate("/settings")}>
                        <FaCog className="menu-icon" /> Settings
                      </li>
                      <li onClick={() => navigate("/grades")}>
                        <FaUser className="menu-icon" /> Grades
                      </li>
                      <li
                        className="logout"
                        onClick={() => alert("Logging out...")}
                      >
                        <FaSignOutAlt className="menu-icon" /> Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="notif-toast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Topbar;
