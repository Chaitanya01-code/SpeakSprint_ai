import React, { useState } from "react";
import "./style.css";
import { API_BASE_URL } from "../../lib/api";

const Login = () => {
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!loginIdentifier || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      // API call to backend
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(loginIdentifier.includes("@")
            ? { email: loginIdentifier }
            : { username: loginIdentifier }),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authUser", JSON.stringify(data));
        if (rememberMe) {
          localStorage.setItem("rememberedLogin", loginIdentifier);
        } else {
          localStorage.removeItem("rememberedLogin");
        }
        window.location.href = data.is_admin ? "/admin" : "/dashboard";
      } else {
        setError(data.detail || data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Load remembered email if available
    const rememberedLogin =
      localStorage.getItem("rememberedLogin") ||
      localStorage.getItem("rememberedEmail");
    if (rememberedLogin) {
      setLoginIdentifier(rememberedLogin);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="8" y="2" width="8" height="13" rx="4" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
              </svg>
            </span>
            <span className="logo-text">SpeakSprint AI</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="auth-tabs">
          <div className="tab-item active" onClick={() => window.location.href = "/login"} style={{cursor: 'pointer'}}>
            <span>Log in</span>
          </div>
          <div className="tab-item" onClick={() => window.location.href = "/signup"} style={{cursor: 'pointer'}}>
            <span>Sign up</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="auth-form-section">
          <h1 className="auth-title">Welcome back!</h1>
          <p className="auth-subtitle">Log in to continue your speaking journey</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            {/* Email or Username Input */}
            <div className="form-group">
              <label htmlFor="loginIdentifier">Email or username</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>
                <input
                  type="text"
                  id="loginIdentifier"
                  placeholder="Enter your email or username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                  </svg>
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-footer">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-password-link">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-switch">
            Don't have an account?{" "}
            <a href="/signup" className="switch-link" style={{cursor: 'pointer'}}>
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
