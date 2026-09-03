import { useState } from "react";
import { users } from "./users";
import "./userselection.css";

const UserSelection = () => {
	const [selectedName, setSelectedName] = useState("");

	const handleContinue = (event) => {
		event.preventDefault();
		if (selectedName) {
			window.location.hash = "#/practice";
		}
	};

	return (
		<main className="user-selection-page">
			<section className="user-selection-card" aria-labelledby="welcome-title">
				<div className="user-icon" aria-hidden="true">
					<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4">
						<circle cx="24" cy="15" r="6.5" />
						<path d="M12 38c0-6.5 5.4-11 12-11s12 4.5 12 11" />
					</svg>
				</div>
				<h1 id="welcome-title">Welcome!</h1>
				<p className="welcome-subtitle">Please enter your name to continue</p>

				<form className="user-selection-form" onSubmit={handleContinue}>
					<label htmlFor="user-name">Select Your Name</label>
					<div className="select-wrapper">
						<select
							id="user-name"
							value={selectedName}
							onChange={(event) => setSelectedName(event.target.value)}
							required
						>
							<option value="" disabled>Choose your name</option>
							{users.map((user) => <option key={user} value={user}>{user}</option>)}
						</select>
						<span className="select-arrow" aria-hidden="true">⌄</span>
					</div>
					<button type="submit" className="continue-button">
						Continue <span aria-hidden="true">→</span>
					</button>
				</form>
			</section>
		</main>
	);
};

export default UserSelection;
