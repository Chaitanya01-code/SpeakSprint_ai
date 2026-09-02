import React, { useState } from "react";
import Dashboard from "./pages/dashboard/ui";
import History from "./pages/history/ui";
import Analytics from "./pages/analytics/ui";
import Home from "./pages/homepage/home";

function App() {
  // Navigation between main app views (defaults to Dashboard as requested)
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="app-container">
      {/* View Switcher Bar (Discreet bottom bar for quick previewing between Views) */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
          background: "rgba(24, 27, 43, 0.85)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "999px",
          padding: "5px 6px",
          display: "flex",
          gap: "4px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.25)",
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentView("dashboard")}
          style={{
            background: currentView === "dashboard" ? "#5D5FEF" : "transparent",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📊 Dashboard
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("history")}
          style={{
            background: currentView === "history" ? "#5D5FEF" : "transparent",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📅 History
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("analytics")}
          style={{
            background: currentView === "analytics" ? "#5D5FEF" : "transparent",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📈 Analytics
        </button>
        <button
          type="button"
          onClick={() => setCurrentView("home")}
          style={{
            background: currentView === "home" ? "#5D5FEF" : "transparent",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "999px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          🏠 Landing Page
        </button>
      </div>

      {/* Render Selected View */}
      {currentView === "dashboard" ? (
        <Dashboard />
      ) : currentView === "history" ? (
        <div style={{ minHeight: "100vh", background: "#F7F8FC", padding: "24px 32px" }}>
          <History onNavigateBack={() => setCurrentView("dashboard")} />
        </div>
      ) : currentView === "analytics" ? (
        <div style={{ minHeight: "100vh", background: "#F7F8FC", padding: "24px 32px" }}>
          <Analytics />
        </div>
      ) : (
        <Home />
      )}
    </div>
  );
}

export default App;