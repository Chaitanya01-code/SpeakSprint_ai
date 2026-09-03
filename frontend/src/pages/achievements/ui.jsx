import React from "react";
import "./achievements.css";

const achievementItems = [
  {
    id: "streak-7",
    title: "7-Day Streak",
    description: "Complete challenges for 7 days in a row",
    date: "May 16, 2024",
    type: "streak",
  },
  {
    id: "top-speaker",
    title: "Top Speaker",
    description: "Score 90+ in a challenge",
    date: "May 10, 2024",
    type: "speaker",
  },
  {
    id: "grammar-master",
    title: "Grammar Master",
    description: "Score 95+ in grammar",
    progress: "80/90",
    type: "grammar",
  },
  {
    id: "vocabulary-expert",
    title: "Vocabulary Expert",
    description: "Use 100+ unique words",
    progress: "84/100",
    type: "vocabulary",
  },
];

const badgeColors = {
  streak: { background: "#635BDB", accent: "#F4C7FF" },
  speaker: { background: "#F59E0B", accent: "#FFF1A8" },
  grammar: { background: "#6558D3", accent: "#E5D9FF" },
  vocabulary: { background: "#D946EF", accent: "#F7C6FF" },
};

function AchievementBadge({ type }) {
  const colors = badgeColors[type];

  return (
    <span className="ss-achievement-page-badge" style={{ backgroundColor: colors.background }}>
      <svg viewBox="0 0 40 44" aria-hidden="true">
        <path d="M8 6h24v18c0 7-5 12-12 14C13 36 8 31 8 24V6Z" fill={colors.accent} opacity="0.92" />
        <path d="M4 8H1v7c0 5 3 8 8 8v-4c-2 0-5-1-5-4V8Zm32 0h3v7c0 5-3 8-8 8v-4c2 0 5-1 5-4V8Z" fill={colors.accent} />
        <path d="M14 38h12v4H14z" fill={colors.accent} />
        {type === "streak" && <path d="m20 10 2 6 5 1-4 4 1 6-4-3-4 3 1-6-4-4 5-1 2-6Z" fill={colors.background} />}
        {type === "speaker" && <path d="M20 11c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7Zm0 3 2 3h3l-2.5 2 1 3-3.5-2-3.5 2 1-3-2.5-2h3l2-3Z" fill={colors.background} />}
        {type === "grammar" && <path d="M12 13h16v3H12v-3Zm0 6h11v3H12v-3Zm0 6h7v3h-7v-3Z" fill={colors.background} />}
        {type === "vocabulary" && <path d="M12 12h16v4H12v-4Zm0 7h16v4H12v-4Zm0 7h10v4H12v-4Z" fill={colors.background} />}
      </svg>
    </span>
  );
}

const Achievements = () => {
  const databaseAchievements = [];
  return (
    <section className="ss-achievements-page" aria-labelledby="achievements-page-title">
      <div className="ss-achievements-page-header">
        <div>
          <p className="ss-achievements-page-eyebrow">Your progress</p>
          <h1 id="achievements-page-title">Achievements</h1>
        </div>
        <span className="ss-achievements-page-count">{databaseAchievements.length || "null"} unlocked</span>
      </div>

      <div className="ss-achievements-page-list">
        {databaseAchievements.length === 0 ? <p>null</p> : databaseAchievements.map((achievement) => (
          <article className="ss-achievement-page-item" key={achievement.id}>
            <AchievementBadge type={achievement.type} />
            <div className="ss-achievement-page-copy">
              <h2>{achievement.title}</h2>
              <p>{achievement.description}</p>
            </div>
            <div className="ss-achievement-page-meta">
              {achievement.date && <time>{achievement.date}</time>}
              {achievement.progress && (
                <div className="ss-achievement-page-progress">
                  <span>{achievement.progress}</span>
                  <span className="ss-achievement-page-progress-track">
                    <span style={{ width: `${(Number(achievement.progress.split("/")[0]) / Number(achievement.progress.split("/")[1])) * 100}%` }} />
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
