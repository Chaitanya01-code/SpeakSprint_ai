import { useEffect, useState } from 'react';
import './home.css';

export default function Home() {
  const [isUserSelectionOpen, setIsUserSelectionOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const goToLogin = () => { window.location.href = '/login'; };
  const goToSignup = () => { window.location.href = '/signup'; };
  const startSpeaking = () => {
    setIsUserSelectionOpen(true);
    if (users.length || usersLoading) return;
    setUsersLoading(true);
    fetch('http://localhost:8000/api/v1/users')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load users');
        return response.json();
      })
      .then((data) => setUsers(data.filter((user) => user.is_active && !user.is_admin)))
      .catch((error) => setUsersError(error.message))
      .finally(() => setUsersLoading(false));
  };
  const openSpinWheel = (event) => {
    event.preventDefault();
    if (!selectedUser) return;
    localStorage.setItem('selectedUser', selectedUser);
    window.location.href = '/practice';
  };

  const stats = [
    { number: '10K+', label: 'Active Speakers', icon: 'users' },
    { number: '250K+', label: 'Challenges Completed', icon: 'check' },
    { number: '95%', label: 'Users Improve', icon: 'success' },
    { number: '4.8/5', label: 'User Rating', icon: 'star' }
  ];

  const steps = [
    { step: '1', title: 'Get a Topic', desc: 'We give you a random topic to speak about.' },
    { step: '2', title: 'Speak for 60 Sec', desc: 'Talk for 60 seconds to improve your confidence.' },
    { step: '3', title: 'AI Analyses', desc: 'Our AI analyses your speech and gives helpful feedback.' },
    { step: '4', title: 'Get Feedback', desc: 'Receive a detailed score and personalized feedback.' }
  ];

  const features = [
    { title: 'AI Powered', desc: 'Advanced AI analyzes your speech with helpful insights.' },
    { title: 'Comprehensive', desc: 'We check grammar, fluency, pace, pronunciation and more.' },
    { title: 'Track Progress', desc: 'See your progress over time with useful insights.' },
    { title: 'Build Confidence', desc: 'Practice daily and become a more confident speaker.' }
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <div className="logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-wave-icon">
                <rect x="2" y="8.5" width="2.4" height="7" rx="1.2" fill="#4F46E5" />
                <rect x="6.5" y="4.5" width="2.4" height="15" rx="1.2" fill="#4F46E5" />
                <rect x="11" y="2" width="2.4" height="20" rx="1.2" fill="#4F46E5" />
                <rect x="15.5" y="6" width="2.4" height="12" rx="1.2" fill="#4F46E5" />
                <rect x="20" y="7.5" width="2.4" height="9" rx="1.2" fill="#4F46E5" />
              </svg>
              <span className="logo-text">SpeakSprint <span className="logo-ai">AI</span></span>
            </div>
          </div>
          <div className="navbar-right">
            <button type="button" className="btn-login" onClick={goToLogin}>Log in</button>
            <button type="button" className="btn-signup" onClick={goToSignup}>Sign up</button>
          </div>
        </div>
      </nav>

      {isUserSelectionOpen && (
        <div className="home-user-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsUserSelectionOpen(false)}>
          <section className="home-user-modal" role="dialog" aria-modal="true" aria-labelledby="home-user-selection-title">
            <button type="button" className="home-user-modal-close" onClick={() => setIsUserSelectionOpen(false)} aria-label="Close user selection">×</button>
            <div className="home-user-modal-icon" aria-hidden="true">◉</div>
            <h2 id="home-user-selection-title">Choose a speaker</h2>
            <p>Select your name to open the speaking spin wheel.</p>
            <form onSubmit={openSpinWheel}>
              <label htmlFor="home-user-select">Available users</label>
              <select id="home-user-select" value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)} required autoFocus>
                <option value="" disabled>{usersLoading ? 'Loading users...' : 'Choose your name'}</option>
                {users.map((user) => <option key={user.id} value={user.username || user.email}>{user.username || user.email}</option>)}
              </select>
              {usersError && <span className="home-user-modal-error" role="alert">{usersError}</span>}
              {!usersLoading && !usersError && users.length === 0 && <span className="home-user-modal-error" role="alert">No active users are available.</span>}
              <button type="submit" className="home-user-modal-submit">Open Spin Wheel <span aria-hidden="true">→</span></button>
            </form>
          </section>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-heading">
              Speak for<br />
              60 Seconds.<br />
              <span className="hero-purple">Improve</span> for a Lifetime.
            </h1>
            <p className="hero-paragraph">
              AI-powered speaking practice that analyzes your<br />
              speech and helps you become a confident<br />
              communicator.
            </p>
            <div className="hero-buttons">
              <button type="button" className="btn-primary" onClick={startSpeaking}>Start Speaking Now</button>
              <button type="button" className="btn-secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="play-icon-circle">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <svg className="microphone" viewBox="0 0 460 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* 3D Capsule Gradient */}
                <linearGradient id="capsuleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="25%" stopColor="#5B58EE" />
                  <stop offset="60%" stopColor="#4338CA" />
                  <stop offset="90%" stopColor="#3730A3" />
                  <stop offset="100%" stopColor="#312E81" />
                </linearGradient>

                {/* Cradle U-Arm Gradient */}
                <linearGradient id="cradleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#554DE8" />
                  <stop offset="50%" stopColor="#4338CA" />
                  <stop offset="100%" stopColor="#3730A3" />
                </linearGradient>

                {/* Cradle 3D Highlight */}
                <linearGradient id="cradleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#6366F1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
                </linearGradient>

                {/* Stand Stem Gradient */}
                <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="40%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#312E81" />
                </linearGradient>

                {/* Base Top Gradient */}
                <linearGradient id="baseTop" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#4338CA" />
                </linearGradient>

                {/* Base Rim Gradient */}
                <linearGradient id="baseRim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="50%" stopColor="#3730A3" />
                  <stop offset="100%" stopColor="#312E81" />
                </linearGradient>

                {/* Wave Bar Gradient */}
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9B9DF8" />
                  <stop offset="100%" stopColor="#8184F5" />
                </linearGradient>

                {/* Outer Glow Radial */}
                <radialGradient id="outerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#EEF0FF" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#F5F6FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </radialGradient>

                {/* Drop shadow filter */}
                <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#4338CA" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Background Circular Glow Rings */}
              <circle cx="230" cy="200" r="165" fill="url(#outerGlow)" />
              <circle cx="230" cy="200" r="135" fill="#F8F9FF" stroke="#E9ECFD" strokeWidth="1.5" />
              <circle cx="230" cy="200" r="102" fill="#ECEFFE" opacity="0.65" />

              {/* Sound Wave Bars Left */}
              <g className="sound-waves-left">
                <rect x="42" y="185" width="5" height="30" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
                <rect x="57" y="174" width="5" height="52" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-2" />
                <rect x="72" y="162" width="5" height="76" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="87" y="180" width="5" height="40" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
                <rect x="102" y="152" width="5" height="96" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="117" y="138" width="5.5" height="124" rx="2.75" fill="url(#waveGrad)" className="wave-bar wave-2" />
                <rect x="133" y="148" width="5.5" height="104" rx="2.75" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="149" y="168" width="5" height="64" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
              </g>

              {/* Sound Wave Bars Right */}
              <g className="sound-waves-right">
                <rect x="306" y="168" width="5" height="64" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
                <rect x="321" y="148" width="5.5" height="104" rx="2.75" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="337" y="138" width="5.5" height="124" rx="2.75" fill="url(#waveGrad)" className="wave-bar wave-2" />
                <rect x="353" y="152" width="5" height="96" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="368" y="180" width="5" height="40" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
                <rect x="383" y="162" width="5" height="76" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-3" />
                <rect x="398" y="174" width="5" height="52" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-2" />
                <rect x="413" y="185" width="5" height="30" rx="2.5" fill="url(#waveGrad)" className="wave-bar wave-1" />
              </g>

              {/* Drop Shadow Underneath Stand Base */}
              <ellipse cx="230" cy="336" rx="38" ry="7" fill="#CCD1F5" opacity="0.55" />

              {/* Pedestal Base (Disc) */}
              <ellipse cx="230" cy="326" rx="34" ry="9" fill="url(#baseRim)" />
              <ellipse cx="230" cy="323" rx="32" ry="7" fill="url(#baseTop)" />

              {/* Vertical Stand Shaft */}
              <rect x="224" y="240" width="12" height="85" rx="6" fill="url(#stemGrad)" />

              {/* Cradle Base Joint */}
              <rect x="218" y="231" width="24" height="14" rx="7" fill="url(#cradleGrad)" />

              {/* Shockmount Cradle U-Arm */}
              <path
                d="M 178 184 C 178 244, 282 244, 282 184"
                fill="none"
                stroke="url(#cradleGrad)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <path
                d="M 178 184 C 178 244, 282 244, 282 184"
                fill="none"
                stroke="url(#cradleHighlight)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Cradle Pivot Knobs */}
              <circle cx="178" cy="184" r="6.5" fill="url(#cradleGrad)" />
              <circle cx="178" cy="184" r="3" fill="#818CF8" />
              <circle cx="282" cy="184" r="6.5" fill="url(#cradleGrad)" />
              <circle cx="282" cy="184" r="3" fill="#818CF8" />

              {/* 3D Microphone Capsule */}
              <g filter="url(#shadowFilter)">
                <rect x="198" y="112" width="64" height="118" rx="32" fill="url(#capsuleGrad)" />

                {/* Capsule Top Specular Light */}
                <ellipse cx="221" cy="132" rx="14" ry="9" fill="#FFFFFF" opacity="0.32" transform="rotate(-20 221 132)" />

                {/* Grille Horizontal Lines */}
                <rect x="208" y="142" width="44" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.5" />
                <rect x="206" y="154" width="48" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.5" />
                <rect x="206" y="166" width="48" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.5" />
                <rect x="208" y="178" width="44" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.5" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <div className="stats-container">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className={`stat-icon icon-${stat.icon}`}></div>
              <div className="stat-info">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to improve your communication</p>
        </div>
        <div className="steps-container">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number">{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose">
        <div className="why-choose-content">
          <h2>Why Choose SpeakSprint AI?</h2>
          <p>Everything you need to become a better speaker</p>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-box">
                <div className="feature-icon"></div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-wave-icon">
                <rect x="2" y="8.5" width="2.4" height="7" rx="1.2" fill="#4F46E5" />
                <rect x="6.5" y="4.5" width="2.4" height="15" rx="1.2" fill="#4F46E5" />
                <rect x="11" y="2" width="2.4" height="20" rx="1.2" fill="#4F46E5" />
                <rect x="15.5" y="6" width="2.4" height="12" rx="1.2" fill="#4F46E5" />
                <rect x="20" y="7.5" width="2.4" height="9" rx="1.2" fill="#4F46E5" />
              </svg>
              <span className="logo-text">SpeakSprint <span className="logo-ai">AI</span></span>
            </div>
            <p className="footer-tagline">
              AI-powered speaking practice that analyzes your speech and helps you become a confident communicator. Practice for 60 seconds and improve for a lifetime.
            </p>
          </div>
          <div className="footer-right">
            <div className="footer-connect">
              <span className="footer-connect-title">Connect with us</span>
              <div className="footer-socials">
                <a href="#twitter" aria-label="Twitter" className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#linkedin" aria-label="LinkedIn" className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.62 1.62 0 1 0 0-3.24 1.62 1.62 0 0 0 0 3.24m1.4 9.74v-8.37H5.06v8.37z"/>
                  </svg>
                </a>
                <a href="#github" aria-label="GitHub" className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>
                <a href="#discord" aria-label="Discord" className="social-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-meta-links">
              <a href="#privacy">Privacy Policy</a>
              <span className="dot">•</span>
              <a href="#terms">Terms of Service</a>
              <span className="dot">•</span>
              <a href="#cookies">Cookie Preferences</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 SpeakSprint AI. All rights reserved.</p>
          <p className="footer-note">Speak for 60 seconds. Improve for a lifetime.</p>
        </div>
      </footer>
    </div>
  );
}
