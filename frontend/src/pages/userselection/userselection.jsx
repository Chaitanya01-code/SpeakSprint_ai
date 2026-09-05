import { useEffect, useState } from "react";
import "./userselection.css";
import { authFetch } from "../../lib/api";

const UserSelection = () => {
	const [selectedName, setSelectedName] = useState("");
	const [users, setUsers] = useState([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [usersError, setUsersError] = useState("");

	useEffect(() => {
		const loadUsers = async () => {
			try {
				const response = await authFetch("/api/v1/users");
				if (!response.ok) throw new Error("Unable to load users");
				const data = await response.json();
				setUsers(data.filter((user) => user.is_active && !user.is_admin));
			} catch (error) {
				setUsersError(error.message);
			} finally {
				setUsersLoading(false);
			}
		};

		loadUsers();
	}, []);

	const handleContinue = (event) => {
		event.preventDefault();
		if (selectedName) {
			const selectedUser = users.find((user) => (user.username || user.email) === selectedName);
			localStorage.setItem("selectedUser", selectedName);
			if (selectedUser) localStorage.setItem("selectedUserId", String(selectedUser.id));
			window.location.href = "/practice";
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
							<option value="" disabled>{usersLoading ? "Loading users..." : "Choose your name"}</option>
							{users.map((user) => <option key={user.id} value={user.username || user.email}>{user.username || user.email}</option>)}
						</select>
						<span className="select-arrow" aria-hidden="true">⌄</span>
					</div>
					{usersError && <p className="user-selection-error" role="alert">{usersError}</p>}
					{!usersLoading && !usersError && users.length === 0 && <p className="user-selection-error" role="alert">No active users are available.</p>}
					<button type="submit" className="continue-button">
						Continue <span aria-hidden="true">→</span>
					</button>
				</form>
			</section>
		</main>
	);
};

export default UserSelection;
