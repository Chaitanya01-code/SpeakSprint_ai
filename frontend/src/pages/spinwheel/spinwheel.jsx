import { useEffect, useRef, useState } from "react";
import { selectedTopic, topics } from "./topics";
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
	const [isSpinning, setIsSpinning] = useState(false);
	const [selected, setSelected] = useState(selectedTopic);
	const [wheelRotation, setWheelRotation] = useState(0);
	const [seconds, setSeconds] = useState(60);
	const [preparationSeconds, setPreparationSeconds] = useState(5);
	const [isPreparing, setIsPreparing] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [waveform, setWaveform] = useState(() => Array.from({ length: 32 }, () => 0.12));
	const [micError, setMicError] = useState("");
	const audioContextRef = useRef(null);
	const analyserRef = useRef(null);
	const streamRef = useRef(null);
	const animationFrameRef = useRef(null);
	const recordingRef = useRef(false);

	useEffect(() => {
		if (!isRecording || isPaused || seconds === 0) return undefined;
		const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
		return () => window.clearInterval(timer);
	}, [isRecording, isPaused, seconds]);

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

	useEffect(() => () => {
		if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
		streamRef.current?.getTracks().forEach((track) => track.stop());
		audioContextRef.current?.close();
	}, []);

	const spin = () => {
		const topicIndex = Math.floor(Math.random() * topics.length);
		const segmentCenter = topicIndex * (360 / topics.length) + (180 / topics.length);
		const currentRotation = wheelRotation % 360;
		const targetRotation = wheelRotation + 1080 + ((360 - segmentCenter - currentRotation + 360) % 360);

		setIsSpinning(true);
		setWheelRotation(targetRotation);
		window.setTimeout(() => {
			setSelected({
				title: `The Future of ${topics[topicIndex]}`,
				prompt: selectedTopic.prompt,
			});
			setIsSpinning(false);
		}, 850);
	};

	const startChallenge = () => {
		setPreparationSeconds(5);
		setIsPreparing(true);
		document.getElementById("timer")?.scrollIntoView({ behavior: "smooth" });
	};

	const animateWaveform = () => {
		const analyser = analyserRef.current;
		if (!analyser || !recordingRef.current) return;
		const data = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(data);
		const bars = Array.from({ length: 32 }, (_, index) => Math.max(0.12, (data[index * 2] || 0) / 255));
		setWaveform(bars);
		animationFrameRef.current = window.requestAnimationFrame(animateWaveform);
	};

	const toggleRecording = async () => {
		if (isRecording) {
			recordingRef.current = false;
			setIsRecording(false);
			streamRef.current?.getTracks().forEach((track) => track.stop());
			return;
		}

		if (seconds === 0) setSeconds(60);
		setMicError("");
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const analyser = audioContext.createAnalyser();
			analyser.fftSize = 64;
			audioContext.createMediaStreamSource(stream).connect(analyser);
			streamRef.current = stream;
			audioContextRef.current = audioContext;
			analyserRef.current = analyser;
			recordingRef.current = true;
			setIsRecording(true);
			window.requestAnimationFrame(animateWaveform);
		} catch (error) {
			setMicError("Microphone access is needed for the live waveform.");
			console.error("Microphone error:", error);
		}
		setIsPaused(false);
	};

	return (
		<main className="practice-page">
			<div className="practice-content">
				<section className="practice-section topic-section">
					<div className="section-heading"><div><h1>1. Choose a Topic</h1><p>Spin the wheel to get a random topic</p></div><span className="step-pill">STEP 1 OF 3</span></div>
					<div className="topic-grid">
						<div className="wheel-wrap">
							<div className={`wheel ${isSpinning ? "spinning" : ""}`} style={{ transform: `rotate(${wheelRotation}deg)` }}>
								{topics.map((topic, index) => <span className={`wheel-label label-${index}`} key={topic}>{topic}</span>)}
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
							<div className="recording-status"><strong>{formatTime(60 - seconds)}</strong><small>{isRecording ? "Recording..." : "Ready to record"}</small></div>
							<div className="recording-actions"><button className="secondary-button" onClick={() => setIsPaused((value) => !value)} disabled={!isRecording}>{isPaused ? "▶ Resume" : "Ⅱ Pause"}</button><button className="stop-button" onClick={() => { setIsRecording(false); setIsPaused(false); }}>■ Stop</button></div>
						</div>
					</div>
					{micError && <p className="mic-error">{micError}</p>}
				</section>
			</div>
		</main>
	);
};

export default SpinWheel;
