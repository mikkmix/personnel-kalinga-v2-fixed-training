/* ===============  CLEAN VERSION — NO BACKEND, FIXED ERRORS  =============== */

import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  Check,
  CheckCheck,
  MoreVertical,
} from "lucide-react";

import Layout from "../layouts/Layout";
import Footer from "../components/Footer";
import "../styles/chat.css";

const SAMPLE_AVATAR = null;

/* =============================================================
   FRONT-END ONLY — Using Local Sample Conversations
   - removed backend fetching
   - removed load errors
   - fixed all template literal syntax errors
   - fixed invalid IDs
   ============================================================= */

export default function ChatPage() {
  /* -------------------- SAMPLE DATA -------------------- */
  const INITIAL_CONVERSATIONS = [
    {
      id: "conv1",
      title: "Patient — Juan Dela Cruz",
      lastMessage: "Salamat po!",
      time: "10:32 AM",
      unread: 0,
      verified: true,
      resolved: false,
      messages: [
        {
          id: "m1",
          sender: "patient",
          text: "Doc, ano po yung kailangan kong gawin ngayon?",
          time: new Date().toISOString(),
          type: "text",
          status: "read",
        },
        {
          id: "m2",
          sender: "personnel",
          text: "Please monitor your temperature regularly.",
          time: new Date().toISOString(),
          type: "text",
          status: "delivered",
        },
      ],
    },
  ];

  /* -------------------- STATES -------------------- */
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(INITIAL_CONVERSATIONS[0].id);

  const [searchConversations, setSearchConversations] = useState("");
  const [searchMessages, setSearchMessages] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [input, setInput] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesAreaRef = useRef(null);
  const messageEndRef = useRef(null);

  const activeConv =
    conversations.find((c) => c.id === activeId) ?? null;

  const safeMessages = Array.isArray(activeConv?.messages)
    ? activeConv.messages
    : [];

  /* -------------------- HELPERS -------------------- */

  function getInitials(name) {
    if (!name) return "?";
    return name
      .replace("Patient — ", "")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  }

  function formatGroupHeader(dateString) {
    const msgDate = new Date(dateString);
    if (Number.isNaN(msgDate)) return "Unknown Date";

    const today = new Date();
    const diff =
      (today.setHours(0, 0, 0, 0) -
        msgDate.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return msgDate.toLocaleDateString();
  }

  function groupMessages(messages = []) {
    const groups = {};
    messages.forEach((m) => {
      const header = formatGroupHeader(m.time);
      if (!groups[header]) groups[header] = [];
      groups[header].push(m);
    });
    return groups;
  }

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    const t = setTimeout(() => {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 50);
    return () => clearTimeout(t);
  }, [activeId, safeMessages.length]);

  /* -------------------- ACTIONS -------------------- */

  function createNewConversation() {
    const id = "conv-" + Date.now();

    const newConv = {
      id,
      title: "New Patient",
      lastMessage: "",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      unread: 0,
      verified: false,
      resolved: false,
      messages: [
        {
          id: "msg-" + Date.now(),
          sender: "personnel",
          text: "Hello — how can I assist you today?",
          time: new Date().toISOString(),
          type: "text",
          status: "delivered",
        },
      ],
    };

    setConversations((p) => [newConv, ...p]);
    setActiveId(id);
  }

  function selectConversation(id) {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, unread: 0 } : c
      )
    );
  }

  function markResolved(id) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, resolved: true } : c
      )
    );
  }

  function handleFileSelect(file) {
    if (!file) return;
    setFilePreview({
      name: file.name,
      preview: URL.createObjectURL(file),
    });
  }

  function sendMessage() {
    if (!input.trim() && !filePreview) return;

    const time = new Date().toISOString();

    const newMsg = {
      id: "msg-" + Date.now(),
      sender: "personnel",
      text: filePreview ? `File: ${filePreview.name}` : input.trim(),
      file: filePreview ? filePreview : null,
      time,
      type: filePreview ? "file" : "text",
      status: "delivered",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: newMsg.text,
              time,
            }
          : c
      )
    );

    setInput("");
    setFilePreview(null);

    // Fake typing reply
    setIsTyping(true);
    setTimeout(() => {
      const reply = {
        id: "msg-" + (Date.now() + 1),
        sender: "patient",
        text: "Noted po, salamat!",
        time: new Date().toISOString(),
        type: "text",
        status: "read",
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: [...c.messages, reply],
                lastMessage: reply.text,
                time: reply.time,
              }
            : c
        )
      );

      setIsTyping(false);
    }, 1000);
  }

  /* -------------------- FILTER -------------------- */

  const filteredConversations = conversations.filter((c) => {
    const matches =
      c.title.toLowerCase().includes(searchConversations.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchConversations.toLowerCase());

    if (!matches) return false;
    if (filterType === "active") return !c.resolved;
    if (filterType === "resolved") return c.resolved;
    return true;
  });

  /* -------------------- UI -------------------- */

  return (
    <Layout>
      <div className="chat-wrapper">
        {/* LEFT PANEL */}
        <aside className="chat-left-panel">
          <div className="left-header">
            <h2>Messages</h2>
            <p className="left-sub">Manage conversations</p>
          </div>

          <div className="filters">
            <button
              className={`filter ${filterType === "all" ? "active" : ""}`}
              onClick={() => setFilterType("all")}
            >
              All
            </button>

            <button
              className={`filter ${filterType === "active" ? "active" : ""}`}
              onClick={() => setFilterType("active")}
            >
              Active
            </button>

            <button
              className={`filter ${filterType === "resolved" ? "active" : ""}`}
              onClick={() => setFilterType("resolved")}
            >
              Resolved
            </button>
          </div>

          <button className="btn-new-chat" onClick={createNewConversation}>
            + New Message
          </button>

          <div className="conv-search">
            <input
              value={searchConversations}
              onChange={(e) => setSearchConversations(e.target.value)}
              placeholder="Search..."
            />
          </div>

          <div className="conversation-list">
            {filteredConversations.map((c) => (
              <div
                key={c.id}
                className={`conversation-card ${c.id === activeId ? "active" : ""}`}
                onClick={() => selectConversation(c.id)}
              >
                <div className="avatar-area">
                  <div className="avatar-fallback">{getInitials(c.title)}</div>
                  <span className={`status-dot ${c.resolved ? "resolved" : "online"}`} />
                </div>

                <div className="meta">
                  <div className="top-row">
                    <span className="title">{c.title}</span>
                    <span className="time">{c.time}</span>
                  </div>

                  <div className="bottom-row">
                    <span className="preview">
                      {c.resolved ? "✔ Resolved" : c.lastMessage}
                    </span>

                    {c.unread > 0 && <span className="badge-unread">{c.unread}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="chat-main">
          {activeConv ? (
            <>
              {/* TOP BAR */}
              <div className="chat-topbar">
                <div className="left">
                  <div className="top-avatar fallback">
                    {getInitials(activeConv.title)}
                  </div>

                  <div>
                    <div className="name">{activeConv.title}</div>
                    <div className="status">
                      {activeConv.verified ? "Verified" : "Patient"} • Online
                    </div>
                  </div>
                </div>

                <div className="right">
                  {!activeConv.resolved && (
                    <button
                      className="resolve-btn"
                      onClick={() => markResolved(activeConv.id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                  <MoreVertical />
                </div>
              </div>

              {/* MESSAGES */}
              <div className="chat-body" ref={messagesAreaRef}>
                {Object.entries(groupMessages(safeMessages)).map(([header, msgs]) => (
                  <div key={header}>
                    <div className="group-header">{header}</div>

                    {msgs
                      .filter((m) =>
                        m.text.toLowerCase().includes(searchMessages.toLowerCase())
                      )
                      .map((m) => (
                        <div key={m.id} className={`bubble-row ${m.sender}`}>
                          <div className="bubble">
                            {m.type === "file" ? (
                              <>
                                <img
                                  src={m.file?.preview}
                                  alt="file"
                                  className="bubble-file"
                                />
                                <div className="file-name">{m.file?.name}</div>
                              </>
                            ) : (
                              m.text
                            )}

                            <span className="time">
                              {new Date(m.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {m.sender === "personnel" && (
                                <span className="status-icon">
                                  {m.status === "delivered" && <Check size={14} />}
                                  {m.status === "read" && <CheckCheck size={14} />}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

                {isTyping && (
                  <div className="bubble-row patient typing">
                    <div className="typing-bubble">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <div ref={messageEndRef} />
              </div>

              {/* INPUT */}
              {!activeConv.resolved && (
                <div className="chat-input-bar">
                  <label className="attach-btn">
                    <Paperclip size={18} />
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                  </label>

                  <label className="attach-btn">
                    <ImageIcon size={18} />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleFileSelect(e.target.files[0])}
                    />
                  </label>

                  <input
                    className="chat-input"
                    placeholder="Message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />

                  <button className="send-btn" onClick={sendMessage}>
                    <Send size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-chat-selected">Select a conversation</div>
          )}
        </main>
      </div>

      <Footer />
    </Layout>
  );
}
