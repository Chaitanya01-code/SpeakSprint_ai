import React, { useState, useMemo, useEffect, useRef } from "react";
import "./history.css";
import { authFetch } from "../../lib/api";

const initialAttemptsData = [
  {
    id: 1,
    title: "The Future of AI",
    category: "AI & Tech",
    date: "May 16, 2024",
    time: "10:24 AM",
    duration: "60s",
    score: 88,
    status: "green",
    wpm: 138,
    clarity: "92%",
    grammar: "94%",
    pronunciation: "90%",
    confidence: "88%",
    topicRelevance: "92%",
    isBookmarked: true,
    audioLength: "01:00",
    feedback: "Excellent vocabulary and articulate flow. Pacing was very engaging with smooth transitions.",
    strengths: [
      "Used nuanced terminology: 'transformative paradigm', 'collaborative augmentation'",
      "Maintained consistent cadence between 135-140 words per minute",
      "Clear opening hook that directly addressed the core question",
    ],
    improvements: [
      "2 filler words ('um', 'like') detected during the concluding statement",
      "Could vary vocal pitch slightly when emphasizing key statistical points",
    ],
    transcript: [
      { text: "Artificial intelligence is not just a technological tool, but a ", isFiller: false },
      { text: "transformative paradigm", isPower: true },
      { text: " that redefines how we collaborate, create, and solve global challenges. In the coming decade, we will witness ", isFiller: false },
      { text: "um", isFiller: true },
      { text: ", seamless integration between human ingenuity and machine capability. Rather than replacing human creativity, AI serves as a ", isFiller: false },
      { text: "collaborative augmentation", isPower: true },
      { text: ", enabling researchers and artists to iterate at unprecedented speeds.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 88 },
      { name: "Grammar", score: 94 },
      { name: "Vocabulary", score: 90 },
      { name: "Pronunciation", score: 90 },
      { name: "Confidence", score: 88 },
      { name: "Topic Relevance", score: 92 },
    ],
  },
  {
    id: 2,
    title: "Impact of Social Media",
    category: "Society & Culture",
    date: "May 15, 2024",
    time: "04:15 PM",
    duration: "60s",
    score: 78,
    status: "orange",
    wpm: 120,
    clarity: "81%",
    grammar: "83%",
    pronunciation: "82%",
    confidence: "74%",
    topicRelevance: "86%",
    isBookmarked: false,
    audioLength: "01:00",
    feedback: "Strong logical arguments and relatable examples. Work on reducing conversational filler words.",
    strengths: [
      "Clear structure with problem-solution format",
      "Relevant examples highlighting mental health impact and connectivity",
    ],
    improvements: [
      "5 filler words ('you know', 'basically', 'um') reduced pacing momentum",
      "Pacing dipped below 120 WPM around the 40-second mark",
    ],
    transcript: [
      { text: "Social media has fundamentally connected the world, but it also creates, ", isFiller: false },
      { text: "you know", isFiller: true },
      { text: ", digital echo chambers that distort our perception of reality. While it empowers marginalized voices to find communities, the algorithms are ", isFiller: false },
      { text: "basically", isFiller: true },
      { text: " engineered for engagement over nuance. To foster healthier digital discourse, we must cultivate ", isFiller: false },
      { text: "intentional consumption", isPower: true },
      { text: " and digital hygiene.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 76 },
      { name: "Grammar", score: 83 },
      { name: "Vocabulary", score: 78 },
      { name: "Pronunciation", score: 82 },
      { name: "Confidence", score: 74 },
      { name: "Topic Relevance", score: 86 },
    ],
  },
  {
    id: 3,
    title: "Online Education",
    category: "Education",
    date: "May 14, 2024",
    time: "09:50 AM",
    duration: "60s",
    score: 92,
    status: "green",
    wpm: 145,
    clarity: "95%",
    grammar: "96%",
    pronunciation: "94%",
    confidence: "93%",
    topicRelevance: "95%",
    isBookmarked: true,
    audioLength: "01:00",
    feedback: "Outstanding confidence, structured cadence, and crisp pronunciation! Personal best score.",
    strengths: [
      "Zero filler words throughout the entire 60-second delivery",
      "Commanding tone with excellent rhetorical pauses",
      "Exceptional phrasing: 'democratization of knowledge', 'asynchronous learning'",
    ],
    improvements: [
      "Try varying sentence lengths for even greater rhythmic variety",
    ],
    transcript: [
      { text: "The ", isFiller: false },
      { text: "democratization of knowledge", isPower: true },
      { text: " through digital learning platforms has revolutionized global accessibility. Students in remote corners of the world can now learn from the world's greatest minds. Through ", isFiller: false },
      { text: "asynchronous mastery", isPower: true },
      { text: " and personalized AI tutors, education is shifting from rigid standardized testing to adaptive human potential.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 94 },
      { name: "Grammar", score: 96 },
      { name: "Vocabulary", score: 92 },
      { name: "Pronunciation", score: 94 },
      { name: "Confidence", score: 93 },
      { name: "Topic Relevance", score: 95 },
    ],
  },
  {
    id: 4,
    title: "Sustainable Living",
    category: "Environment",
    date: "May 13, 2024",
    time: "02:10 PM",
    duration: "60s",
    score: 85,
    status: "green",
    wpm: 132,
    clarity: "88%",
    grammar: "89%",
    pronunciation: "87%",
    confidence: "86%",
    topicRelevance: "90%",
    isBookmarked: false,
    audioLength: "01:00",
    feedback: "Well-crafted points with clear examples. Natural transition phrasing and passionate delivery.",
    strengths: [
      "Engaging vocal inflection showing genuine passion for sustainability",
      "Practical micro-actions tied to large-scale environmental impact",
    ],
    improvements: [
      "Slight hesitation at 0:25 before introducing circular economy concept",
    ],
    transcript: [
      { text: "Sustainable living is not about perfection; it is about millions of people making conscious, imperfect choices every single day. From adopting a ", isFiller: false },
      { text: "circular economy", isPower: true },
      { text: " mindset to reducing single-use plastics, our collective daily habits send a powerful market signal toward renewable futures.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 86 },
      { name: "Grammar", score: 89 },
      { name: "Vocabulary", score: 88 },
      { name: "Pronunciation", score: 87 },
      { name: "Confidence", score: 86 },
      { name: "Topic Relevance", score: 90 },
    ],
  },
  {
    id: 5,
    title: "Leadership & Storytelling",
    category: "Leadership",
    date: "May 12, 2024",
    time: "11:30 AM",
    duration: "60s",
    score: 90,
    status: "green",
    wpm: 140,
    clarity: "93%",
    grammar: "92%",
    pronunciation: "91%",
    confidence: "94%",
    topicRelevance: "92%",
    isBookmarked: true,
    audioLength: "01:00",
    feedback: "Magnetic opening narrative with inspiring tone and authoritative voice modulation.",
    strengths: [
      "Compelling narrative arc that held listener attention from start to finish",
      "Dynamic vocal projection and rhythmic pacing",
    ],
    improvements: [
      "Ensure concluding call-to-action has a dedicated 3-second breathing space",
    ],
    transcript: [
      { text: "Great leaders do not merely command; they inspire through authentic storytelling. Data informs our intellect, but stories capture our ", isFiller: false },
      { text: "emotional conviction", isPower: true },
      { text: ". When you articulate a compelling vision, you transform a group of individuals into a united, purpose-driven team.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 92 },
      { name: "Grammar", score: 92 },
      { name: "Vocabulary", score: 91 },
      { name: "Pronunciation", score: 91 },
      { name: "Confidence", score: 94 },
      { name: "Topic Relevance", score: 92 },
    ],
  },
  {
    id: 6,
    title: "Micro-Habits & Daily Compounding",
    category: "Lifestyle",
    date: "May 11, 2024",
    time: "08:15 AM",
    duration: "60s",
    score: 87,
    status: "green",
    wpm: 135,
    clarity: "89%",
    grammar: "90%",
    pronunciation: "88%",
    confidence: "87%",
    topicRelevance: "91%",
    isBookmarked: false,
    audioLength: "01:00",
    feedback: "Clear breakdown of habit loops with memorable aphorisms and clean pacing.",
    strengths: [
      "Structured delivery with 3 distinct points (Cue, Routine, Reward)",
      "Strong vocal stability with calm, confident cadence",
    ],
    improvements: [
      "Can incorporate stronger transitional signposts like 'Firstly', 'Subsequently'",
    ],
    transcript: [
      { text: "We often overestimate what we can accomplish in a single day, but vastly underestimate what compounds over a year of ", isFiller: false },
      { text: "micro-disciplines", isPower: true },
      { text: ". Improving just one percent every day creates a remarkable thirty-seven-fold trajectory by year-end.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 88 },
      { name: "Grammar", score: 90 },
      { name: "Vocabulary", score: 87 },
      { name: "Pronunciation", score: 88 },
      { name: "Confidence", score: 87 },
      { name: "Topic Relevance", score: 91 },
    ],
  },
  {
    id: 7,
    title: "Remote Work Communication",
    category: "Career",
    date: "May 10, 2024",
    time: "05:40 PM",
    duration: "60s",
    score: 84,
    status: "green",
    wpm: 128,
    clarity: "86%",
    grammar: "88%",
    pronunciation: "85%",
    confidence: "82%",
    topicRelevance: "89%",
    isBookmarked: false,
    audioLength: "01:00",
    feedback: "Solid insights on asynchronous collaboration and team trust in distributed environments.",
    strengths: [
      "Actionable recommendations for video meeting etiquette and documentation",
      "Good articulation of technical concepts",
    ],
    improvements: [
      "Slightly monotone delivery in the middle section; inject more dynamic vocal inflection",
    ],
    transcript: [
      { text: "In a distributed team, over-communication is not a redundancy—it is the bedrock of alignment. Writing clearly and establishing asynchronous norms allows teams across timezones to maintain velocity without burnout.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 84 },
      { name: "Grammar", score: 88 },
      { name: "Vocabulary", score: 86 },
      { name: "Pronunciation", score: 85 },
      { name: "Confidence", score: 82 },
      { name: "Topic Relevance", score: 89 },
    ],
  },
  {
    id: 8,
    title: "Renewable Energy & Climate",
    category: "Environment",
    date: "May 09, 2024",
    time: "01:20 PM",
    duration: "60s",
    score: 76,
    status: "orange",
    wpm: 118,
    clarity: "79%",
    grammar: "80%",
    pronunciation: "78%",
    confidence: "72%",
    topicRelevance: "84%",
    isBookmarked: false,
    audioLength: "01:00",
    feedback: "Informative content, but delivery had noticeable pauses and hesitations.",
    strengths: [
      "Accurate facts on grid modernization and battery storage capabilities",
    ],
    improvements: [
      "Frequent pauses longer than 2 seconds; practice structured outline recall",
      "Increase speaking pace to target the optimal 130-145 WPM zone",
    ],
    transcript: [
      { text: "Solar and wind energy have achieved grid parity, meaning clean electricity is now cheaper than fossil fuels in most regions. The next frontier lies in ", isFiller: false },
      { text: "grid-scale energy storage", isPower: true },
      { text: ", allowing us to capture surplus power and distribute it reliably day and night.", isFiller: false },
    ],
    radarSkills: [
      { name: "Fluency", score: 72 },
      { name: "Grammar", score: 80 },
      { name: "Vocabulary", score: 79 },
      { name: "Pronunciation", score: 78 },
      { name: "Confidence", score: 72 },
      { name: "Topic Relevance", score: 84 },
    ],
  },
];

const History = ({ authUser, onStartChallenge, onNavigateBack }) => {
  // State
  const [attempts, setAttempts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, top90, strong80, review, bookmarked
  const [categoryFilter, setCategoryFilter] = useState("All Topics");
  const [timeframeFilter, setTimeframeFilter] = useState("All Time");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest, speed
  const [viewMode, setViewMode] = useState("list"); // list, grid
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Audio Playback simulation state
  const [playingAttemptId, setPlayingAttemptId] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState("1.0x");

  // Selected attempt for full analysis modal
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const lastServerSnapshot = useRef("");

  useEffect(() => {
    const userId = authUser?.user_id;
    if (!userId) return;

    const loadHistory = async () => {
      try {
        const response = await authFetch(`/api/v1/transcripts?user_id=${userId}`);
        if (!response.ok) throw new Error("Unable to load speaking history");
        const transcripts = await response.json();
        const serverSnapshot = JSON.stringify(transcripts);
        if (serverSnapshot === lastServerSnapshot.current) return;
        lastServerSnapshot.current = serverSnapshot;
        const nextAttempts = transcripts.map((item) => {
        const evaluation = item.evaluation || {};
        const skills = evaluation.skill_scores || {};
        const analysis = item.analysis || {};
        const score = Math.round(evaluation.overall_score ?? 0);
        const fillerWords = new Set(["um", "uh", "like", "actually", "basically", "so"]);
        const transcript = item.transcript.split(/(\s+)/).map((text) => ({
          text,
          isFiller: fillerWords.has(text.trim().toLowerCase()),
        }));
        return {
          id: item.id,
          title: item.topic || "Untitled speaking session",
          category: "Speaking practice",
          date: new Date(item.created_at).toLocaleDateString(),
          time: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          duration: `${item.duration_seconds}s`,
          score,
          status: score >= 80 ? "green" : score >= 60 ? "yellow" : "red",
          wpm: analysis.words_per_minute || 0,
          clarity: `${Math.round(skills.fluency ?? 0)}%`,
          grammar: `${Math.round(skills.grammar ?? 0)}%`,
          pronunciation: `${Math.round(skills.pronunciation ?? 0)}%`,
          confidence: `${score}%`,
          topicRelevance: `${Math.round(skills.topic_relevance ?? 0)}%`,
          isBookmarked: false,
          audioLength: `${item.duration_seconds}s`,
          feedback: evaluation.feedback || "Analysis is being prepared for this session.",
          strengths: evaluation.strengths || [],
          improvements: evaluation.suggestions || evaluation.weaknesses || [],
          transcript,
          radarSkills: [
            { name: "Fluency", score: skills.fluency ?? 0 },
            { name: "Grammar", score: skills.grammar ?? 0 },
            { name: "Vocabulary", score: skills.vocabulary ?? 0 },
            { name: "Pronunciation", score: skills.pronunciation ?? 0 },
            { name: "Speaking speed", score: skills.speaking_speed ?? 0 },
            { name: "Topic relevance", score: skills.topic_relevance ?? 0 },
          ],
        };
        });
        setAttempts((currentAttempts) =>
          JSON.stringify(currentAttempts) === JSON.stringify(nextAttempts)
            ? currentAttempts
            : nextAttempts,
        );
      } catch (error) {
        console.warn(error);
      }
    };

    loadHistory();
    const refreshTimer = window.setInterval(loadHistory, 5000);
    return () => window.clearInterval(refreshTimer);
  }, [authUser?.user_id]);

  // Toggle Bookmark
  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    setAttempts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
    if (selectedAttempt && selectedAttempt.id === id) {
      setSelectedAttempt((prev) => ({ ...prev, isBookmarked: !prev.isBookmarked }));
    }
  };

  // Toggle Play / Pause simulation
  const togglePlayAudio = (id, e) => {
    e?.stopPropagation();
    if (playingAttemptId === id) {
      setPlayingAttemptId(null);
    } else {
      setPlayingAttemptId(id);
    }
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(attempts.map((d) => d.category));
    return ["All Topics", ...Array.from(set)];
  }, [attempts]);

  // Filtered & Sorted Attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter((item) => {
      // Search filter
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.feedback.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category dropdown filter
      if (categoryFilter !== "All Topics" && item.category !== categoryFilter) {
        return false;
      }

      // Tab filter
      if (activeTab === "top90" && item.score < 90) return false;
      if (activeTab === "strong80" && (item.score < 80 || item.score >= 90)) return false;
      if (activeTab === "review" && item.score >= 80) return false;
      if (activeTab === "bookmarked" && !item.isBookmarked) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "newest") return b.id - a.id;
      if (sortBy === "oldest") return a.id - b.id;
      if (sortBy === "highest") return b.score - a.score;
      if (sortBy === "lowest") return a.score - b.score;
      if (sortBy === "speed") return b.wpm - a.wpm;
      return 0;
    });
  }, [attempts, searchQuery, activeTab, categoryFilter, sortBy]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: attempts.length,
      top90: attempts.filter((a) => a.score >= 90).length,
      strong80: attempts.filter((a) => a.score >= 80 && a.score < 90).length,
      review: attempts.filter((a) => a.score < 80).length,
      bookmarked: attempts.filter((a) => a.isBookmarked).length,
    };
  }, [attempts]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage) || 1;
  const paginatedAttempts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAttempts.slice(start, start + itemsPerPage);
  }, [filteredAttempts, currentPage]);

  // Summary statistics metrics
  const averageScore = useMemo(() => {
    if (attempts.length === 0) return null;
    const total = attempts.reduce((acc, curr) => acc + curr.score, 0);
    return (total / attempts.length).toFixed(1);
  }, [attempts]);

  const bestScore = useMemo(() => {
    if (attempts.length === 0) return null;
    return Math.max(...attempts.map((a) => a.score));
  }, [attempts]);

  // Radar chart calculation for modal
  const calculateRadarPoint = (angleDeg, value, center = { x: 100, y: 80 }, radius = 52) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center.x + r * Math.cos(angleRad),
      y: center.y + r * Math.sin(angleRad),
    };
  };

  return (
    <div className="ss-history-page">
      {/* ====================================================================
          1. HEADER SECTION
      ==================================================================== */}
      <header className="ss-history-header">
        <div className="ss-history-title-group">
          <h1 className="ss-history-title">
            Speaking History
            <span className="ss-history-title-badge">{attempts.length} Sessions Total</span>
          </h1>
          <p className="ss-history-sub">
            Review your past 60-second speech attempts, AI coaching feedback, and metric trends.
          </p>
        </div>

        <div className="ss-history-header-actions">
          {onNavigateBack && (
            <button
              type="button"
              className="ss-btn-secondary"
              onClick={onNavigateBack}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span>Back to Dashboard</span>
            </button>
          )}

          <button
            type="button"
            className="ss-btn-primary"
            onClick={onStartChallenge || (() => alert("Starting challenge session!"))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            <span>Start New Challenge</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. SUMMARY METRICS ROW
      ==================================================================== */}
      <section className="ss-history-metrics-grid">
        {/* Metric 1: Total Completed */}
        <div className="ss-hmetric-card">
          <div className="ss-hmetric-top">
            <span className="ss-hmetric-label">Total Attempts</span>
            <div className="ss-hmetric-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="ss-hmetric-value">{attempts.length}</div>
          <div className="ss-hmetric-footer positive">
            <span>{attempts.length ? "↑ 4 completed this week" : "No attempts yet"}</span>
          </div>
        </div>

        {/* Metric 2: Average Score */}
        <div className="ss-hmetric-card">
          <div className="ss-hmetric-top">
            <span className="ss-hmetric-label">Average Score</span>
            <div className="ss-hmetric-icon" style={{ background: "#E8F8F0", color: "#10B981" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </div>
          <div className="ss-hmetric-value">{averageScore ?? "--"}</div>
          <div className="ss-hmetric-footer positive">
            <span>↑ 5.4 point improvement</span>
          </div>
        </div>

        {/* Metric 3: Highest Score */}
        <div className="ss-hmetric-card">
          <div className="ss-hmetric-top">
            <span className="ss-hmetric-label">Best Score</span>
            <div className="ss-hmetric-icon" style={{ background: "#FEF9C3", color: "#D97706" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 19h20v2H2v-2Zm1.5-12 4.5 6 4-8 4 8 4.5-6L22 17H2L3.5 7Z" />
              </svg>
            </div>
          </div>
          <div className="ss-hmetric-value">{bestScore ?? "--"}</div>
          <div className="ss-hmetric-footer">
            <span>Topic: Online Education</span>
          </div>
        </div>

        {/* Metric 4: Total Speaking Time */}
        <div className="ss-hmetric-card">
          <div className="ss-hmetric-top">
            <span className="ss-hmetric-label">Speaking Time</span>
            <div className="ss-hmetric-icon" style={{ background: "#F3F0FF", color: "#5D5FEF" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="ss-hmetric-value">{attempts.length ? "28h 15m" : "--"}</div>
          <div className="ss-hmetric-footer">
            <span>Keep up the daily momentum!</span>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. CONTROLS, SEARCH & FILTER PANEL
      ==================================================================== */}
      <section className="ss-history-controls-panel">
        <div className="ss-controls-top-row">
          {/* Search Box */}
          <div className="ss-search-box">
            <span className="ss-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="ss-search-input"
              placeholder="Search by topic title, feedback keywords, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="ss-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* Select Filters */}
          <div className="ss-filter-selects-group">
            {/* Category Filter */}
            <select
              className="ss-select-custom"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Timeframe Filter */}
            <select
              className="ss-select-custom"
              value={timeframeFilter}
              onChange={(e) => setTimeframeFilter(e.target.value)}
            >
              <option value="All Time">All Time</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>

            {/* Sort Filter */}
            <select
              className="ss-select-custom"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Score</option>
              <option value="lowest">Sort: Lowest Score</option>
              <option value="speed">Sort: Speaking Speed</option>
            </select>

            {/* View Mode Toggle */}
            <div className="ss-view-toggle">
              <button
                type="button"
                className={`ss-view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List View"
                aria-label="List View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
                  <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
                  <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
                </svg>
              </button>
              <button
                type="button"
                className={`ss-view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid View"
                aria-label="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs Row */}
        <div className="ss-filter-tabs-row">
          <button
            type="button"
            className={`ss-filter-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
          >
            <span>All Attempts</span>
            <span className="ss-filter-tab-count">{tabCounts.all}</span>
          </button>

          <button
            type="button"
            className={`ss-filter-tab ${activeTab === "top90" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("top90");
              setCurrentPage(1);
            }}
          >
            <span>🏆 Score 90+ (Mastery)</span>
            <span className="ss-filter-tab-count">{tabCounts.top90}</span>
          </button>

          <button
            type="button"
            className={`ss-filter-tab ${activeTab === "strong80" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("strong80");
              setCurrentPage(1);
            }}
          >
            <span>✨ Score 80-89 (Strong)</span>
            <span className="ss-filter-tab-count">{tabCounts.strong80}</span>
          </button>

          <button
            type="button"
            className={`ss-filter-tab ${activeTab === "review" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("review");
              setCurrentPage(1);
            }}
          >
            <span>⚠️ Needs Review (&lt;80)</span>
            <span className="ss-filter-tab-count">{tabCounts.review}</span>
          </button>

          <button
            type="button"
            className={`ss-filter-tab ${activeTab === "bookmarked" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("bookmarked");
              setCurrentPage(1);
            }}
          >
            <span>⭐ Bookmarked</span>
            <span className="ss-filter-tab-count">{tabCounts.bookmarked}</span>
          </button>
        </div>
      </section>

      {/* ====================================================================
          4. ATTEMPTS DISPLAY (LIST OR GRID)
      ==================================================================== */}
      {paginatedAttempts.length === 0 ? (
        <div className="ss-empty-history">
          <span className="ss-empty-icon">🔍</span>
          <h3 className="ss-empty-title">null</h3>
          <p className="ss-empty-sub">
            Try adjusting your search terms, changing the category, or clearing active filters.
          </p>
          <button
            type="button"
            className="ss-btn-primary"
            style={{ marginTop: "6px" }}
            onClick={() => {
              setSearchQuery("");
              setActiveTab("all");
              setCategoryFilter("All Topics");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "list" ? (
        /* Detailed List View */
        <div className="ss-attempts-container">
          {paginatedAttempts.map((item) => {
            const isPlaying = playingAttemptId === item.id;
            return (
              <div
                key={item.id}
                className="ss-attempt-card-row"
                onClick={() => setSelectedAttempt(item)}
              >
                {/* Card Top Row: Title, Date, Category, Score Circle */}
                <div className="ss-attempt-card-top">
                  <div className="ss-attempt-left-header">
                    <div className="ss-attempt-icon-badge">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>

                    <div className="ss-attempt-main-info">
                      <h3 className="ss-attempt-row-title">
                        {item.title}
                        <span className="ss-attempt-category-tag">{item.category}</span>
                      </h3>
                      <div className="ss-attempt-row-meta">
                        <span className="ss-meta-pill">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {item.date} • {item.time}
                        </span>
                        <span className="ss-meta-pill">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {item.duration} Sprint
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score circle */}
                  <div className="ss-attempt-score-wrap">
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#8E98B0", textTransform: "uppercase" }}>
                        OVERALL SCORE
                      </div>
                      <div style={{ fontSize: "11px", color: item.status === "green" ? "#10B981" : "#F59E0B", fontWeight: "700" }}>
                        {item.score >= 90 ? "Mastery Grade" : item.score >= 80 ? "Proficient" : "Needs Review"}
                      </div>
                    </div>
                    <div className={`ss-score-large-circle ${item.status}`}>
                      {item.score}
                    </div>
                  </div>
                </div>

                {/* Card Middle Bar: Speech Metrics Pills + Audio Waveform Preview */}
                <div className="ss-attempt-middle-bar" onClick={(e) => e.stopPropagation()}>
                  <div className="ss-metrics-pills-row">
                    <div className="ss-mpill">
                      <span className="ss-mpill-label">⚡ Pace:</span>
                      <span className="ss-mpill-val">{item.wpm} WPM</span>
                    </div>
                    <div className="ss-mpill">
                      <span className="ss-mpill-label">🎯 Clarity:</span>
                      <span className="ss-mpill-val">{item.clarity}</span>
                    </div>
                    <div className="ss-mpill">
                      <span className="ss-mpill-label">📝 Grammar:</span>
                      <span className="ss-mpill-val">{item.grammar}</span>
                    </div>
                    <div className="ss-mpill">
                      <span className="ss-mpill-label">🗣️ Pronunciation:</span>
                      <span className="ss-mpill-val">{item.pronunciation}</span>
                    </div>
                  </div>

                  {/* Mini Audio Player with Interactive Waveform */}
                  <div className="ss-mini-audio-player">
                    <button
                      type="button"
                      className="ss-audio-play-btn"
                      onClick={(e) => togglePlayAudio(item.id, e)}
                      title={isPlaying ? "Pause Audio" : "Play Recording"}
                      aria-label="Play Recording"
                    >
                      {isPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>

                    <div className="ss-audio-waveform-mini">
                      {[10, 22, 14, 26, 18, 28, 12, 24, 16, 20, 14, 22, 10, 18, 26, 12].map((h, i) => (
                        <span
                          key={i}
                          className={`ss-wave-col ${isPlaying ? "active playing" : ""}`}
                          style={{
                            height: `${h}px`,
                            animationDelay: `${i * 0.06}s`,
                          }}
                        />
                      ))}
                    </div>

                    <span className="ss-audio-timestamp">
                      {isPlaying ? "00:24" : item.audioLength}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: AI Feedback snippet + Actions */}
                <div className="ss-attempt-feedback-snippet">
                  <div className="ss-feedback-text-wrap">
                    <span className="ss-feedback-sparkle">✨</span>
                    <span>
                      <strong>AI Summary:</strong> {item.feedback}
                    </span>
                  </div>

                  <div className="ss-attempt-actions-row" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className={`ss-action-icon-btn ${item.isBookmarked ? "favorited" : ""}`}
                      onClick={(e) => toggleBookmark(item.id, e)}
                      title={item.isBookmarked ? "Remove Bookmark" : "Bookmark Attempt"}
                      aria-label="Bookmark"
                    >
                      ★
                    </button>

                    <button
                      type="button"
                      className="ss-btn-view-details"
                      onClick={() => setSelectedAttempt(item)}
                    >
                      <span>Analysis</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Grid Card View */
        <div className="ss-attempts-grid-layout">
          {paginatedAttempts.map((item) => (
            <div
              key={item.id}
              className="ss-grid-attempt-card"
              onClick={() => setSelectedAttempt(item)}
            >
              <div>
                <div className="ss-grid-card-header">
                  <span className="ss-attempt-category-tag">{item.category}</span>
                  <div className={`ss-score-circle ${item.status}`}>
                    {item.score}
                  </div>
                </div>

                <h3 className="ss-grid-topic-title">{item.title}</h3>
                <p style={{ fontSize: "12px", color: "#8E98B0", margin: "0 0 14px 0" }}>
                  {item.date} • {item.duration}
                </p>

                <div className="ss-grid-metrics-grid">
                  <div className="ss-gmetric-item">
                    <span className="ss-gmetric-label">Speaking Speed</span>
                    <span className="ss-gmetric-value">{item.wpm} WPM</span>
                  </div>
                  <div className="ss-gmetric-item">
                    <span className="ss-gmetric-label">Clarity</span>
                    <span className="ss-gmetric-value">{item.clarity}</span>
                  </div>
                  <div className="ss-gmetric-item">
                    <span className="ss-gmetric-label">Grammar</span>
                    <span className="ss-gmetric-value">{item.grammar}</span>
                  </div>
                  <div className="ss-gmetric-item">
                    <span className="ss-gmetric-label">Pronunciation</span>
                    <span className="ss-gmetric-value">{item.pronunciation}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #EEF1F8", paddingTop: "12px" }}>
                <span style={{ fontSize: "11.5px", color: "#5D5FEF", fontWeight: "700" }}>
                  View Full Transcript →
                </span>
                <button
                  type="button"
                  className={`ss-action-icon-btn ${item.isBookmarked ? "favorited" : ""}`}
                  onClick={(e) => toggleBookmark(item.id, e)}
                >
                  ★
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================
          5. PAGINATION ROW
      ==================================================================== */}
      {filteredAttempts.length > itemsPerPage && (
        <div className="ss-history-pagination">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredAttempts.length)} of {filteredAttempts.length} sessions
          </span>

          <div className="ss-page-nav-btns">
            <button
              type="button"
              className="ss-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              ←
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                type="button"
                className={`ss-page-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              type="button"
              className="ss-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. FULL DRILLDOWN ATTEMPT ANALYSIS MODAL
      ==================================================================== */}
      {selectedAttempt && (
        <div className="ss-modal-overlay" onClick={() => setSelectedAttempt(null)}>
          <div className="ss-detail-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="ss-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="ss-attempt-icon-badge" style={{ background: "#F4F5FD" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "#1C2033" }}>
                    {selectedAttempt.title}
                  </h2>
                  <p style={{ fontSize: "12.5px", color: "#8E98B0", margin: "2px 0 0 0" }}>
                    {selectedAttempt.category} • Recorded on {selectedAttempt.date} at {selectedAttempt.time}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  className={`ss-action-icon-btn ${selectedAttempt.isBookmarked ? "favorited" : ""}`}
                  onClick={(e) => toggleBookmark(selectedAttempt.id, e)}
                  title="Bookmark"
                >
                  ★
                </button>
                <button
                  type="button"
                  className="ss-modal-close-btn"
                  onClick={() => setSelectedAttempt(null)}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Score Banner */}
            <div className="ss-modal-score-banner">
              <div>
                <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#5D5FEF", textTransform: "uppercase" }}>
                  OVERALL ASSESSMENT
                </span>
                <div style={{ fontSize: "28px", fontWeight: "800", color: "#1C2033", marginTop: "2px" }}>
                  Score: {selectedAttempt.score} <span style={{ fontSize: "15px", color: "#8E98B0" }}>/ 100</span>
                </div>
                <p style={{ fontSize: "13px", color: "#58627A", margin: "4px 0 0 0", maxWidth: "420px" }}>
                  {selectedAttempt.feedback}
                </p>
              </div>

              {/* Audio Playback Controls in Modal */}
              <div style={{ background: "#FFFFFF", padding: "12px 16px", borderRadius: "12px", border: "1px solid #EEF1F8", display: "flex", flexDirection: "column", gap: "8px", minWidth: "220px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#8E98B0" }}>AUDIO PLAYBACK</span>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "#5D5FEF", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                    onClick={() => {
                      setPlaybackSpeed((s) => (s === "1.0x" ? "1.25x" : s === "1.25x" ? "1.5x" : "1.0x"));
                    }}
                  >
                    Speed: {playbackSpeed}
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    type="button"
                    className="ss-audio-play-btn"
                    onClick={(e) => togglePlayAudio(selectedAttempt.id, e)}
                  >
                    {playingAttemptId === selectedAttempt.id ? "⏸" : "▶"}
                  </button>
                  <div style={{ flex: 1, height: "6px", background: "#ECEEFE", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: playingAttemptId === selectedAttempt.id ? "45%" : "0%", height: "100%", background: "#5D5FEF", transition: "width 0.3s ease" }} />
                  </div>
                  <span style={{ fontSize: "11.5px", fontWeight: "700", color: "#58627A" }}>
                    {selectedAttempt.audioLength}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Metrics Cards */}
            <div className="ss-modal-metrics-grid">
              <div className="ss-modal-mcard">
                <span className="ss-modal-mcard-lbl">Pacing Speed</span>
                <div className="ss-modal-mcard-val">{selectedAttempt.wpm} <span style={{ fontSize: "12px", fontWeight: "600" }}>WPM</span></div>
              </div>
              <div className="ss-modal-mcard">
                <span className="ss-modal-mcard-lbl">Clarity</span>
                <div className="ss-modal-mcard-val" style={{ color: "#10B981" }}>{selectedAttempt.clarity}</div>
              </div>
              <div className="ss-modal-mcard">
                <span className="ss-modal-mcard-lbl">Grammar</span>
                <div className="ss-modal-mcard-val">{selectedAttempt.grammar}</div>
              </div>
              <div className="ss-modal-mcard">
                <span className="ss-modal-mcard-lbl">Pronunciation</span>
                <div className="ss-modal-mcard-val" style={{ color: "#F59E0B" }}>{selectedAttempt.pronunciation}</div>
              </div>
            </div>

            {/* Full Synchronized Transcript with Highlighter Markers */}
            <div className="ss-transcript-container">
              <div className="ss-transcript-header">
                <span className="ss-transcript-title">Speech Transcript & Word-Level Analysis</span>
                <div className="ss-transcript-legend">
                  <span className="ss-tmarker-filler">⚠️ Filler Word</span>
                  <span className="ss-tmarker-good">✨ Power Phrase</span>
                </div>
              </div>
              <p className="ss-transcript-text">
                {selectedAttempt.transcript.map((seg, idx) => (
                  <span
                    key={idx}
                    className={seg.isFiller ? "filler" : seg.isPower ? "power-word" : ""}
                  >
                    {seg.text}
                  </span>
                ))}
              </p>
            </div>

            {/* Strengths and Improvements 2-Column */}
            <div className="ss-feedback-grid-2col">
              <div className="ss-feedback-box strengths">
                <h4 className="ss-feedback-box-title">
                  <span>✅</span> Key Strengths
                </h4>
                <ul className="ss-feedback-list">
                  {selectedAttempt.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="ss-feedback-box improvements">
                <h4 className="ss-feedback-box-title">
                  <span>💡</span> Areas for Growth
                </h4>
                <ul className="ss-feedback-list">
                  {selectedAttempt.improvements.map((imp, i) => (
                    <li key={i}>{imp}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
              <button
                type="button"
                className="ss-btn-secondary"
                onClick={() => setSelectedAttempt(null)}
              >
                Close Analysis
              </button>
              <button
                type="button"
                className="ss-btn-primary"
                onClick={() => {
                  setSelectedAttempt(null);
                  if (onStartChallenge) onStartChallenge();
                }}
              >
                Practice Similar Topic →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
