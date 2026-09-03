import React, { useState, useEffect } from "react";
import History from "../history";
import Analytics from "../analytics";
import Leaderboard from "../leaderboard/ui";
import Achievements from "../achievements/ui";
import Profile from "../profile/ui";
import "./design.css";

const Dashboard = () => {
  // Navigation active state
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Timeframe filter for weekly progress
  const [timeframe, setTimeframe] = useState("This Week");
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  // Notifications popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(1);

  // Challenge Practice Modal state
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [recordingState, setRecordingState] = useState("idle"); // idle, recording, analyzing, completed
  const [countdown, setCountdown] = useState(60);
  const [selectedTopic, setSelectedTopic] = useState(
    "How Artificial Intelligence is Shaping the Future of Creative Work"
  );

  // Recent Attempts Modal / Drawer
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  // Achievements Modal
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Weekly Progress Chart Data
  const weeklyDataSets = {
    "This Week": [
      { day: "Mon", score: 55, x: 45, y: 155 },
      { day: "Tue", score: 68, x: 100, y: 125 },
      { day: "Wed", score: 63, x: 155, y: 135 },
      { day: "Thu", score: 75, x: 210, y: 110 },
      { day: "Fri", score: 87, x: 265, y: 80, isPeak: true },
      { day: "Sat", score: 78, x: 320, y: 105 },
      { day: "Sun", score: 82, x: 375, y: 95 },
    ],
    "Last Week": [
      { day: "Mon", score: 50, x: 45, y: 165 },
      { day: "Tue", score: 58, x: 100, y: 148 },
      { day: "Wed", score: 65, x: 155, y: 130 },
      { day: "Thu", score: 70, x: 210, y: 120 },
      { day: "Fri", score: 74, x: 265, y: 112, isPeak: true },
      { day: "Sat", score: 72, x: 320, y: 118 },
      { day: "Sun", score: 76, x: 375, y: 108 },
    ],
  };

  const currentWeeklyData = weeklyDataSets[timeframe] || weeklyDataSets["This Week"];
  const [hoveredDataPoint, setHoveredDataPoint] = useState(
    currentWeeklyData.find((d) => d.isPeak) || currentWeeklyData[4]
  );

  // Update hovered data point on timeframe change
  useEffect(() => {
    setHoveredDataPoint(currentWeeklyData.find((d) => d.isPeak) || currentWeeklyData[4]);
  }, [timeframe]);

  // Generate smooth cubic bezier SVG path from data points
  const generateSmoothPath = (points) => {
    if (!points || points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const mx = (p0.x + p1.x) / 2;
      path += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Skill Overview Radar Chart Geometry (6 Axes matching image)
  const radarSkills = [
    { name: "Fluency", user: 88, avg: 72, angle: -90 },
    { name: "Grammar", user: 82, avg: 68, angle: -30 },
    { name: "Vocabulary", user: 78, avg: 70, angle: 30 },
    { name: "Pronunciation", user: 86, avg: 65, angle: 90 },
    { name: "Confidence", user: 92, avg: 60, angle: 150 },
    { name: "Topic Relevance", user: 84, avg: 75, angle: 210 },
  ];

  const radarCenter = { x: 120, y: 95 };
  const radarRadius = 62;

  const calculateRadarPoint = (angleDeg, value) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * radarRadius;
    return {
      x: radarCenter.x + r * Math.cos(angleRad),
      y: radarCenter.y + r * Math.sin(angleRad),
    };
  };

  // User polygon points
  const userPolygonPoints = radarSkills
    .map((skill) => {
      const pt = calculateRadarPoint(skill.angle, skill.user);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  // Average benchmark polygon points
  const avgPolygonPoints = radarSkills
    .map((skill) => {
      const pt = calculateRadarPoint(skill.angle, skill.avg);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  const hexagonLevels = [0.25, 0.5, 0.75, 1.0];

  // Recent attempts data matching the screenshot
  const recentAttempts = [
    {
      id: 1,
      title: "The Future of AI",
      date: "May 16, 2024",
      score: 88,
      status: "green",
      wpm: 138,
      clarity: "92%",
      feedback: "Excellent vocabulary and articulate flow. Pacing was very engaging.",
    },
    {
      id: 2,
      title: "Impact of Social Media",
      date: "May 15, 2024",
      score: 78,
      status: "orange",
      wpm: 120,
      clarity: "81%",
      feedback: "Strong logical arguments. Work on reducing conversational filler words.",
    },
    {
      id: 3,
      title: "Online Education",
      date: "May 14, 2024",
      score: 92,
      status: "green",
      wpm: 145,
      clarity: "95%",
      feedback: "Outstanding confidence, structured cadence, and crisp pronunciation!",
    },
    {
      id: 4,
      title: "Sustainable Living",
      date: "May 13, 2024",
      score: 85,
      status: "green",
      wpm: 132,
      clarity: "88%",
      feedback: "Well-crafted points with clear examples. Natural transition phrasing.",
    },
  ];

  // Achievements data matching the screenshot
  const achievements = [
    {
      id: "first-challenge",
      title: "First Challenge",
      unlocked: "May 10, 2024",
      desc: "Completed your first 60-second speaking sprint",
      type: "first",
    },
    {
      id: "streak-7",
      title: "7-Day Streak",
      unlocked: "May 16, 2024",
      desc: "Practiced speaking consistently for 7 days in a row",
      type: "streak",
    },
    {
      id: "top-speaker",
      title: "Top Speaker",
      unlocked: "May 14, 2024",
      desc: "Scored 90+ points across multiple speech challenges",
      type: "speaker",
    },
    {
      id: "grammar-master",
      title: "Grammar Master",
      unlocked: "May 15, 2024",
      desc: "Achieved 95%+ grammatical precision in assessments",
      type: "grammar",
    },
  ];

  // Practice Simulation Timer
  useEffect(() => {
    let timer;
    if (recordingState === "recording" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (recordingState === "recording" && countdown === 0) {
      setRecordingState("analyzing");
      setTimeout(() => {
        setRecordingState("completed");
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [recordingState, countdown]);

  const startChallengeSession = () => {
    const randomTopics = [
      "How Artificial Intelligence is Shaping the Future of Creative Work",
      "The Impact of Remote Work on Global Communication",
      "Why Effective Storytelling is a Critical Leadership Skill",
      "The Role of Sustainable Energy in Combating Climate Change",
      "How Daily Micro-Habits Compound Into Long-Term Success",
    ];
    setSelectedTopic(randomTopics[Math.floor(Math.random() * randomTopics.length)]);
    setCountdown(60);
    setRecordingState("idle");
    setIsChallengeModalOpen(true);
  };

  const handleStartRecording = () => {
    setRecordingState("recording");
    setCountdown(60);
  };

  const handleStopRecording = () => {
    setRecordingState("analyzing");
    setTimeout(() => {
      setRecordingState("completed");
    }, 2000);
  };

  return (
    <div className="ss-dashboard-wrapper">
      {/* ====================================================================
          SIDEBAR
      ==================================================================== */}
      <aside className={`ss-sidebar ${mobileMenuOpen ? "open" : ""}`}>
        {/* LOGO */}
        <div className="ss-logo" onClick={() => setActiveNav("Dashboard")}>
          <div className="ss-logo-icon">
            <span className="ss-wave-bar" />
            <span className="ss-wave-bar" />
            <span className="ss-wave-bar" />
            <span className="ss-wave-bar" />
            <span className="ss-wave-bar" />
          </div>
          <span className="ss-logo-text">
            SpeakSprint <span>AI</span>
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="ss-nav-menu">
          {/* Dashboard (Active) */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveNav("Dashboard")}
          >
            {/* Start Challenge tab removed */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5" fill={activeNav === "Dashboard" ? "currentColor" : "none"} />
              <rect x="14" y="3" width="7" height="5" rx="1.5" fill={activeNav === "Dashboard" ? "currentColor" : "none"} />
              <rect x="14" y="12" width="7" height="9" rx="1.5" fill={activeNav === "Dashboard" ? "currentColor" : "none"} />
              <rect x="3" y="16" width="7" height="5" rx="1.5" fill={activeNav === "Dashboard" ? "currentColor" : "none"} />
            </svg>
            <span>Dashboard</span>
          </button>

          {/* History */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "History" ? "active" : ""}`}
            onClick={() => setActiveNav("History")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>History</span>
          </button>

          {/* Analytics */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "Analytics" ? "active" : ""}`}
            onClick={() => setActiveNav("Analytics")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Analytics</span>
          </button>

          {/* Leaderboard */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "Leaderboard" ? "active" : ""}`}
            onClick={() => setActiveNav("Leaderboard")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
              <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span>Leaderboard</span>
          </button>

          {/* Achievements */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "Achievements" ? "active" : ""}`}
            onClick={() => setActiveNav("Achievements")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            <span>Achievements</span>
          </button>

          {/* Profile */}
          <button
            type="button"
            className={`ss-nav-item ${activeNav === "Profile" ? "active" : ""}`}
            onClick={() => setActiveNav("Profile")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>

        </nav>

        {/* USER PROFILE CARD */}
        <div className="ss-user-card" onClick={() => setActiveNav("Profile")}>
          <div className="ss-user-avatar">
            <svg viewBox="0 0 64 64" fill="none" width="100%" height="100%">
              <rect width="64" height="64" fill="#C7D2FE" />
              {/* Aditya face portrait illustration */}
              <circle cx="32" cy="24" r="13" fill="#374151" />
              <circle cx="32" cy="25" r="11" fill="#FBBF24" />
              <path d="M22 22C24 16 40 16 42 22C42 22 41 14 32 14C23 14 22 22 22 22Z" fill="#1F2937" />
              <circle cx="28" cy="24" r="1.5" fill="#1F2937" />
              <circle cx="36" cy="24" r="1.5" fill="#1F2937" />
              <path d="M29 29C31 31 33 31 35 29" stroke="#1F2937" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M14 54C14 43 22 38 32 38C42 38 50 43 50 54" fill="#3B82F6" />
              <path d="M27 38L32 45L37 38" fill="#FFFFFF" />
            </svg>
          </div>
          <div className="ss-user-info">
            <span className="ss-user-name">Aditya Sharma</span>
            <span className="ss-user-email">aditya@example.com</span>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          MAIN DASHBOARD AREA
      ==================================================================== */}
      <main className="ss-main-content">
        {activeNav === "History" ? (
          <History
            onStartChallenge={startChallengeSession}
            onNavigateBack={() => setActiveNav("Dashboard")}
          />
        ) : activeNav === "Analytics" ? (
          <Analytics />
        ) : activeNav === "Leaderboard" ? (
          <Leaderboard />
        ) : activeNav === "Achievements" ? (
          <Achievements />
        ) : activeNav === "Profile" ? (
          <Profile />
        ) : (
          <>
            {/* ==================== HEADER ROW ==================== */}
            <header className="ss-header-row">
          <div className="ss-greeting-box">
            <h1 className="ss-greeting-title">
              Good morning, Aditya! <span role="img" aria-label="wave">👋</span>
            </h1>
            <p className="ss-greeting-sub">Ready to improve your communication skills today?</p>
          </div>

          <div className="ss-header-actions">
            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="ss-notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadNotif > 0 && <span className="ss-notification-badge">{unreadNotif}</span>}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="ss-notifications-popover">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #EEF1F8", paddingBottom: "8px" }}>
                    <span style={{ fontWeight: "700", fontSize: "13px" }}>Notifications</span>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "#5D5FEF", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
                      onClick={() => setUnreadNotif(0)}
                    >
                      Mark as read
                    </button>
                  </div>
                  <div className="ss-notif-item">
                    <span style={{ fontSize: "18px" }}>🎯</span>
                    <div>
                      <p style={{ fontWeight: "600", margin: "0 0 2px 0", color: "#1C2033" }}>New Daily Challenge is Live!</p>
                      <span style={{ color: "#8E98B0", fontSize: "11px" }}>Topic: The Future of AI (60s)</span>
                    </div>
                  </div>
                  <div className="ss-notif-item">
                    <span style={{ fontSize: "18px" }}>🔥</span>
                    <div>
                      <p style={{ fontWeight: "600", margin: "0 0 2px 0", color: "#1C2033" }}>7-Day Streak Achieved!</p>
                      <span style={{ color: "#8E98B0", fontSize: "11px" }}>Keep speaking daily to earn bonuses.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Today's Challenge Header Banner */}
            <div className="ss-today-challenge-card">
              <div className="ss-today-challenge-left">
                <h3 className="ss-today-title">Today's Challenge</h3>
                <p className="ss-today-sub">Start your 60-second speaking challenge</p>
                <button
                  type="button"
                  className="ss-btn-start-banner"
                  onClick={startChallengeSession}
                >
                  <span>Start Challenge</span>
                  <span>→</span>
                </button>
              </div>

              {/* Glowing Microphone Visualizer */}
              <div className="ss-today-mic-glow" onClick={startChallengeSession}>
                <div className="ss-mic-ripple" />
                <div className="ss-mic-ripple" />
                <div className="ss-mic-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="currentColor" fillOpacity="0.2" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== 4 METRIC STAT CARDS ==================== */}
        <section className="ss-stats-grid">
          {/* 1. Average Score */}
          <div className="ss-stat-card">
            <div className="ss-stat-top">
              <span className="ss-stat-label">Average Score</span>
              <div className="ss-stat-badge-icon trend-green">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
            <div className="ss-stat-value">87.6</div>
            <div className="ss-stat-footer positive">
              <span>↑ 5.4 this week</span>
            </div>
          </div>

          {/* 2. Best Score */}
          <div className="ss-stat-card">
            <div className="ss-stat-top">
              <span className="ss-stat-label">Best Score</span>
              <div className="ss-stat-badge-icon crown-gold">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 19h20v2H2v-2Zm1.5-12 4.5 6 4-8 4 8 4.5-6L22 17H2L3.5 7Z" />
                </svg>
              </div>
            </div>
            <div className="ss-stat-value">92</div>
            <div className="ss-stat-footer">
              <span>Your personal best</span>
            </div>
          </div>

          {/* 3. Challenges Completed */}
          <div className="ss-stat-card">
            <div className="ss-stat-top">
              <span className="ss-stat-label">Challenges Completed</span>
              <div className="ss-stat-badge-icon users-blue">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <div className="ss-stat-value">28</div>
            <div className="ss-stat-footer">
              <span>Total completed</span>
            </div>
          </div>

          {/* 4. Total Speaking Time */}
          <div className="ss-stat-card">
            <div className="ss-stat-top">
              <span className="ss-stat-label">Total Speaking Time</span>
              <div className="ss-stat-badge-icon time-purple">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className="ss-stat-value">28h 15m</div>
            <div className="ss-stat-footer">
              <span>Keep practicing!</span>
            </div>
          </div>
        </section>

        {/* ==================== MIDDLE ROW (3 TILES) ==================== */}
        <section className="ss-middle-grid">
          {/* Card 1: Weekly Progress */}
          <div className="ss-card">
            <div className="ss-card-header">
              <h2 className="ss-card-title">Weekly Progress</h2>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="ss-dropdown-btn"
                  onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                >
                  <span>{timeframe}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showTimeframeDropdown && (
                  <div style={{
                    position: "absolute",
                    right: 0,
                    top: "30px",
                    background: "#FFFFFF",
                    border: "1px solid #EEF1F8",
                    borderRadius: "8px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    zIndex: 20,
                    overflow: "hidden",
                    minWidth: "110px",
                  }}>
                    {["This Week", "Last Week"].map((tf) => (
                      <button
                        key={tf}
                        type="button"
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 12px",
                          textAlign: "left",
                          background: tf === timeframe ? "#F4F5FD" : "transparent",
                          color: tf === timeframe ? "#5D5FEF" : "#1C2033",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setTimeframe(tf);
                          setShowTimeframeDropdown(false);
                        }}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Line Chart */}
            <div className="ss-chart-container">
              {hoveredDataPoint && (
                <div
                  className="ss-chart-tooltip-callout"
                  style={{
                    left: `${(hoveredDataPoint.x / 420) * 100}%`,
                    top: `${hoveredDataPoint.y - 8}px`,
                  }}
                >
                  {hoveredDataPoint.score}
                </div>
              )}

              <svg viewBox="0 0 420 220" className="ss-chart-svg" preserveAspectRatio="none">
                {/* Horizontal Grid lines & Y-Axis */}
                {[
                  { label: "100", y: 35 },
                  { label: "75", y: 80 },
                  { label: "50", y: 125 },
                  { label: "25", y: 170 },
                  { label: "0", y: 200 },
                ].map((grid) => (
                  <g key={grid.label}>
                    <text x="15" y={grid.y + 4} className="ss-chart-axis-text">
                      {grid.label}
                    </text>
                    <line x1="45" y1={grid.y} x2="400" y2={grid.y} className="ss-chart-grid-line" />
                  </g>
                ))}

                {/* Smooth Curve Glow */}
                <path d={generateSmoothPath(currentWeeklyData)} className="ss-chart-curve-glow" />

                {/* Smooth Curve Line */}
                <path d={generateSmoothPath(currentWeeklyData)} className="ss-chart-curve" />

                {/* Data Points */}
                {currentWeeklyData.map((pt, idx) => (
                  <g key={idx} onMouseEnter={() => setHoveredDataPoint(pt)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      className={`ss-chart-dot ${hoveredDataPoint?.day === pt.day ? "active" : ""}`}
                    />
                    {/* X-Axis Day label */}
                    <text x={pt.x} y="215" textAnchor="middle" className="ss-chart-axis-text">
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Card 2: Skill Overview (Radar Chart) */}
          <div className="ss-card">
            <div className="ss-card-header">
              <h2 className="ss-card-title">Skill Overview</h2>
            </div>

            <div className="ss-radar-container">
              <svg viewBox="0 0 240 190" className="ss-radar-svg">
                {/* Concentric Hexagons */}
                {hexagonLevels.map((lvl, lvlIdx) => {
                  const points = radarSkills
                    .map((s) => {
                      const pt = calculateRadarPoint(s.angle, lvl * 100);
                      return `${pt.x},${pt.y}`;
                    })
                    .join(" ");
                  return (
                    <polygon
                      key={lvlIdx}
                      points={points}
                      fill="none"
                      stroke="#E5E9F4"
                      strokeDasharray={lvlIdx === 3 ? "none" : "2 2"}
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* Spokes / Axis lines */}
                {radarSkills.map((s, idx) => {
                  const outer = calculateRadarPoint(s.angle, 100);
                  return (
                    <line
                      key={idx}
                      x1={radarCenter.x}
                      y1={radarCenter.y}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="#E5E9F4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Average Benchmark Polygon (dashed) */}
                <polygon
                  points={avgPolygonPoints}
                  fill="none"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth="1.4"
                />

                {/* User Polygon (Purple fill + solid outline) */}
                <polygon
                  points={userPolygonPoints}
                  fill="rgba(93, 95, 239, 0.15)"
                  stroke="#5D5FEF"
                  strokeWidth="2"
                />

                {/* Vertex Dots */}
                {radarSkills.map((s, idx) => {
                  const pt = calculateRadarPoint(s.angle, s.user);
                  return (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.2"
                      fill="#5D5FEF"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Axis Labels */}
                {radarSkills.map((s, idx) => {
                  const labelPt = calculateRadarPoint(s.angle, 126);
                  let textAnchor = "middle";
                  if (labelPt.x < radarCenter.x - 10) textAnchor = "end";
                  if (labelPt.x > radarCenter.x + 10) textAnchor = "start";

                  return (
                    <text
                      key={idx}
                      x={labelPt.x}
                      y={labelPt.y + 4}
                      textAnchor={textAnchor}
                      fill="#8E98B0"
                      fontSize="9"
                      fontWeight="600"
                    >
                      {s.name}
                    </text>
                  );
                })}
              </svg>

              {/* Legend */}
              <div className="ss-radar-legend">
                <div className="ss-legend-item">
                  <span className="ss-legend-line-you" />
                  <span>You</span>
                </div>
                <div className="ss-legend-item">
                  <span className="ss-legend-line-avg" />
                  <span>Average</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Recent Attempts */}
          <div className="ss-card">
            <div className="ss-card-header">
              <h2 className="ss-card-title">Recent Attempts</h2>
              <button
                type="button"
                className="ss-card-link"
                onClick={() => setActiveNav("History")}
              >
                View All
              </button>
            </div>

            <div className="ss-recent-list">
              {recentAttempts.map((item) => (
                <div
                  key={item.id}
                  className="ss-attempt-item"
                  onClick={() => setSelectedAttempt(item)}
                >
                  <div className="ss-attempt-left">
                    <div className="ss-attempt-icon-box">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                    <div className="ss-attempt-info">
                      <span className="ss-attempt-title">{item.title}</span>
                      <span className="ss-attempt-date">{item.date}</span>
                    </div>
                  </div>

                  <div className={`ss-score-circle ${item.status}`}>
                    {item.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BOTTOM ROW (2 TILES) ==================== */}
        <section className="ss-bottom-grid">
          {/* Banner: Ready for today's challenge? */}
          <div className="ss-challenge-banner-card">
            <div className="ss-challenge-banner-content">
              <h2 className="ss-challenge-banner-title">Ready for today's challenge?</h2>
              <p className="ss-challenge-banner-sub">
                Get a random topic, speak for 60 seconds and get AI feedback.
              </p>
              <button
                type="button"
                className="ss-btn-primary"
                onClick={startChallengeSession}
              >
                <span>Start Challenge Now</span>
                <span>→</span>
              </button>
            </div>

            {/* Target Dartboard Illustration */}
            <div className="ss-target-illustration">
              <svg width="135" height="135" viewBox="0 0 160 160" fill="none">
                {/* Background Shadow */}
                <ellipse cx="80" cy="144" rx="52" ry="7" fill="#E2E7FA" />

                {/* Outer Ring */}
                <circle cx="80" cy="80" r="64" stroke="#8B8DF9" strokeWidth="6" strokeDasharray="6 6" fill="#F8F9FF" />
                <circle cx="80" cy="80" r="54" stroke="#7072F5" strokeWidth="5" fill="#FFFFFF" />

                {/* Middle Rings */}
                <circle cx="80" cy="80" r="42" stroke="#5D5FEF" strokeWidth="6" fill="#F4F5FD" />
                <circle cx="80" cy="80" r="30" stroke="#7072F5" strokeWidth="5" fill="#FFFFFF" />
                <circle cx="80" cy="80" r="18" stroke="#5D5FEF" strokeWidth="6" fill="#5D5FEF" fillOpacity="0.1" />

                {/* Bullseye Center */}
                <circle cx="80" cy="80" r="8" fill="#5D5FEF" />

                {/* Arrow hitting bullseye */}
                <g transform="translate(10, -8)">
                  <line x1="72" y1="86" x2="124" y2="40" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="70,88 80,82 76,92" fill="#D97706" />
                  <polygon points="124,40 134,32 128,48" fill="#EF4444" />
                  <polygon points="120,44 130,36 124,52" fill="#F59E0B" />
                </g>
              </svg>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="ss-card">
            <div className="ss-card-header">
              <h2 className="ss-card-title">Achievements</h2>
              <button
                type="button"
                className="ss-card-link"
                onClick={() => setSelectedAchievement(achievements[0])}
              >
                View All
              </button>
            </div>

            <div className="ss-achievements-row">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="ss-achievement-badge-card"
                  onClick={() => setSelectedAchievement(ach)}
                >
                  <div className="ss-badge-shield-wrap">
                    {/* First Challenge Badge */}
                    {ach.type === "first" && (
                      <svg width="58" height="66" viewBox="0 0 64 74" fill="none">
                        <path d="M32 4L54 14V38C54 53 44 65 32 70C20 65 10 53 10 38V14L32 4Z" fill="url(#firstShield)" />
                        <path d="M32 8L50 16V37C50 49 42 59 32 63C22 59 14 49 14 37V16L32 8Z" stroke="#E0E7FF" strokeWidth="1.5" />
                        <path d="M22 46C20 40 22 32 25 28M42 46C44 40 42 32 39 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="32" cy="28" r="6" fill="#FBBF24" />
                        <path d="M24 44C24 38 28 36 32 36C36 36 40 38 40 44" fill="#FBBF24" />
                        <defs>
                          <linearGradient id="firstShield" x1="10" y1="4" x2="54" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#6366F1" />
                            <stop offset="1" stopColor="#4338CA" />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}

                    {/* 7-Day Streak Badge */}
                    {ach.type === "streak" && (
                      <svg width="58" height="66" viewBox="0 0 64 74" fill="none">
                        <path d="M32 4L54 14V38C54 53 44 65 32 70C20 65 10 53 10 38V14L32 4Z" fill="url(#streakShield)" />
                        <path d="M32 8L50 16V37C50 49 42 59 32 63C22 59 14 49 14 37V16L32 8Z" stroke="#FEF3C7" strokeWidth="1.5" />
                        <path d="M22 46C20 40 22 32 25 28M42 46C44 40 42 32 39 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M32 22C32 22 26 28 26 34C26 38 29 41 32 41C35 41 38 38 38 34C38 30 35 28 35 28C35 28 35 32 33 33C32 33 31 32 32 22Z" fill="#FBBF24" />
                        <defs>
                          <linearGradient id="streakShield" x1="10" y1="4" x2="54" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F97316" />
                            <stop offset="1" stopColor="#EA580C" />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}

                    {/* Top Speaker Badge */}
                    {ach.type === "speaker" && (
                      <svg width="58" height="66" viewBox="0 0 64 74" fill="none">
                        <path d="M32 4L54 14V38C54 53 44 65 32 70C20 65 10 53 10 38V14L32 4Z" fill="url(#speakerShield)" />
                        <path d="M32 8L50 16V37C50 49 42 59 32 63C22 59 14 49 14 37V16L32 8Z" stroke="#FCE7F3" strokeWidth="1.5" />
                        <path d="M22 46C20 40 22 32 25 28M42 46C44 40 42 32 39 28" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="32" cy="26" r="5" fill="#FBBF24" />
                        <path d="M25 42L28 34H36L39 42H25Z" fill="#FBBF24" />
                        <defs>
                          <linearGradient id="speakerShield" x1="10" y1="4" x2="54" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#D946EF" />
                            <stop offset="1" stopColor="#A21CAF" />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}

                    {/* Grammar Master Badge */}
                    {ach.type === "grammar" && (
                      <svg width="58" height="66" viewBox="0 0 64 74" fill="none">
                        <path d="M32 4L54 14V38C54 53 44 65 32 70C20 65 10 53 10 38V14L32 4Z" fill="url(#grammarShield)" />
                        <path d="M32 8L50 16V37C50 49 42 59 32 63C22 59 14 49 14 37V16L32 8Z" stroke="#FEF3C7" strokeWidth="1.5" />
                        <path d="M22 46C20 40 22 32 25 28M42 46C44 40 42 32 39 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M26 26H38V32C38 36 35 39 32 39C29 39 26 36 26 32V26Z" fill="#FFFFFF" />
                        <path d="M30 39H34V43H30V39Z" fill="#FFFFFF" />
                        <path d="M28 43H36V45H28V43Z" fill="#FFFFFF" />
                        <defs>
                          <linearGradient id="grammarShield" x1="10" y1="4" x2="54" y2="70" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#F59E0B" />
                            <stop offset="1" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                    )}
                  </div>
                  <span className="ss-achievement-label">{ach.title}</span>
                </div>
              ))}
            </div>
          </div>
            </section>
          </>
        )}
      </main>

      {/* ====================================================================
          60-SECOND CHALLENGE PRACTICE MODAL
      ==================================================================== */}
      {isChallengeModalOpen && (
        <div className="ss-modal-overlay">
          <div className="ss-modal-card">
            <div className="ss-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🎙️</span>
                <div>
                  <h2 style={{ fontSize: "17px", fontWeight: "800", margin: 0, color: "#1C2033" }}>
                    60-Second Speaking Sprint
                  </h2>
                  <p style={{ fontSize: "12px", color: "#8E98B0", margin: 0 }}>
                    Speak clearly on the topic below. AI will analyze your speech.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ss-modal-close-btn"
                onClick={() => setIsChallengeModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Topic Prompt */}
            <div className="ss-topic-box">
              <span className="ss-topic-label">Your Prompt</span>
              <p className="ss-topic-text">{selectedTopic}</p>
            </div>

            {/* Live Audio Waveform / Timer */}
            <div style={{ textAlign: "center", padding: "6px 0" }}>
              <div className="ss-timer-display">
                00:{countdown < 10 ? `0${countdown}` : countdown}
              </div>

              <div className="ss-recording-visualizer">
                {[12, 28, 45, 18, 36, 52, 24, 40, 16, 30, 48, 20, 38, 50, 14].map((h, i) => (
                  <span
                    key={i}
                    className={`ss-audio-bar ${recordingState === "recording" ? "active" : ""}`}
                    style={{
                      height: recordingState === "recording" ? `${h}px` : "12px",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>

              {recordingState === "idle" && (
                <p style={{ fontSize: "12.5px", color: "#8E98B0" }}>
                  Take a breath and click <strong>Start Recording</strong> when ready!
                </p>
              )}

              {recordingState === "recording" && (
                <p style={{ fontSize: "12.5px", color: "#EF4444", fontWeight: "600" }}>
                  🔴 Live Recording in progress... Keep speaking!
                </p>
              )}

              {recordingState === "analyzing" && (
                <p style={{ fontSize: "12.5px", color: "#5D5FEF", fontWeight: "600" }}>
                  ⚡ AI is evaluating your speech metrics (Fluency, Grammar, Tone)...
                </p>
              )}

              {recordingState === "completed" && (
                <div style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginTop: "8px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "700", color: "#166534", fontSize: "14px" }}>
                      🎉 Challenge Completed!
                    </span>
                    <span style={{
                      background: "#16A34A",
                      color: "#FFFFFF",
                      padding: "3px 9px",
                      borderRadius: "999px",
                      fontWeight: "800",
                      fontSize: "12px",
                    }}>
                      Score: 90 / 100
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#15803D", margin: "6px 0 0 0", textAlign: "left" }}>
                    Great pacing (136 WPM) and clear structure. Minor recommendation: Minimize filler pauses in transition sentences.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              {recordingState === "idle" && (
                <button
                  type="button"
                  className="ss-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleStartRecording}
                >
                  🎙️ Start Recording
                </button>
              )}

              {recordingState === "recording" && (
                <button
                  type="button"
                  className="ss-btn-primary"
                  style={{ width: "100%", justifyContent: "center", background: "#EF4444" }}
                  onClick={handleStopRecording}
                >
                  ⏹️ Stop & Submit
                </button>
              )}

              {recordingState === "completed" && (
                <button
                  type="button"
                  className="ss-btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={() => setIsChallengeModalOpen(false)}
                >
                  Done & Save Attempt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ATTEMPT DETAILS MODAL
      ==================================================================== */}
      {selectedAttempt && (
        <div className="ss-modal-overlay" onClick={() => setSelectedAttempt(null)}>
          <div className="ss-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ss-modal-header">
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: "800", margin: 0, color: "#1C2033" }}>
                  {selectedAttempt.title}
                </h2>
                <p style={{ fontSize: "12px", color: "#8E98B0", margin: "2px 0 0 0" }}>
                  Recorded on {selectedAttempt.date}
                </p>
              </div>
              <button
                type="button"
                className="ss-modal-close-btn"
                onClick={() => setSelectedAttempt(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              <div style={{ background: "#F8F9FE", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "10.5px", color: "#8E98B0", fontWeight: "600" }}>SCORE</span>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#10B981" }}>
                  {selectedAttempt.score}
                </div>
              </div>
              <div style={{ background: "#F8F9FE", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "10.5px", color: "#8E98B0", fontWeight: "600" }}>SPEED</span>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#5D5FEF" }}>
                  {selectedAttempt.wpm} <span style={{ fontSize: "11px" }}>wpm</span>
                </div>
              </div>
              <div style={{ background: "#F8F9FE", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
                <span style={{ fontSize: "10.5px", color: "#8E98B0", fontWeight: "600" }}>CLARITY</span>
                <div style={{ fontSize: "22px", fontWeight: "800", color: "#F59E0B" }}>
                  {selectedAttempt.clarity}
                </div>
              </div>
            </div>

            <div style={{ background: "#F7F8FE", border: "1px solid #EEF1F8", borderRadius: "12px", padding: "12px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#5D5FEF" }}>AI Feedback Summary</span>
              <p style={{ fontSize: "13px", color: "#1C2033", margin: "4px 0 0 0", lineHeight: "1.5" }}>
                {selectedAttempt.feedback}
              </p>
            </div>

            <button
              type="button"
              className="ss-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setSelectedAttempt(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          ACHIEVEMENT MODAL
      ==================================================================== */}
      {selectedAchievement && (
        <div className="ss-modal-overlay" onClick={() => setSelectedAchievement(null)}>
          <div className="ss-modal-card" style={{ maxWidth: "400px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div className="ss-modal-header" style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                className="ss-modal-close-btn"
                onClick={() => setSelectedAchievement(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "44px" }}>🏆</div>
              <h2 style={{ fontSize: "19px", fontWeight: "800", margin: 0, color: "#1C2033" }}>
                {selectedAchievement.title}
              </h2>
              <span style={{ fontSize: "11.5px", color: "#10B981", fontWeight: "700", background: "#E8F8F0", padding: "3px 9px", borderRadius: "999px" }}>
                Unlocked on {selectedAchievement.unlocked}
              </span>
              <p style={{ fontSize: "13px", color: "#58627A", margin: "8px 0 14px 0" }}>
                {selectedAchievement.desc}
              </p>
            </div>

            <button
              type="button"
              className="ss-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setSelectedAchievement(null)}
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
