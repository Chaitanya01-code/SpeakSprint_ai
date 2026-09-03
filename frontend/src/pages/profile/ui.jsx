import React, { useState } from "react";
import "./profile.css";

const createInitialProfile = (authUser) => ({
  name: authUser?.username || null,
  email: authUser?.email || null,
  college: null,
  department: null,
  domain: authUser?.domain || null,
  year: null,
  bio: null,
  picture: "",
});

const streakDays = [];

const Profile = ({ authUser }) => {
  const initialProfile = createInitialProfile(authUser);
  const [profile, setProfile] = useState(initialProfile);
  const [draftProfile, setDraftProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSavedMessage("Please choose an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setDraftProfile((current) => ({ ...current, picture: reader.result }));
      setSavedMessage("");
    };
    reader.readAsDataURL(file);
  };

  const removePicture = () => {
    setDraftProfile((current) => ({ ...current, picture: "" }));
    setSavedMessage("");
  };

  const updateDraft = (event) => {
    const { name, value } = event.target;
    setDraftProfile((current) => ({ ...current, [name]: value }));
    setSavedMessage("");
  };

  const startEditing = () => {
    setDraftProfile(profile);
    setIsEditing(true);
    setSavedMessage("");
  };

  const cancelEditing = () => {
    setDraftProfile(profile);
    setIsEditing(false);
    setSavedMessage("");
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(draftProfile);
    setIsEditing(false);
    setSavedMessage("Profile updated");
  };

  return (
    <section className="ss-profile-page" aria-labelledby="profile-page-title">
      <header className="ss-profile-page-header">
        <div>
          <p className="ss-profile-page-eyebrow">Your account</p>
          <h1 id="profile-page-title">Profile</h1>
          <p className="ss-profile-page-subtitle">Manage your details and keep your speaking streak moving.</p>
        </div>
        {!isEditing && (
          <button type="button" className="ss-profile-edit-button" onClick={startEditing}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m4 16-.7 4.7L8 20l11.4-11.4a2.1 2.1 0 0 0-3-3L5 17Z" />
              <path d="m14.8 7.2 2 2" />
            </svg>
            Edit profile
          </button>
        )}
      </header>

      <div className="ss-profile-layout">
        <article className="ss-profile-identity-panel">
          <div className="ss-profile-avatar" aria-label="Profile picture">
            {(isEditing ? draftProfile.picture : profile.picture) ? (
              <img src={isEditing ? draftProfile.picture : profile.picture} alt={`${profile.name} profile`} />
            ) : (
              <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
                <rect width="96" height="96" rx="18" fill="#C7D2FE" />
                <circle cx="48" cy="36" r="20" fill="#FBBF24" />
                <path d="M29 34c3-14 35-17 39 0-4-7-11-10-20-10-8 0-15 3-19 10Z" fill="#1F2937" />
                <circle cx="41" cy="37" r="2" fill="#1F2937" />
                <circle cx="55" cy="37" r="2" fill="#1F2937" />
                <path d="M43 47c3 3 7 3 10 0" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" />
                <path d="M21 88c1-18 11-28 27-28s26 10 27 28" fill="#3B82F6" />
                <path d="m41 61 7 10 7-10" fill="#fff" />
              </svg>
            )}
          </div>
          <h2>{profile.name ?? "null"}</h2>
          <p>{profile.email ?? "null"}</p>
          <span className="ss-profile-member-label">Member since {authUser?.created_at || "null"}</span>
          {isEditing && (
            <div className="ss-profile-picture-actions">
              <label className="ss-profile-picture-button">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {draftProfile.picture ? "Change picture" : "Add picture"}
                <input type="file" accept="image/*" onChange={handlePictureChange} />
              </label>
              {draftProfile.picture && (
                <button type="button" className="ss-profile-picture-remove" onClick={removePicture}>Remove</button>
              )}
            </div>
          )}
        </article>

        <form className="ss-profile-details-panel" onSubmit={saveProfile}>
          <div className="ss-profile-panel-heading">
            <div>
              <h2>Personal information</h2>
              <p>Keep your learning profile up to date.</p>
            </div>
            {savedMessage && <span className="ss-profile-saved-message">{savedMessage}</span>}
          </div>

          <div className="ss-profile-fields">
            <label>
              Full name
              <input name="name" value={(isEditing ? draftProfile.name : profile.name) ?? "null"} onChange={updateDraft} readOnly={!isEditing} />
            </label>
            <label>
              Email address
              <input type="email" name="email" value={(isEditing ? draftProfile.email : profile.email) ?? "null"} onChange={updateDraft} readOnly={!isEditing} />
            </label>
            <label>
              College
              <input name="college" value={(isEditing ? draftProfile.college : profile.college) ?? "null"} onChange={updateDraft} readOnly={!isEditing} />
            </label>
            <label>
              Department
              <input name="department" value={(isEditing ? draftProfile.department : profile.department) ?? "null"} onChange={updateDraft} readOnly={!isEditing} />
            </label>
            <label>
              Domain
              <input name="domain" value={(isEditing ? draftProfile.domain : profile.domain) ?? "null"} onChange={updateDraft} readOnly={!isEditing} />
            </label>
            <label>
              Year
              <select name="year" value={isEditing ? draftProfile.year : profile.year} onChange={updateDraft} disabled={!isEditing}>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </label>
            <label className="ss-profile-bio-field">
              About you
              <textarea name="bio" value={(isEditing ? draftProfile.bio : profile.bio) ?? "null"} onChange={updateDraft} readOnly={!isEditing} rows="3" />
            </label>
          </div>

          {isEditing && (
            <div className="ss-profile-form-actions">
              <button type="button" className="ss-profile-cancel-button" onClick={cancelEditing}>Cancel</button>
              <button type="submit" className="ss-profile-save-button">Save changes</button>
            </div>
          )}
        </form>
      </div>

      <section className="ss-streaks-panel" aria-labelledby="streaks-title">
        <div className="ss-streaks-heading">
          <div>
            <p className="ss-profile-page-eyebrow">Consistency pays off</p>
            <h2 id="streaks-title">Maintained streaks</h2>
          </div>
          <span className="ss-streaks-fire" aria-label="Current streak">null</span>
        </div>
        <div className="ss-streak-stats">
          <div><strong>null</strong><span>Current streak</span></div>
          <div><strong>null</strong><span>Best streak</span></div>
          <div><strong>null</strong><span>Practice days</span></div>
        </div>
        <div className="ss-streak-week" aria-label="Speaking activity for the current week">
          {streakDays.map((item) => (
            <div className={`ss-streak-day ${item.active ? "active" : ""}`} key={item.day}>
              <span>{item.day}</span>
              <strong>{item.date}</strong>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Profile;
