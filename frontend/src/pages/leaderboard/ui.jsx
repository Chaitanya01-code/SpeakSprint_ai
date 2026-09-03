import React, { useState } from "react";
import "./leaderboard.css";

  const Leaderboard = () => {
  // Timeframe selector state
  const [timeframe, setTimeframe] = useState("This Week");
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);

  // Scope filter tab state
  const [activeScope, setActiveScope] = useState("All");

  // View full leaderboard expanded state
  const [isExpanded, setIsExpanded] = useState(false);

  // Selected user modal state
  const [selectedUser, setSelectedUser] = useState(null);

  // Scope tabs list matching the screenshot
  const scopeTabs = ["All", "College", "Department", "Year"];

  // Full rankings dataset matching screenshot (Top 5 visible by default)
  const rankingDatasets = {
    All: [
      {
        rank: 1,
        name: "Riya Patel",
        score: 95,
        streak: 10,
        isCurrentUser: false,
        department: "Computer Science",
        college: "Tech Institute",
        avatarBg: "#FCE7F3",
        gender: "female",
        wpm: 146,
        clarity: "96%",
      },
      {
        rank: 2,
        name: "Aditya Sharma",
        badge: "(You)",
        score: 93,
        streak: 7,
        isCurrentUser: true,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#C7D2FE",
        gender: "male-glasses",
        wpm: 138,
        clarity: "92%",
      },
      {
        rank: 3,
        name: "Arjun Verma",
        score: 91,
        streak: 12,
        isCurrentUser: false,
        department: "Electronics & Comm.",
        college: "Tech Institute",
        avatarBg: "#FEF3C7",
        gender: "male",
        wpm: 142,
        clarity: "94%",
      },
      {
        rank: 4,
        name: "Neha Singh",
        score: 89,
        streak: 6,
        isCurrentUser: false,
        department: "Data Science",
        college: "Tech Institute",
        avatarBg: "#E0E7FF",
        gender: "female-long",
        wpm: 135,
        clarity: "90%",
      },
      {
        rank: 5,
        name: "Karan Mehta",
        score: 87,
        streak: 5,
        isCurrentUser: false,
        department: "Computer Science",
        college: "Tech Institute",
        avatarBg: "#DCFCE7",
        gender: "female-dark",
        wpm: 130,
        clarity: "88%",
      },
      {
        rank: 6,
        name: "Ananya Roy",
        score: 86,
        streak: 8,
        isCurrentUser: false,
        department: "Mechanical Eng.",
        college: "Tech Institute",
        avatarBg: "#F3E8FF",
        gender: "female",
        wpm: 132,
        clarity: "89%",
      },
      {
        rank: 7,
        name: "Rohan Gupta",
        score: 85,
        streak: 4,
        isCurrentUser: false,
        department: "Electrical Eng.",
        college: "Tech Institute",
        avatarBg: "#FFE4E6",
        gender: "male",
        wpm: 128,
        clarity: "86%",
      },
      {
        rank: 8,
        name: "Sneha Reddy",
        score: 84,
        streak: 9,
        isCurrentUser: false,
        department: "Bio-Technology",
        college: "Tech Institute",
        avatarBg: "#CCFBF1",
        gender: "female-long",
        wpm: 134,
        clarity: "87%",
      },
    ],
    College: [
      {
        rank: 1,
        name: "Aditya Sharma",
        badge: "(You)",
        score: 93,
        streak: 7,
        isCurrentUser: true,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#C7D2FE",
        gender: "male-glasses",
        wpm: 138,
        clarity: "92%",
      },
      {
        rank: 2,
        name: "Arjun Verma",
        score: 91,
        streak: 12,
        isCurrentUser: false,
        department: "Electronics & Comm.",
        college: "Tech Institute",
        avatarBg: "#FEF3C7",
        gender: "male",
        wpm: 142,
        clarity: "94%",
      },
      {
        rank: 3,
        name: "Karan Mehta",
        score: 87,
        streak: 5,
        isCurrentUser: false,
        department: "Computer Science",
        college: "Tech Institute",
        avatarBg: "#DCFCE7",
        gender: "female-dark",
        wpm: 130,
        clarity: "88%",
      },
      {
        rank: 4,
        name: "Rohan Gupta",
        score: 85,
        streak: 4,
        isCurrentUser: false,
        department: "Electrical Eng.",
        college: "Tech Institute",
        avatarBg: "#FFE4E6",
        gender: "male",
        wpm: 128,
        clarity: "86%",
      },
    ],
    Department: [
      {
        rank: 1,
        name: "Aditya Sharma",
        badge: "(You)",
        score: 93,
        streak: 7,
        isCurrentUser: true,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#C7D2FE",
        gender: "male-glasses",
        wpm: 138,
        clarity: "92%",
      },
      {
        rank: 2,
        name: "Sameer Joshi",
        score: 86,
        streak: 6,
        isCurrentUser: false,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#E0E7FF",
        gender: "male",
        wpm: 130,
        clarity: "89%",
      },
      {
        rank: 3,
        name: "Pooja Hegde",
        score: 83,
        streak: 4,
        isCurrentUser: false,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#FCE7F3",
        gender: "female",
        wpm: 126,
        clarity: "85%",
      },
    ],
    Year: [
      {
        rank: 1,
        name: "Riya Patel",
        score: 95,
        streak: 10,
        isCurrentUser: false,
        department: "Computer Science",
        college: "Tech Institute",
        avatarBg: "#FCE7F3",
        gender: "female",
        wpm: 146,
        clarity: "96%",
      },
      {
        rank: 2,
        name: "Aditya Sharma",
        badge: "(You)",
        score: 93,
        streak: 7,
        isCurrentUser: true,
        department: "Information Technology",
        college: "Tech Institute",
        avatarBg: "#C7D2FE",
        gender: "male-glasses",
        wpm: 138,
        clarity: "92%",
      },
      {
        rank: 3,
        name: "Neha Singh",
        score: 89,
        streak: 6,
        isCurrentUser: false,
        department: "Data Science",
        college: "Tech Institute",
        avatarBg: "#E0E7FF",
        gender: "female-long",
        wpm: 135,
        clarity: "90%",
      },
      {
        rank: 4,
        name: "Karan Mehta",
        score: 87,
        streak: 5,
        isCurrentUser: false,
        department: "Computer Science",
        college: "Tech Institute",
        avatarBg: "#DCFCE7",
        gender: "female-dark",
        wpm: 130,
        clarity: "88%",
      },
    ],
  };
  // Sample recent attempts data for Recent Attempts section
  const recentAttempts = [
    { id: 1, title: "The Future of AI", date: "May 16, 2024", score: 88, status: "green" },
    { id: 2, title: "Impact of Social Media", date: "May 15, 2024", score: 78, status: "orange" },
    { id: 3, title: "Online Education", date: "May 14, 2024", score: 92, status: "green" },
    { id: 4, title: "Sustainable Living", date: "May 13, 2024", score: 85, status: "green" },
  ];

  // Sample achievements data for Leaderboard page (mirroring dashboard achievements)
  const achievements = [
    { id: "first-challenge", title: "First Challenge", unlocked: "May 10, 2024", desc: "Completed your first 60-second speaking sprint", type: "first" },
    { id: "streak-7", title: "7-Day Streak", unlocked: "May 16, 2024", desc: "Practiced speaking consistently for 7 days in a row", type: "streak" },
    { id: "top-speaker", title: "Top Speaker", unlocked: "May 14, 2024", desc: "Scored 90+ points across multiple speech challenges", type: "speaker" },
    { id: "grammar-master", title: "Grammar Master", unlocked: "May 15, 2024", desc: "Achieved 95%+ grammatical precision in assessments", type: "grammar" },
  ];
  const currentRankings = [];
  const displayedRankings = isExpanded ? currentRankings : currentRankings.slice(0, 5);

  // Render Illustrated Avatar corresponding to gender/type
  const renderAvatarSvg = (gender, bg) => {
    if (gender === "male-glasses") {
      // Aditya avatar with glasses
      return (
        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%">
          <rect width="40" height="40" fill={bg} />
          <circle cx="20" cy="16" r="8" fill="#374151" />
          <circle cx="20" cy="17" r="7" fill="#FBBF24" />
          <path d="M14 14C15 10 25 10 26 14C26 14 25 9 20 9C15 9 14 14 14 14Z" fill="#1F2937" />
          {/* Glasses */}
          <rect x="15" y="15" width="4" height="3" rx="0.5" stroke="#1F2937" strokeWidth="0.8" fill="none" />
          <rect x="21" y="15" width="4" height="3" rx="0.5" stroke="#1F2937" strokeWidth="0.8" fill="none" />
          <line x1="19" y1="16.5" x2="21" y2="16.5" stroke="#1F2937" strokeWidth="0.8" />
          <path d="M18 20C19 21.5 21 21.5 22 20" stroke="#1F2937" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M9 35C9 28 14 25 20 25C26 25 31 28 31 35" fill="#3B82F6" />
        </svg>
      );
    } else if (gender === "female" || gender === "female-long" || gender === "female-dark") {
      // Female portrait
      return (
        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%">
          <rect width="40" height="40" fill={bg} />
          <circle cx="20" cy="16" r="8" fill="#1F2937" />
          <circle cx="20" cy="17" r="6.8" fill="#FCD34D" />
          {/* Hair sides */}
          <path d="M13 16C13 23 15 25 15 25M27 16C27 23 25 25 25 25" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="18" cy="16.5" r="1" fill="#1F2937" />
          <circle cx="22" cy="16.5" r="1" fill="#1F2937" />
          <path d="M18.5 20C19.5 21 20.5 21 21.5 20" stroke="#E11D48" strokeWidth="1" strokeLinecap="round" />
          <path d="M10 35C10 28 14 25 20 25C26 25 30 28 30 35" fill="#EC4899" />
        </svg>
      );
    } else {
      // Male portrait
      return (
        <svg viewBox="0 0 40 40" fill="none" width="100%" height="100%">
          <rect width="40" height="40" fill={bg} />
          <circle cx="20" cy="16" r="8" fill="#1F2937" />
          <circle cx="20" cy="17" r="7" fill="#FBBF24" />
          <path d="M14 13C16 9 24 9 26 13C26 13 24 8 20 8C16 8 14 13 14 13Z" fill="#1F2937" />
          <circle cx="17.5" cy="16" r="1" fill="#1F2937" />
          <circle cx="22.5" cy="16" r="1" fill="#1F2937" />
          <path d="M18 20C19 21.2 21 21.2 22 20" stroke="#1F2937" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M10 35C10 28 14 25 20 25C26 25 30 28 30 35" fill="#10B981" />
        </svg>
      );
    }
  };

  return (
    <div className="ss-leaderboard-page">
      {/* ====================================================================
          MAIN LEADERBOARD CARD
      ==================================================================== */}
      <div className="ss-leaderboard-card">
        {/* HEADER: Title & Timeframe Selector */}
        <header className="ss-leaderboard-header">
          <h1 className="ss-leaderboard-title">Leaderboard</h1>

          <div className="ss-timeframe-dropdown-wrap">
            <button
              type="button"
              className="ss-timeframe-btn"
              onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
            >
              <span>{timeframe}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showTimeframeDropdown && (
              <div className="ss-timeframe-menu">
                {["This Week", "This Month", "All Time"].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={`ss-timeframe-item ${tf === timeframe ? "active" : ""}`}
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
        </header>

        {/* SCOPE FILTER PILL TABS */}
        <div className="ss-scope-tabs-row">
          {scopeTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`ss-scope-tab-btn ${activeScope === tab ? "active" : ""}`}
              onClick={() => setActiveScope(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* RANKINGS TABLE */}
        <div className="ss-ranking-table">
          {/* Table Header */}
          <div className="ss-ranking-header-row">
            <span>Rank</span>
            <span>User</span>
            <span className="ss-col-score">Score</span>
            <span className="ss-col-streak">Streak</span>
          </div>

          {/* Table Rows matching screenshot */}
          {displayedRankings.length === 0 ? <div style={{ padding: "24px", textAlign: "center" }}>null</div> : displayedRankings.map((user) => (
            <div
              key={user.rank}
              className={`ss-ranking-item-row ${user.isCurrentUser ? "current-user" : ""}`}
              onClick={() => setSelectedUser(user)}
            >
              {/* Rank */}
              <div className="ss-rank-number">
                {user.rank}
              </div>

              {/* User Avatar + Name */}
              <div className="ss-user-cell">
                <div className="ss-user-avatar-circle">
                  {renderAvatarSvg(user.gender, user.avatarBg)}
                </div>
                <div className="ss-user-name-text">
                  <span>{user.name}</span>
                  {user.badge && (
                    <span className="ss-user-badge-you">{user.badge}</span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="ss-score-text">
                {user.score}
              </div>

              {/* Streak */}
              <div className="ss-streak-text">
                {user.streak}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM ACTION BUTTON */}
        <button
          type="button"
          className="ss-btn-view-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? "Show Top 5 Only" : "View Full Leaderboard"}</span>
          <span>{isExpanded ? "↑" : "→"}</span>
        </button>
      </div>

      {/* USER DETAIL MODAL (On user row click) */}
      {selectedUser && (
        <div
          className="ss-user-detail-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="ss-user-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#5D5FEF", textTransform: "uppercase" }}>
                Speaker Profile
              </span>
              <button
                type="button"
                style={{ background: "#F1F5F9", border: "none", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontWeight: "700" }}
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", overflow: "hidden", border: "2px solid #5D5FEF" }}>
                {renderAvatarSvg(selectedUser.gender, selectedUser.avatarBg)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#1C2033" }}>
                  {selectedUser.name} {selectedUser.badge}
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#8E98B0" }}>
                  {selectedUser.department} • {selectedUser.college}
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center" }}>
              <div style={{ background: "#F8F9FD", padding: "10px", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "#8E98B0", fontWeight: "600" }}>RANK</span>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#5D5FEF" }}>#{selectedUser.rank}</div>
              </div>
              <div style={{ background: "#F8F9FD", padding: "10px", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "#8E98B0", fontWeight: "600" }}>SCORE</span>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#10B981" }}>{selectedUser.score}</div>
              </div>
              <div style={{ background: "#F8F9FD", padding: "10px", borderRadius: "10px" }}>
                <span style={{ fontSize: "11px", color: "#8E98B0", fontWeight: "600" }}>STREAK</span>
                <div style={{ fontSize: "20px", fontWeight: "800", color: "#F59E0B" }}>🔥 {selectedUser.streak}</div>
              </div>
            </div>

            <div style={{ background: "#F4F5FD", padding: "12px 14px", borderRadius: "12px", fontSize: "12.5px", color: "#475569" }}>
              <strong>Speed & Articulation:</strong> Pacing at <strong>{selectedUser.wpm} WPM</strong> with <strong>{selectedUser.clarity}</strong> phonetic clarity in assessments.
            </div>

            <button
              type="button"
              className="ss-btn-view-full"
              style={{ margin: 0 }}
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
