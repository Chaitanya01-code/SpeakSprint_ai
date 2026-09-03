import React, { useState } from "react";
import Dashboard from "./pages/dashboard/ui";
import History from "./pages/history/ui";
import Analytics from "./pages/analytics/ui";
import Home from "./pages/homepage/home";
import AdminDashboard from "./pages/admin.dash/ui";


  function App() {
    // Navigation between main app views (defaults to Dashboard as requested)
    const [currentView, setCurrentView] = useState(() => (
      new URLSearchParams(window.location.search).has("admin") ? "admin" : "dashboard"
    ));

    return (
      <div className="app-container">
        {/* Render Selected View */}
        {currentView === "admin" ? (
          <AdminDashboard />
        ) : currentView === "dashboard" ? (
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