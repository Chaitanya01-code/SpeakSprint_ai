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