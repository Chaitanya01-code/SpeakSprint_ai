import React, { useEffect, useState } from "react";
import "./analytics.css";

const Analytics = () => {
  // Timeframe dropdown state
  const [timeframe, setTimeframe] = useState("This Month");
  const [showDropdown, setShowDropdown] = useState(false);

  // Timeframe datasets for interactive switching
  const analyticsDataSets = {
    "This Month": {
      metrics: {
        avgScore: "84.2",
        challenges: "12",
        speakingTime: "3h 24m",
        bestScore: "92",
      },
      trendPoints: [
        { score: 65, date: "May 10", x: 45, y: 195 },
        { score: 72, date: "", x: 140, y: 165 },
        { score: 78, date: "May 15", x: 235, y: 140 },
        { score: 84, date: "May 20", x: 330, y: 115 },
        { score: 82, date: "", x: 425, y: 125 },
        { score: 88, date: "May 25", x: 520, y: 95 },
        { score: 92, date: "May 30", x: 615, y: 75, isPeak: true },
      ],
      skills: [
        { name: "Fluency", score: 86, angle: -90 },
        { name: "Grammar", score: 91, angle: -30 },
        { name: "Vocabulary", score: 84, angle: 30 },
        { name: "Pronunciation", score: 82, angle: 90 },
        { name: "Speed", score: 90, angle: 150 },
        { name: "Relevance", score: 93, angle: 210 },
      ],
    },
    "Last Month": {
      metrics: {
        avgScore: "79.5",
        challenges: "16",
        speakingTime: "4h 10m",
        bestScore: "88",
      },
      trendPoints: [
        { score: 60, date: "Apr 05", x: 45, y: 205 },
        { score: 68, date: "", x: 140, y: 178 },
        { score: 74, date: "Apr 12", x: 235, y: 155 },
        { score: 79, date: "Apr 19", x: 330, y: 135 },
        { score: 76, date: "", x: 425, y: 145 },
        { score: 85, date: "Apr 26", x: 520, y: 110 },
        { score: 88, date: "Apr 30", x: 615, y: 95, isPeak: true },
      ],
      skills: [
        { name: "Fluency", score: 80, angle: -90 },
        { name: "Grammar", score: 84, angle: -30 },
        { name: "Vocabulary", score: 78, angle: 30 },
        { name: "Pronunciation", score: 79, angle: 90 },
        { name: "Speed", score: 82, angle: 150 },
        { name: "Relevance", score: 86, angle: 210 },
      ],
    },
    "This Week": {
      metrics: {
        avgScore: "87.6",
        challenges: "5",
        speakingTime: "1h 15m",
        bestScore: "92",
      },
      trendPoints: [
        { score: 75, date: "Mon", x: 45, y: 160 },
        { score: 78, date: "", x: 140, y: 145 },
        { score: 82, date: "Wed", x: 235, y: 130 },
        { score: 85, date: "Thu", x: 330, y: 118 },
        { score: 84, date: "", x: 425, y: 122 },
        { score: 89, date: "Sat", x: 520, y: 92 },
        { score: 92, date: "Sun", x: 615, y: 75, isPeak: true },
      ],
      skills: [
        { name: "Fluency", score: 88, angle: -90 },
        { name: "Grammar", score: 93, angle: -30 },
        { name: "Vocabulary", score: 86, angle: 30 },
        { name: "Pronunciation", score: 85, angle: 90 },
        { name: "Speed", score: 92, angle: 150 },
        { name: "Relevance", score: 95, angle: 210 },
      ],
    },
  };

  const [currentData, setCurrentData] = useState({
    metrics: { avgScore: null, challenges: null, speakingTime: null, bestScore: null },
    trendPoints: [],
    skills: [],
  });

  useEffect(() => {
    if (!authUser?.user_id) return;
    fetch(`http://localhost:8000/api/v1/transcripts?user_id=${authUser.user_id}`)
      .then((response) => response.json())
      .then((transcripts) => {
        const seconds = transcripts.reduce((total, item) => total + item.duration_seconds, 0);
        setCurrentData({
          metrics: {
            avgScore: "-",
            challenges: transcripts.length,
            speakingTime: `${Math.floor(seconds / 60)}m`,
            bestScore: "-",
          },
          trendPoints: transcripts.slice(0, 7).reverse().map((item, index) => ({
            score: 0,
            date: new Date(item.created_at).toLocaleDateString(),
            x: 45 + index * 95,
            y: 205,
          })),
          skills: [],
        });
      })
      .catch((error) => console.warn("Unable to load analytics", error));
  }, [authUser?.user_id]);

  // Radar chart geometry calculations
  const radarCenter = { x: 135, y: 110 };
  const radarRadius = 72;

  const calculateRadarPoint = (angleDeg, value) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * radarRadius;
    return {
      x: radarCenter.x + r * Math.cos(angleRad),
      y: radarCenter.y + r * Math.sin(angleRad),
    };
  };

  const hexagonLevels = [0.25, 0.5, 0.75, 1.0];

  const userPolygonPoints = currentData.skills
    .map((skill) => {
      const pt = calculateRadarPoint(skill.angle, skill.score);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  return (
    <div className="ss-analytics-page">
      {/* ====================================================================
          1. HEADER (Title & Timeframe Dropdown)
      ==================================================================== */}
      <header className="ss-analytics-header">
        <h1 className="ss-analytics-title">Analytics</h1>

        <div className="ss-analytics-dropdown-wrap">
          <button
            type="button"
            className="ss-analytics-dropdown-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{timeframe}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showDropdown && (
            <div className="ss-analytics-dropdown-menu">
              {Object.keys(analyticsDataSets).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={`ss-analytics-dropdown-item ${tf === timeframe ? "active" : ""}`}
                  onClick={() => {
                    setTimeframe(tf);
                    setShowDropdown(false);
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ====================================================================
          2. 4 METRIC STAT CARDS
      ==================================================================== */}
      <section className="ss-analytics-stats-grid">
        {/* Card 1: Avg Score */}
        <div className="ss-astat-card">
          <span className="ss-astat-label">Avg Score</span>
          <div className="ss-astat-value">{currentData.metrics.avgScore}</div>
        </div>

        {/* Card 2: Challenges */}
        <div className="ss-astat-card">
          <span className="ss-astat-label">Challenges</span>
          <div className="ss-astat-value">{currentData.metrics.challenges}</div>
        </div>

        {/* Card 3: Speaking Time */}
        <div className="ss-astat-card">
          <span className="ss-astat-label">Speaking Time</span>
          <div className="ss-astat-value">{currentData.metrics.speakingTime}</div>
        </div>

        {/* Card 4: Best Score */}
        <div className="ss-astat-card">
          <span className="ss-astat-label">Best Score</span>
          <div className="ss-astat-value">{currentData.metrics.bestScore}</div>
        </div>
      </section>

      {/* ====================================================================
          3. SCORE TREND SECTION
      ==================================================================== */}
      <section className="ss-trend-card">
        <div className="ss-trend-card-header">
          <h2 className="ss-trend-title">Score Trend</h2>
        </div>

        <div className="ss-trend-chart-container">
          {currentData.trendPoints.length === 0 && <div style={{ padding: "100px 0", textAlign: "center" }}>null</div>}
          <svg viewBox="0 0 660 250" className="ss-trend-svg" preserveAspectRatio="none">
            <line x1="25" y1="220" x2="635" y2="220" className="ss-trend-axis-line" />

            {/* Score bars and labels */}
            {currentData.trendPoints.map((pt, idx) => (
              <g key={idx} className="ss-trend-bar-group">
                <rect
                  x={pt.x - 25}
                  y={220 - Math.max(12, ((pt.score - 50) / 50) * 145)}
                  width="50"
                  height={Math.max(12, ((pt.score - 50) / 50) * 145)}
                  rx="6"
                  className={`ss-trend-bar ${pt.isPeak ? "peak" : ""}`}
                />
                <text
                  x={pt.x}
                  y={220 - Math.max(12, ((pt.score - 50) / 50) * 145) - 10}
                  className="ss-trend-point-text"
                >
                  {pt.score}
                </text>
                {pt.date && (
                  <text x={pt.x} y="240" className="ss-trend-axis-date">
                    {pt.date}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </section>

      {/* ====================================================================
          4. SKILLS RADAR & PROGRESS SECTION
      ==================================================================== */}
      <section className="ss-skills-card">
        <h2 className="ss-skills-title">Skills Radar</h2>

        <div className="ss-skills-content-grid">
          {/* Left: Hexagonal Radar Chart */}
          <div className="ss-radar-wrap">
            {currentData.skills.length === 0 && <div style={{ padding: "100px 0", textAlign: "center" }}>null</div>}
            <svg viewBox="0 0 270 230" className="ss-radar-svg-analytics">
              {/* Concentric Hexagons */}
              {hexagonLevels.map((lvl, lvlIdx) => {
                const points = currentData.skills
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
                    stroke="#E2E8F0"
                    strokeDasharray={lvlIdx === 3 ? "none" : "2.5 2.5"}
                    strokeWidth="1.2"
                  />
                );
              })}

              {/* Axis Spokes from center */}
              {currentData.skills.map((s, idx) => {
                const outer = calculateRadarPoint(s.angle, 100);
                return (
                  <line
                    key={idx}
                    x1={radarCenter.x}
                    y1={radarCenter.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                );
              })}

              {/* User Polygon Fill & Stroke */}
              <polygon
                points={userPolygonPoints}
                fill="rgba(93, 95, 239, 0.12)"
                stroke="#5D5FEF"
                strokeWidth="2.2"
              />

              {/* Vertex Dots */}
              {currentData.skills.map((s, idx) => {
                const pt = calculateRadarPoint(s.angle, s.score);
                return (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#5D5FEF"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />
                );
              })}

              {/* Axis Labels */}
              {currentData.skills.map((s, idx) => {
                const labelPt = calculateRadarPoint(s.angle, 130);
                let textAnchor = "middle";
                if (labelPt.x < radarCenter.x - 10) textAnchor = "end";
                if (labelPt.x > radarCenter.x + 10) textAnchor = "start";

                return (
                  <text
                    key={idx}
                    x={labelPt.x}
                    y={labelPt.y + 4}
                    textAnchor={textAnchor}
                    fill="#475569"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="var(--ss-font-main)"
                  >
                    {s.name}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Right: Horizontal Skill Progress Bars */}
          <div className="ss-progress-list">
            {currentData.skills.length === 0 ? <div style={{ padding: "100px 0", textAlign: "center" }}>null</div> : currentData.skills.map((skill) => (
              <div key={skill.name} className="ss-progress-item">
                <span className="ss-progress-name">{skill.name}</span>
                <div className="ss-progress-track">
                  <div
                    className="ss-progress-fill"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
                <span className="ss-progress-score">{skill.score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
