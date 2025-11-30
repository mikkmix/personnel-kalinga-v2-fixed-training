// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 📄 Pages
import KalingaAuthSystem from "@/pages/KalingaAuthSystem";
import Dashboard from "@/pages/Dashboard";
import EmergencySOS from "@/pages/EmergencySOS";
import TriageSystem from "@/pages/TriageSystem";
import OnlineTraining from "@/pages/OnlineTraining";
import Modules from "@/pages/Online/Modules";
import Certifications from "@/pages/Online/Certifications";
import Settings from "@/pages/Settings";
import IncidentLogs from "@/pages/IncidentLogs";
import CourseDetails from "@/pages/Online/CourseDetails";
import InfoPage from "@/pages/Online/InfoPage";
import LessonDetails from "@/pages/Online/LessonDetails";
import AssessmentPage from "@/pages/Online/AssessmentPage";
import Grades from "@/pages/Grades";
import Profile from "@/pages/Profile";
import ActivityPage from "@/pages/Online/ActivityPage";

// ✅ Modules
import Module1 from "@/pages/Online/Modules/Module1";
import Module2 from "@/pages/Online/Modules/Module2";

// ✅ Lessons
import Lesson1 from "@/pages/Online/Lessons/Lesson1";
import Lesson2 from "@/pages/Online/Lessons/Lesson2";
import Lesson3 from "@/pages/Online/Lessons/Lesson3";
import Lesson4 from "@/pages/Online/Lessons/Lesson4";
import Lesson5 from "@/pages/Online/Lessons/Lesson5";
import Lesson6 from "@/pages/Online/Lessons/Lesson6";
import Lesson7 from "@/pages/Online/Lessons/Lesson7";


// 🧠 Context
import { TriageProvider } from "@/context/TriageProvider";

// 🔒 Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <TriageProvider>
        <Routes>

          {/* 🔓 Public */}
          <Route path="/login" element={<KalingaAuthSystem />} />

          {/* 🔒 Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/incident-logs" element={<PrivateRoute><IncidentLogs /></PrivateRoute>} />
          <Route path="/emergency-sos" element={<PrivateRoute><EmergencySOS /></PrivateRoute>} />
          <Route path="/triage-system" element={<PrivateRoute><TriageSystem /></PrivateRoute>} />
          <Route path="/online-training" element={<PrivateRoute><OnlineTraining /></PrivateRoute>} />
          <Route path="/modules" element={<PrivateRoute><Modules /></PrivateRoute>} />
          <Route path="/certifications" element={<PrivateRoute><Certifications /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/grades" element={<PrivateRoute><Grades /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* ✅ SPECIFIC MODULE PAGES */}

          <Route
            path="/modules/:id/activity/module-1-understanding-the-first-1000-days"
            element={
              <PrivateRoute>
                <Module1 />
              </PrivateRoute>
            }
            />

          <Route
            path="/modules/:id/activity/module-2-community-mobilization-strategies"
            element={
              <PrivateRoute>
                <Module2 />
              </PrivateRoute>
            }
          />

          {/* 🔶 MODULE MAIN PAGE (dynamic) */}
          <Route
            path="/modules/:id"
            element={<PrivateRoute><CourseDetails /></PrivateRoute>}
          />

          {/* 📘 INFO PAGES */}
          <Route
            path="/modules/:id/info/:topicSlug"
            element={<PrivateRoute><InfoPage /></PrivateRoute>}
          />

          {/* 🎓 LESSON PAGES */}
          <Route
            path="/modules/:id/activity/:activitySlug"
            element={<PrivateRoute><LessonDetails /></PrivateRoute>}
          />

          {/* ✅ SPECIFIC LESSON PAGES */}
          <Route
            path="/modules/:id/activity/lesson-1-importance-of-early-nutrition"
            element={<PrivateRoute><Lesson1 /></PrivateRoute>}
          />

          <Route
            path="/modules/:id/activity/lesson-2-maternal-and-child-health-integration"
            element={<PrivateRoute><Lesson2 /></PrivateRoute>}
          />

          <Route
            path="/modules/:id/activity/lesson-3-key-nutrition-interventions"
            element={<PrivateRoute><Lesson3 /></PrivateRoute>}
          />

          <Route
            path="/modules/:id/activity/lesson-4-engaging-stakeholders"
            element={<PrivateRoute><Lesson4 /></PrivateRoute>}
          />

           <Route
            path="/modules/:id/activity/lesson-5-conducting-barangay-sessions"
            element={<PrivateRoute><Lesson5 /></PrivateRoute>}
          />

           <Route
            path="/modules/:id/activity/lesson-6-monitoring-and-evaluation-tools"
            element={<PrivateRoute><Lesson6 /></PrivateRoute>}
          />

          <Route
            path="/modules/:id/activity/lesson-7-success-stories-and-case-studies"
            element={<PrivateRoute><Lesson7 /></PrivateRoute>}
          />

          {/* 🧩 ACTIVITY PAGE */}
          <Route
            path="/modules/:id/activitypage"
            element={<PrivateRoute><ActivityPage /></PrivateRoute>}
          />

          {/* 📝 ASSESSMENTS */}
          <Route
            path="/modules/:id/assessment/:type"
            element={<PrivateRoute><AssessmentPage /></PrivateRoute>}
          />

          {/* 🔁 Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>
      </TriageProvider>
    </Router>
  );
}

export default App;
