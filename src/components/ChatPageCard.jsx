// src/components/ChatPageCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, User, HelpCircle, PlusCircle } from "lucide-react";
import "../styles/chatcard.css";

const ChatPageCard = () => {
  const navigate = useNavigate();

  const openChat = () => {
    navigate("/chat");
  };

  return (
    <div onClick={openChat} className="chat-shortcut-preview">
      
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-icon-wrapper">
          <MessageCircle color="white" size={26} />
        </div>

        <div>
          <h3 className="chat-title">Chat With Us</h3>
          <p className="chat-subtitle">Tap to open the chat window</p>
        </div>
      </div>

      {/* CHAT UI PREVIEW */}
      <div className="chat-preview-wrapper">
        
        {/* LEFT MENU */}
        <div className="chat-left-panel">
          <div className="left-item">
            <MessageCircle size={16} /> Messages
          </div>
          <div className="left-item">
            <User size={16} /> Contact Directory
          </div>
          <div className="left-item">
            <HelpCircle size={16} /> Support & FAQ
          </div>
          <div className="left-item">
            <PlusCircle size={16} /> New Message
          </div>
        </div>

        {/* RIGHT CHAT LIST */}
        <div className="chat-list">
          <div className="chat-item">
            <div>Emergency Room</div>
            <span className="badge urgent">Urgent</span>
          </div>

          <div className="chat-item">
            <div>Front Desk</div>
            <span className="badge routine">Routine</span>
          </div>

          <div className="chat-item">
            <div>Nurse Station</div>
            <span className="badge unread">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPageCard;