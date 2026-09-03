import React, { useEffect, useState } from "react";
import "./admin.css";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "grid" },
  { id: "users", label: "Users", icon: "users" },
  { id: "challenges", label: "Challenges", icon: "flag" },
  { id: "attempts", label: "Attempts", icon: "mic" },
  { id: "speech-analysis", label: "Speech Analysis", icon: "bars" },
  { id: "ai-feedback", label: "AI Feedback", icon: "message" },
  { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
  { id: "achievements", label: "Achievements", icon: "award" },
  { id: "reports", label: "Reports & Analytics", icon: "chart" },
  { id: "logs", label: "System Logs", icon: "terminal" },
];

const metrics = [
  {
    label: "Total Users",
    value: "12,546",
    change: "+12.5%",
    icon: "users",
    tone: "purple",
  },
  {
    label: "Total Attempts",
    value: "45,231",
    change: "+15.3%",
    icon: "mic",
    tone: "blue",
  },
  {
    label: "Challenges Completed",
    value: "28,936",
    change: "+18.6%",
    icon: "check",
    tone: "green",
  },
  {
    label: "Avg. Score",
    value: "72.4",
    suffix: "/100",
    change: "+5.2%",
    icon: "star",
    tone: "orange",
  },
  {
    label: "Total Speaking Time",
    value: "2,548",
    suffix: "h",
    change: "+20.1%",
    icon: "clock",
    tone: "violet",
  },
  {
    label: "Transcriptions",
    value: "45,231",
    change: "+15.3%",
    icon: "wave",
    tone: "indigo",
  },
];

const users = [
  ["Ananya Sharma", "ananya@example.com", "120", "88.6", "98"],
  ["Rohit Verma", "rohit@example.com", "98", "85.2", "96"],
  ["Priya Singh", "priya@example.com", "110", "84.7", "95"],
  ["Karan Mehta", "karan@example.com", "105", "82.1", "94"],
  ["Sneha Patel", "sneha@example.com", "95", "81.3", "93"],
];

function Icon({ name, size = 18 }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    flag: (
      <>
        <path d="M5 21V4" />
        <path d="M5 4c6-4 8 4 14 0v10c-6 4-8-4-14 0" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    mic: (
      <>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" />
      </>
    ),
    bars: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V7" />
      </>
    ),
    message: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4A8.5 8.5 0 1 1 21 11.5Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4M9 2h6v2H9z" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="m15.5 12.5 1.5 9-5-3-5 3 1.5-9" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5M4 19h17" />
        <path d="m7 15 4-5 3 3 5-7" />
      </>
    ),
    terminal: (
      <>
        <path d="m4 17 6-6-6-6M12 19h8" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5v.2h-4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1-2.8-2.8.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3v-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1 2.8-2.8.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3h4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1 2.8 2.8-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1h.2v4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20M6 15h4" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M10 21h4" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    wave: (
      <>
        <path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M22 12h-1" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5M21 12H9" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function DashboardHome({ onNavigate }) {
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const loadUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/users");
        if (!response.ok) return;
        const users = await response.json();
        setTotalUsers(users.length);
      } catch (error) {
        console.warn("Unable to load total user count", error);
      }
    };

    loadUserCount();
  }, []);

  return (
    <>
      <div className="admin-page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Monitor your platform's performance and activities in real-time.
          </p>
        </div>
        <div className="admin-heading-actions">
          <button className="admin-date-button">
            <Icon name="calendar" size={15} /> May 10 - May 16, 2024{" "}
            <span>⌄</span>
          </button>
          <button className="admin-export-button">
            <Icon name="download" size={15} /> Export Report
          </button>
        </div>
      </div>
      <section className="admin-metrics-grid">
        {metrics.map((metric) => (
          <article className="admin-metric-card" key={metric.label}>
            <div className={`admin-metric-icon ${metric.tone}`}>
              <Icon name={metric.icon} size={21} />
            </div>
            <div>
              <span>{metric.label}</span>
              <strong>
                {metric.label === "Total Users" && totalUsers !== null
                  ? totalUsers.toLocaleString()
                  : metric.value}
                <small>{metric.suffix}</small>
              </strong>
              <em>
                ↑ {metric.change} <b>vs last week</b>
              </em>
            </div>
          </article>
        ))}
      </section>
      <section className="admin-dashboard-grid admin-top-grid">
        <article className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <h2>Attempts Over Time</h2>
            <button className="admin-small-select">This Week ⌄</button>
          </div>
          <div className="admin-line-chart">
            <div className="admin-y-labels">
              <span>10K</span>
              <span>8K</span>
              <span>6K</span>
              <span>4K</span>
              <span>2K</span>
              <span>0</span>
            </div>
            <div className="admin-chart-area">
              <div className="admin-grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg viewBox="0 0 500 190" preserveAspectRatio="none">
                <path
                  d="M15 135 C70 108 82 91 118 102 S163 120 195 107 S242 104 275 91 S327 77 360 52 S407 87 437 70 S470 50 490 40"
                  className="admin-chart-line"
                />
                <path
                  d="M15 135 C70 108 82 91 118 102 S163 120 195 107 S242 104 275 91 S327 77 360 52 S407 87 437 70 S470 50 490 40 L490 190 L15 190Z"
                  className="admin-chart-fill"
                />
                <circle cx="360" cy="52" r="4" className="admin-chart-dot" />
              </svg>
              <div className="admin-chart-dates">
                <span>May 10</span>
                <span>May 11</span>
                <span>May 12</span>
                <span>May 13</span>
                <span>May 14</span>
                <span>May 15</span>
                <span>May 16</span>
              </div>
            </div>
          </div>
        </article>
        <article className="admin-card admin-donut-card">
          <div className="admin-card-heading">
            <h2>Attempts by Category</h2>
          </div>
          <div className="admin-donut-content">
            <div className="admin-donut">
              <div>
                <strong>45,231</strong>
                <span>Total</span>
              </div>
            </div>
            <ul>
              <li>
                <i className="dot purple" />
                Technology <b>28%</b>
              </li>
              <li>
                <i className="dot blue" />
                Education <b>24%</b>
              </li>
              <li>
                <i className="dot yellow" />
                Social Issues <b>18%</b>
              </li>
              <li>
                <i className="dot teal" />
                Personal Growth <b>16%</b>
              </li>
              <li>
                <i className="dot green" />
                Business <b>8%</b>
              </li>
              <li>
                <i className="dot red" />
                Others <b>6%</b>
              </li>
            </ul>
          </div>
        </article>
        <article className="admin-card admin-activity-card">
          <div className="admin-card-heading">
            <h2>Recent Activities</h2>
            <button
              onClick={() => onNavigate("logs")}
              className="admin-link-button"
            >
              View All
            </button>
          </div>
          <ul className="admin-activity-list">
            <li>
              <span className="activity-icon purple">
                <Icon name="users" size={15} />
              </span>
              <div>
                <strong>New user registered</strong>
                <small>Rahul Verma joined the platform</small>
              </div>
              <time>2m ago</time>
            </li>
            <li>
              <span className="activity-icon green">
                <Icon name="check" size={15} />
              </span>
              <div>
                <strong>New challenge created</strong>
                <small>"The Future of AI" challenge added</small>
              </div>
              <time>15m ago</time>
            </li>
            <li>
              <span className="activity-icon orange">
                <Icon name="card" size={15} />
              </span>
              <div>
                <strong>System backup completed</strong>
                <small>Daily backup completed successfully</small>
              </div>
              <time>1h ago</time>
            </li>
            <li>
              <span className="activity-icon blue">
                <Icon name="star" size={15} />
              </span>
              <div>
                <strong>High scoring attempt</strong>
                <small>Ananya Sharma scored 96/100</small>
              </div>
              <time>2h ago</time>
            </li>
            <li>
              <span className="activity-icon green">
                <Icon name="users" size={15} />
              </span>
              <div>
                <strong>New institution onboarded</strong>
                <small>"ABC College" joined SpeakSprint AI</small>
              </div>
              <time>3h ago</time>
            </li>
          </ul>
        </article>
      </section>
      <section className="admin-dashboard-grid admin-bottom-grid">
        <article className="admin-card admin-table-card">
          <div className="admin-card-heading">
            <h2>Top Performing Users</h2>
            <button
              onClick={() => onNavigate("users")}
              className="admin-link-button"
            >
              View All
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Attempts</th>
                <th>Avg. Score</th>
                <th>Best Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user[0]}>
                  <td>
                    <span className={`rank rank-${index + 1}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <span className="user-avatar">{user[0].slice(0, 1)}</span>
                    <span className="table-user">
                      <b>{user[0]}</b>
                      <small>{user[1]}</small>
                    </span>
                  </td>
                  <td>{user[2]}</td>
                  <td>{user[3]}</td>
                  <td>{user[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="admin-card admin-topics-card">
          <div className="admin-card-heading">
            <h2>Popular Topics</h2>
            <button
              onClick={() => onNavigate("topics")}
              className="admin-link-button"
            >
              View All
            </button>
          </div>
          {[
            ["The Future of AI", "4,231", "78.6"],
            ["Social Media Impact", "3,982", "74.2"],
            ["Online Education", "3,421", "72.8"],
            ["Climate Change", "2,987", "71.3"],
            ["Self Confidence", "2,645", "70.1"],
          ].map((topic, index) => (
            <div className="topic-row" key={topic[0]}>
              <b>{topic[0]}</b>
              <span>{topic[1]}</span>
              <span>{topic[2]}</span>
              <i>
                <em style={{ width: `${76 - index * 12}%` }} />
              </i>
            </div>
          ))}
        </article>
        <article className="admin-card admin-health-card">
          <div className="admin-card-heading">
            <h2>System Health</h2>
          </div>
          {[
            "API Server",
            "Database",
            "Storage",
            "Audio Processing",
            "AI Model Service",
            "Backup Service",
          ].map((service) => (
            <div className="health-row" key={service}>
              <span>
                <Icon name="check" size={14} />
                {service}
              </span>
              <em>
                <i />
                Operational
              </em>
            </div>
          ))}
          <button
            onClick={() => onNavigate("logs")}
            className="admin-health-link"
          >
            View System Logs <Icon name="arrow" size={13} />
          </button>
        </article>
      </section>
    </>
  );
}

function ManagementPage({ page }) {
  const [challengeRows, setChallengeRows] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [attemptRows, setAttemptRows] = useState([]);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isUserCreateOpen, setIsUserCreateOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    domain: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [userCreateError, setUserCreateError] = useState("");
  const [isUserCreating, setIsUserCreating] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerError, setTimerError] = useState("");
  const [timerSaving, setTimerSaving] = useState(false);
  const [timerForm, setTimerForm] = useState("60");
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  useEffect(() => {
    if (page !== "users") return;

    const loadTimer = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/settings/session-duration",
        );
        if (!response.ok) throw new Error("Unable to load timer setting");
        const data = await response.json();
        const nextSeconds = Number(data.session_duration_seconds || 60);
        setTimerSeconds(nextSeconds);
        setTimerForm(String(nextSeconds));
      } catch (error) {
        setTimerError(error.message);
      }
    };

    loadTimer();
  }, [page]);

  useEffect(() => {
    if (page !== "challenges" && page !== "users" && page !== "attempts") return;

    if (page === "attempts") {
      const loadAttempts = async () => {
        setAttemptsLoading(true);
        setAttemptsError("");
        try {
          const response = await fetch("http://localhost:8000/api/v1/attempts");
          if (!response.ok) throw new Error("Unable to load attempts");
          const attempts = await response.json();
          setAttemptRows(attempts.map((attempt) => ({
            id: attempt.id,
            values: [
              attempt.learner,
              attempt.challenge,
              attempt.score === null ? "-" : `${attempt.score}/100`,
              attempt.duration,
              new Date(attempt.date).toLocaleDateString(),
            ],
          })));
        } catch (error) {
          setAttemptsError(error.message);
          setAttemptRows([]);
        } finally {
          setAttemptsLoading(false);
        }
      };
      loadAttempts();
      return;
    }

    if (page === "users") {
      const loadUsers = async () => {
        setUsersLoading(true);
        setUsersError("");
        try {
          const response = await fetch("http://localhost:8000/api/v1/users");
          if (!response.ok) throw new Error("Unable to load users");
          const users = await response.json();
          setUserRows(
            users.map((user) => ({
              id: user.id,
              isAdmin: user.is_admin,
              values: [
                `${user.username || "Unnamed user"} - ${user.email}`,
                user.domain || "Independent",
                user.role || "user",
                "-",
                user.is_active ? "Active" : "Inactive",
              ],
            })),
          );
        } catch (error) {
          setUsersError(error.message);
          setUserRows([]);
        } finally {
          setUsersLoading(false);
        }
      };
      loadUsers();
      return;
    }

    const loadTopics = async () => {
      setTopicsLoading(true);
      setTopicsError("");

      try {
        const response = await fetch("http://localhost:8000/api/v1/topics");
        if (!response.ok) throw new Error("Unable to load topics");

        const topics = await response.json();
        setChallengeRows(
          topics.map((topic) => ({
            id: topic.id,
            values: [
              topic.topic_name,
              topic.description || "General",
              "-",
              "-",
              "Published",
            ],
          })),
        );
      } catch (error) {
        setTopicsError(error.message);
        setChallengeRows([]);
      } finally {
        setTopicsLoading(false);
      }
    };

    loadTopics();
  }, [page]);

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setChallengeName("");
    setChallengeDescription("");
    setCreateError("");
  };

  const createChallenge = async (event) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateError("");

    try {
      const response = await fetch("http://localhost:8000/api/v1/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_name: challengeName.trim(),
          description: challengeDescription.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Unable to create challenge");
      }

      const topic = await response.json();
      setChallengeRows((currentRows) => [
        {
          id: topic.id,
          values: [
            topic.topic_name,
            topic.description || "General",
            "-",
            "-",
            "Published",
          ],
        },
        ...currentRows,
      ]);
      closeCreateDialog();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteChallenge = async (topicId, topicName) => {
    if (!window.confirm(`Delete "${topicName}"?`)) return;

    setTopicsError("");
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/topics/${topicId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Unable to delete challenge");
      }
      setChallengeRows((currentRows) =>
        currentRows.filter((row) => row.id !== topicId),
      );
    } catch (error) {
      setTopicsError(error.message);
    }
  };

  const closeUserDialog = () => {
    if (isUserCreating) return;
    setIsUserCreateOpen(false);
    setUserForm({
      name: "",
      domain: "",
      email: "",
      password: "",
      confirm_password: "",
    });
    setUserCreateError("");
  };

  const createUser = async (event) => {
    event.preventDefault();
    setIsUserCreating(true);
    setUserCreateError("");
    try {
      const response = await fetch("http://localhost:8000/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userForm,
          name: userForm.name.trim(),
          domain: userForm.domain.trim() || null,
          email: userForm.email.trim(),
        }),
      });
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Unable to create user");
      }
      const user = await response.json();
      setUserRows((currentRows) => [
        {
          id: user.id,
          isAdmin: user.is_admin,
          values: [
            `${user.username || "Unnamed user"} - ${user.email}`,
            user.domain || "Independent",
            user.role || "user",
            "-",
            user.is_active ? "Active" : "Inactive",
          ],
        },
        ...currentRows,
      ]);
      closeUserDialog();
    } catch (error) {
      setUserCreateError(error.message);
    } finally {
      setIsUserCreating(false);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete "${userName}"?`)) return;
    setUsersError("");
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/${userId}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Unable to delete user");
      }
      setUserRows((currentRows) =>
        currentRows.filter((row) => row.id !== userId),
      );
    } catch (error) {
      setUsersError(error.message);
    }
  };

  const saveTimer = async (event) => {
    event.preventDefault();
    const value = Number(timerForm);
    if (!Number.isFinite(value) || value <= 0) {
      setTimerError("Timer must be a positive number of seconds.");
      return;
    }

    setTimerSaving(true);
    setTimerError("");
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/settings/session-duration",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_duration_seconds: value }),
        },
      );
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail || "Unable to update timer");
      }
      const data = await response.json();
      const nextSeconds = Number(data.session_duration_seconds || value);
      setTimerSeconds(nextSeconds);
      setTimerForm(String(nextSeconds));
    } catch (error) {
      setTimerError(error.message);
    } finally {
      setTimerSaving(false);
    }
  };

  const configs = {
    users: {
      title: "Users",
      subtitle: "Manage accounts, institutions, and access levels.",
      action: "Add User",
      columns: ["User", "Institution", "Role", "Attempts", "Status"],
      rows: [
        ["Ananya Sharma", "ABC College", "Student", "120", "Active"],
        ["Rohit Verma", "Tech Institute", "Student", "98", "Active"],
        ["Priya Singh", "North University", "Student", "110", "Active"],
        ["Karan Mehta", "ABC College", "Moderator", "105", "Pending"],
      ],
    },
    challenges: {
      title: "Challenges",
      subtitle: "Create and curate speaking challenges for learners.",
      action: "Create Challenge",
      columns: ["Challenge", "Category", "Attempts", "Completion", "Status"],
      rows: [
        ["The Future of AI", "Technology", "4,231", "86%", "Live"],
        ["Social Media Impact", "Social Issues", "3,982", "79%", "Live"],
        ["Climate Change", "Environment", "2,987", "71%", "Draft"],
      ],
    },
    topics: {
      title: "Topics",
      subtitle: "Organize the topic library used in speaking sprints.",
      action: "Add Topic",
      columns: ["Topic", "Category", "Attempts", "Avg. Score", "Status"],
      rows: [
        ["The Future of AI", "Technology", "4,231", "78.6", "Published"],
        ["Online Education", "Education", "3,421", "72.8", "Published"],
        ["Self Confidence", "Personal Growth", "2,645", "70.1", "Published"],
      ],
    },
    attempts: {
      title: "Attempts",
      subtitle: "Review learner submissions and assessment activity.",
      action: "Export Attempts",
      columns: ["Learner", "Challenge", "Score", "Duration", "Date"],
      rows: [
        ["Ananya Sharma", "The Future of AI", "96/100", "58 sec", "Today"],
        ["Rohit Verma", "Online Education", "89/100", "60 sec", "Today"],
        ["Priya Singh", "Climate Change", "84/100", "55 sec", "Yesterday"],
      ],
    },
    "speech-analysis": {
      title: "Speech Analysis",
      subtitle: "Monitor fluency, clarity, pace, and pronunciation signals.",
      action: "View Reports",
      columns: ["Metric", "Average", "Change", "Samples", "Health"],
      rows: [
        ["Fluency", "86%", "+4.2%", "45,231", "Strong"],
        ["Pronunciation", "82%", "+2.8%", "45,231", "Strong"],
        ["Speaking Pace", "138 WPM", "+1.4%", "45,231", "Stable"],
      ],
    },
    "ai-feedback": {
      title: "AI Feedback",
      subtitle: "Review automated coaching quality and model activity.",
      action: "Model Settings",
      columns: ["Model", "Requests", "Accuracy", "Latency", "Status"],
      rows: [
        ["Speech Coach v2", "28,936", "94.2%", "420 ms", "Operational"],
        ["Grammar Coach", "16,482", "96.1%", "280 ms", "Operational"],
        ["Topic Relevance", "12,548", "91.8%", "310 ms", "Operational"],
      ],
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "Manage rankings and recognize high-performing speakers.",
      action: "Export Rankings",
      columns: ["Rank", "User", "Score", "Streak", "Institution"],
      rows: [
        ["1", "Riya Patel", "95", "10 days", "Tech Institute"],
        ["2", "Aditya Sharma", "93", "7 days", "Tech Institute"],
        ["3", "Arjun Verma", "91", "12 days", "Tech Institute"],
      ],
    },
    achievements: {
      title: "Achievements",
      subtitle: "Configure milestones that reward learner progress.",
      action: "Create Achievement",
      columns: ["Achievement", "Unlocked", "Completion", "Reward", "Status"],
      rows: [
        ["7-Day Streak", "8,421", "67%", "Badge", "Active"],
        ["Top Speaker", "2,306", "18%", "Badge", "Active"],
        ["Grammar Master", "1,894", "15%", "Badge", "Active"],
      ],
    },
    reports: {
      title: "Reports & Analytics",
      subtitle: "Turn platform activity into decisions with clear reporting.",
      action: "Generate Report",
      columns: ["Report", "Period", "Owner", "Updated", "Status"],
      rows: [
        [
          "Weekly Platform Summary",
          "May 10 - May 16",
          "Admin",
          "2m ago",
          "Ready",
        ],
        ["Institution Performance", "May 2024", "Admin", "1h ago", "Ready"],
        [
          "Speech Quality Trends",
          "Q2 2024",
          "Admin",
          "Yesterday",
          "Processing",
        ],
      ],
    },
    logs: {
      title: "System Logs",
      subtitle: "Track platform events, integrations, and operational health.",
      action: "Download Logs",
      columns: ["Event", "Service", "Time", "Severity", "Status"],
      rows: [
        ["Backup completed", "Database", "2m ago", "Info", "Success"],
        ["Model request spike", "AI Feedback", "15m ago", "Notice", "Resolved"],
        ["New institution sync", "Accounts", "1h ago", "Info", "Success"],
      ],
    },
    settings: {
      title: "Settings",
      subtitle: "Control workspace preferences and administrator access.",
      action: "Save Settings",
      columns: ["Setting", "Current Value", "Scope", "Last Updated", "Owner"],
      rows: [
        ["Challenge duration", "60 seconds", "Global", "Today", "Admin"],
        ["Feedback model", "Speech Coach v2", "Global", "Yesterday", "Admin"],
        ["Review threshold", "80 points", "Global", "May 10", "Admin"],
      ],
    },
    subscription: {
      title: "Subscription",
      subtitle: "Manage plans, billing, and institution subscriptions.",
      action: "Add Plan",
      columns: ["Institution", "Plan", "Users", "Renewal", "Status"],
      rows: [
        ["ABC College", "Enterprise", "2,480", "Jun 12, 2024", "Active"],
        ["Tech Institute", "Professional", "1,920", "Jun 20, 2024", "Active"],
        ["North University", "Starter", "640", "May 28, 2024", "Trial"],
      ],
    },
    notifications: {
      title: "Notifications",
      subtitle: "Review system alerts and administrator announcements.",
      action: "Create Notice",
      columns: ["Notification", "Audience", "Sent", "Created By", "Status"],
      rows: [
        [
          "New daily challenge is live",
          "All learners",
          "12,546",
          "Admin",
          "Sent",
        ],
        ["Scheduled maintenance", "All users", "12,546", "Admin", "Scheduled"],
        ["Institution onboarding", "Admins", "48", "Admin", "Draft"],
      ],
    },
  };
  const config = configs[page] || configs.users;
  const rows =
    page === "challenges"
      ? challengeRows
      : page === "users"
        ? userRows
        : page === "attempts"
          ? attemptRows
        : config.rows;
  const loading =
    page === "challenges"
      ? topicsLoading
      : page === "users"
        ? usersLoading
        : page === "attempts"
          ? attemptsLoading
        : false;
  const loadError =
    page === "challenges"
      ? topicsError
      : page === "users"
        ? usersError
        : page === "attempts"
          ? attemptsError
          : "";
  return (
    <div className="admin-management-page">
      <div className="admin-page-heading">
        <div>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </div>
        <div className="admin-heading-actions">
          {page === "users" && (
            <button
              className="admin-date-button"
              type="button"
              onClick={() => {
                setTimerError("");
                setIsTimerOpen(true);
              }}
            >
              <Icon name="clock" size={15} />
              Set Session Timer
            </button>
          )}
          <button
            className="admin-export-button"
            onClick={() => {
              if (page === "challenges") setIsCreateOpen(true);
              if (page === "users") setIsUserCreateOpen(true);
            }}
          >
            + {config.action}
          </button>
        </div>
      </div>
      <div className="admin-toolbar">
        <label>
          <Icon name="search" size={16} />
          <input placeholder={`Search ${config.title.toLowerCase()}...`} />
        </label>
        <button>All statuses ⌄</button>
        <button>Newest first ⌄</button>
      </div>
      <article className="admin-card admin-management-card">
        <table>
          <thead>
            <tr>
              {config.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={config.columns.length + 1}>Loading {page}...</td>
              </tr>
            )}
            {loadError && (
              <tr>
                <td colSpan={config.columns.length + 1}>{loadError}</td>
              </tr>
            )}
            {!loading &&
              !loadError &&
              rows.map((entry) => {
                const values =
                  page === "challenges" || page === "users"
                    ? entry.values
                    : entry;
                return (
                  <tr
                    key={
                      page === "challenges" || page === "users"
                        ? entry.id
                        : entry[0]
                    }
                  >
                    {values.map((cell, index) => (
                      <td key={`${cell}-${index}`}>
                        <span
                          className={
                            index === values.length - 1 ? "status-pill" : ""
                          }
                        >
                          {cell}
                        </span>
                      </td>
                    ))}
                    <td>
                      {page === "challenges" ? (
                        <button
                          className="admin-row-action admin-delete-action"
                          onClick={() => deleteChallenge(entry.id, values[0])}
                        >
                          Delete
                        </button>
                      ) : page === "users" ? (
                        <button
                          className="admin-row-action admin-delete-action"
                          disabled={entry.isAdmin}
                          onClick={() => deleteUser(entry.id, values[0])}
                        >
                          {entry.isAdmin ? "Admin" : "Delete"}
                        </button>
                      ) : (
                        <>
                          <button className="admin-row-action">View</button>
                          <button className="admin-row-action">•••</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </article>
      {isCreateOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && closeCreateDialog()
          }
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-challenge-title"
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="create-challenge-title">Create Challenge</h2>
                <p>Add a speaking challenge to the topic library.</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeCreateDialog}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <form onSubmit={createChallenge}>
              <label className="admin-form-field">
                <span>Challenge name</span>
                <input
                  value={challengeName}
                  onChange={(event) => setChallengeName(event.target.value)}
                  placeholder="Enter challenge name"
                  required
                  autoFocus
                />
              </label>
              <label className="admin-form-field">
                <span>
                  Description <small>(optional)</small>
                </span>
                <textarea
                  value={challengeDescription}
                  onChange={(event) =>
                    setChallengeDescription(event.target.value)
                  }
                  placeholder="Add instructions or context"
                  rows="4"
                />
              </label>
              {createError && (
                <p className="admin-form-error" role="alert">
                  {createError}
                </p>
              )}
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  onClick={closeCreateDialog}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-export-button"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Challenge"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {isUserCreateOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && closeUserDialog()
          }
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-user-title"
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="create-user-title">Add User</h2>
                <p>Create a learner account using the signup details.</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={closeUserDialog}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <form onSubmit={createUser}>
              <label className="admin-form-field">
                <span>Name</span>
                <input
                  value={userForm.name}
                  onChange={(event) =>
                    setUserForm({ ...userForm, name: event.target.value })
                  }
                  required
                  autoFocus
                />
              </label>
              <label className="admin-form-field">
                <span>
                  Domain <small>(optional)</small>
                </span>
                <input
                  value={userForm.domain}
                  onChange={(event) =>
                    setUserForm({ ...userForm, domain: event.target.value })
                  }
                />
              </label>
              <label className="admin-form-field">
                <span>Email</span>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(event) =>
                    setUserForm({ ...userForm, email: event.target.value })
                  }
                  required
                />
              </label>
              <label className="admin-form-field">
                <span>Password</span>
                <input
                  type="password"
                  minLength="8"
                  value={userForm.password}
                  onChange={(event) =>
                    setUserForm({ ...userForm, password: event.target.value })
                  }
                  required
                />
              </label>
              <label className="admin-form-field">
                <span>Confirm password</span>
                <input
                  type="password"
                  minLength="8"
                  value={userForm.confirm_password}
                  onChange={(event) =>
                    setUserForm({
                      ...userForm,
                      confirm_password: event.target.value,
                    })
                  }
                  required
                />
              </label>
              {userCreateError && (
                <p className="admin-form-error" role="alert">
                  {userCreateError}
                </p>
              )}
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  onClick={closeUserDialog}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-export-button"
                  disabled={isUserCreating}
                >
                  {isUserCreating ? "Creating..." : "Add User"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
      {isTimerOpen && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setIsTimerOpen(false)
          }
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-timer-title"
          >
            <div className="admin-modal-header">
              <div>
                <h2 id="session-timer-title">Set Session Timer</h2>
                <p>Choose the speaking session duration for users.</p>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setIsTimerOpen(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <form onSubmit={saveTimer} className="admin-timer-form">
              <label className="admin-form-field">
                <span>Timer length (seconds)</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={timerForm}
                  onChange={(event) => setTimerForm(event.target.value)}
                  autoFocus
                />
              </label>
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-modal-cancel"
                  onClick={() => {
                    setTimerForm(String(timerSeconds));
                    setTimerError("");
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="admin-export-button"
                  disabled={timerSaving}
                >
                  {timerSaving ? "Saving..." : "Save Timer"}
                </button>
              </div>
              {timerError && (
                <p className="admin-form-error" role="alert">
                  {timerError}
                </p>
              )}
              <p className="admin-timer-readout">
                Current value: {timerSeconds} seconds
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">
            <Icon name="wave" size={22} />
          </span>
          <span>
            <strong>
              SpeakSprint <em>AI</em>
            </strong>
            <small>Admin Panel</small>
          </span>
        </div>
        <nav className="admin-nav">
          {navigation.map((item) => (
            <button
              type="button"
              className={activePage === item.id ? "active" : ""}
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setSidebarOpen(false);
              }}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
              {[
                "users",
                "challenges",
                "topics",
                "speech-analysis",
                "reports",
                "logs",
                "settings",
              ].includes(item.id) && <b>›</b>}
            </button>
          ))}
        </nav>
        <div className="admin-server-status">
          <strong>Server Status</strong>
          <span>
            <i />
            Operational
          </span>
          <small>All systems running smoothly.</small>
          <small>Uptime: 99.9%</small>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          <label className="admin-global-search">
            <Icon name="search" size={16} />
            <input placeholder="Search anything..." />
            <kbd>⌘K</kbd>
          </label>
          <div className="admin-top-actions">
            <button aria-label="Notifications">
              <Icon name="bell" size={18} />
              <i>12</i>
            </button>
            <button aria-label="Settings">
              <Icon name="settings" size={18} />
            </button>
            <button
              className="admin-logout-button"
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <Icon name="logout" size={18} />
            </button>
            <span className="admin-admin-profile">
              <span className="admin-admin-avatar">A</span>
              <strong>
                Aditya Sharma<small>Super Admin</small>
              </strong>
              <b>⌄</b>
            </span>
          </div>
        </header>
        <div className="admin-content">
          {activePage === "dashboard" ? (
            <DashboardHome onNavigate={setActivePage} />
          ) : (
            <ManagementPage page={activePage} />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
