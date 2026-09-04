import { useEffect, useState } from "react";
import { selectedTopic, topics as defaultTopics } from "./topics";
import useSpeechToText from "../../hooks/useSpeechToText";
import "./spinwheel.css";

const formatTime = (seconds) => {
	const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
	const remainder = (seconds % 60).toString().padStart(2, "0");
	return `${minutes}:${remainder}`;
};

const createWavePath = (values) => values.map((value, index) => {
	const x = (index / (values.length - 1)) * 600;
	const y = 32 - value * 27;
	return `${index === 0 ? "M" : "L"} ${x} ${y}`;
}).join(" ");

const Icon = ({ children }) => <span className="practice-icon" aria-hidden="true">{children}</span>;

const SpinWheel = () => {
	const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
	const selectedUser = localStorage.getItem("selectedUser") || authUser?.username || "Guest Speaker";
	const selectedUserId = localStorage.getItem("selectedUserId") || authUser?.user_id;
	const [topics, setTopics] = useState(() => defaultTopics.map((title) => ({ title, prompt: selectedTopic.prompt })));
	const [isSpinning, setIsSpinning] = useState(false);
	const [selected, setSelected] = useState(selectedTopic);
	const [wheelRotation, setWheelRotation] = useState(0);
	const [sessionDuration, setSessionDuration] = useState(60);
	const [seconds, setSeconds] = useState(60);
	const [preparationSeconds, setPreparationSeconds] = useState(5);
	const [isPreparing, setIsPreparing] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [waveform, setWaveform] = useState(() => Array.from({ length: 32 }, () => 0.12));
	const [saveNotice, setSaveNotice] = useState(null);
	const { audioLevel, error: speechError, isListening, saveTranscript, start, stop, transcript } = useSpeechToText();
	const isRecording = isListening;
	const stopAndSave = async () => {
		stop();
		setSaveNotice({ type: "saving", message: "Saving transcript..." });
		try {
			const savedTranscript = await saveTranscript({
				userId: selectedUserId,
				durationSeconds: (sessionDuration || 60) - seconds,
				topic: selected.title,
			});
			if (!savedTranscript) throw new Error("No transcript was available to save");
			setSaveNotice({ type: "success", message: `Transcript saved for ${selectedUser}.` });
		} catch (error) {
			console.error("Transcript save error:", error);
			setSaveNotice({ type: "error", message: "Transcript could not be saved. Please try again." });
		}
	};

	useEffect(() => {
		const loadTopics = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/v1/topics");
				if (!response.ok) return;
				const data = await response.json();
				const adminTopics = data
					.filter((topic) => topic.topic_name)
					.map((topic) => ({ title: topic.topic_name, prompt: topic.description || selectedTopic.prompt }));
				if (adminTopics.length > 0) {
					setTopics(adminTopics);
					setSelected(adminTopics[0]);
				}
			} catch (error) {
				console.warn("Unable to load admin topics", error);
			}
		};

		loadTopics();
	}, []);

	useEffect(() => {
		const loadSessionDuration = async () => {
			try {
				const response = await fetch("http://localhost:8000/api/v1/settings/session-duration");
				if (!response.ok) return;
				const data = await response.json();
				const nextDuration = Number(data.session_duration_seconds || 60);
				setSessionDuration(nextDuration);
				setSeconds(nextDuration);
			} catch (error) {
				console.warn("Unable to load timer duration", error);
			}
		};

		loadSessionDuration();
	}, []);

	useEffect(() => {
		if (!isRecording || isPaused || seconds === 0) return undefined;
		const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
		return () => window.clearInterval(timer);
	}, [isRecording, isPaused, seconds]);

	useEffect(() => {
		if (isRecording && seconds === 0) {
			stopAndSave();
			setIsPaused(false);
		}
	}, [isRecording, seconds]);

	useEffect(() => {
		if (!isPreparing) return undefined;
		const timer = window.setInterval(() => {
			setPreparationSeconds((value) => {
				if (value <= 1) {
					setIsPreparing(false);
					return 0;
				}
				return value - 1;
			});
		}, 1000);
		return () => window.clearInterval(timer);
	}, [isPreparing]);

	useEffect(() => {
		if (!isRecording) return;
		setWaveform(Array.from({ length: 32 }, (_, index) => Math.max(0.12, audioLevel * (0.6 + ((index % 5) * 0.1)) + 0.08)));
	}, [audioLevel, isRecording]);

	const spin = () => {
		const topicIndex = Math.floor(Math.random() * topics.length);
		const segmentCenter = topicIndex * (360 / topics.length) + (180 / topics.length);
		const currentRotation = wheelRotation % 360;
		const targetRotation = wheelRotation + 1080 + ((360 - segmentCenter - currentRotation + 360) % 360);

		setIsSpinning(true);
		setWheelRotation(targetRotation);
		window.setTimeout(() => {
			setSelected(topics[topicIndex]);
			setIsSpinning(false);
		}, 850);
	};

	const startChallenge = () => {
		setPreparationSeconds(5);
		setIsPreparing(true);
		document.getElementById("timer")?.scrollIntoView({ behavior: "smooth" });
	};

	const toggleRecording = async () => {
		if (isRecording) {
			await stopAndSave();
			return;
		}
		setSaveNotice(null);
		if (seconds === 0) setSeconds(sessionDuration || 60);
		await start();
		setIsPaused(false);
	};

	return (
		<main className="practice-page">
			<header className="practice-header">
				<a className="practice-brand" href="/">
					<span className="brand-mark" aria-hidden="true">∿</span>
					SpeakSprint <strong>AI</strong>
				</a>
				<div className="practice-session-context">
					<span className="practice-session-label">CURRENT SPEAKER</span>
					<strong>{selectedUser}</strong>
				</div>
				<a className="practice-exit" href="/">Exit practice <span aria-hidden="true">↗</span></a>
			</header>
			<div className="practice-content">
				<section className="practice-section topic-section">
					<div className="section-heading"><div><h1>1. Choose a Topic</h1><p>Spin the wheel to get a random topic</p></div><span className="step-pill">STEP 1 OF 3</span></div>
					<div className="topic-grid">
						<div className="wheel-wrap">
							<div className={`wheel ${isSpinning ? "spinning" : ""}`} style={{ transform: `rotate(${wheelRotation}deg)` }}>
								{topics.map((topic, index) => <span className="wheel-label" style={{ "--topic-index": index, "--topic-count": topics.length }} key={topic.title}>{topic.title}</span>)}
								<button className="spin-button" onClick={spin} disabled={isSpinning}>SPIN</button>
							</div>
							<span className="wheel-pointer" aria-hidden="true" />
						</div>
						<article className="selected-topic">
							<div className="topic-kicker"><Icon>▣</Icon> Selected Topic</div>
							<h2>{selected.title}</h2>
							<p>{selected.prompt}</p>
							<button className="primary-button" onClick={startChallenge}>Start Challenge <span>›</span></button>
						</article>
					</div>
				</section>

				<section className="practice-section timer-section" id="timer">
					<div className="section-heading"><div><h1>2. Speak for 60 Seconds</h1><p>You have 5 seconds to prepare, then speak for 60 seconds.</p></div><span className="step-pill">STEP 2 OF 3</span></div>
					<div className="timer-grid">
						<article className="countdown-panel"><h3>{isPreparing ? "Get Ready!" : "Ready!"}</h3><div className="countdown-ring"><strong>{preparationSeconds.toString().padStart(2, "0")}</strong><small>seconds</small></div><div className="dots">{Array.from({ length: 6 }, (_, index) => index < 5 - preparationSeconds ? "●" : "○").join(" ")}</div></article>
						<article className="speak-panel"><h3>Speak Now!</h3><strong className="time-display">{formatTime(seconds)}</strong><p>Tap the mic to start speaking</p><div className="waveform">▁▃▁▅▂▇▃▁▅▂▁▆▃▁▅▂▇▃▁▅▂▁▃</div></article>
						<aside className="tips-panel"><h3>Tips</h3><p><b>◉</b> Speak clearly and confidently</p><p><b>◌</b> Stay on topic</p><p><b>◈</b> Manage your time well</p><p><b>✓</b> Practice makes perfect</p></aside>
					</div>
				</section>

				<section className="practice-section recording-section">
					<div className="section-heading"><div><h1>3. Recording</h1><p>Your microphone is ready</p></div><span className="step-pill">STEP 3 OF 3</span></div>
					<div className="recording-row">
							<div className="recording-visual">
							<div className="recording-wave" aria-label="Live voice waveform">
								{waveform.map((height, index) => <span key={index} style={{ height: `${12 + height * 42}px` }} />)}
							</div>
							<button className={`mic-button ${isRecording ? "recording" : ""}`} onClick={toggleRecording} aria-label={isRecording ? "Stop recording" : "Start recording"}><span>♩</span></button>
						</div>
							<div className="recording-info">
								{transcript && <p className="speech-transcript" aria-live="polite">{transcript}</p>}
							<div className="recording-status"><strong>{formatTime((sessionDuration || 60) - seconds)}</strong><small>{isRecording ? "Recording..." : "Ready to record"}</small></div>
								<div className="recording-actions"><button className="primary-button start-recording-button" onClick={toggleRecording} disabled={isRecording}>▶ Start</button><button className="secondary-button" onClick={() => setIsPaused((value) => !value)} disabled={!isRecording}>{isPaused ? "▶ Resume" : "Ⅱ Pause"}</button><button className="stop-button" onClick={() => { stopAndSave(); setIsPaused(false); }}>■ Stop</button></div>
						</div>
					</div>
					{speechError && <p className="mic-error">{speechError}</p>}
					{saveNotice && <p className={`save-notice ${saveNotice.type}`} role={saveNotice.type === "error" ? "alert" : "status"}>{saveNotice.message}</p>}
				</section>
			</div>
		</main>
	);
};

export default SpinWheel;
