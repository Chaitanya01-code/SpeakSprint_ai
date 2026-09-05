import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL, authFetch } from "../lib/api";

const getSpeechSocketUrl = () => {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL;
  if (configuredUrl) {
    return `${configuredUrl.replace(/^http/, "ws")}/ws/speech-to-text${getUserQuery()}`;
  }

  return `${API_BASE_URL.replace(/^http/, "ws")}/ws/speech-to-text${getUserQuery()}`;
};

const getUserQuery = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  const userId = localStorage.getItem("selectedUserId") || authUser?.user_id;
  return userId ? `?user_id=${encodeURIComponent(userId)}` : "";
};

const getRecorderOptions = () => {
  if (!window.MediaRecorder?.isTypeSupported) return undefined;
  const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
  const mimeType = mimeTypes.find((type) => window.MediaRecorder.isTypeSupported(type));
  return mimeType ? { mimeType } : undefined;
};

export default function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const recorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const latestTranscriptRef = useRef("");

  const stop = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "stop" }));
    }
    socketRef.current?.close();
    socketRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    setAudioLevel(0);
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    if (isListening) return true;
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError("This browser does not support microphone recording.");
      return false;
    }

    setError("");
    finalTranscriptRef.current = "";
    latestTranscriptRef.current = "";
    setTranscript("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const socket = new WebSocket(getSpeechSocketUrl());
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      audioContext.createMediaStreamSource(stream).connect(analyser);

      streamRef.current = stream;
      socketRef.current = socket;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      socket.onopen = () => {
        const recorder = new MediaRecorder(stream, getRecorderOptions());
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) socket.send(event.data);
        };
        recorder.onerror = () => setError("The browser could not read microphone audio.");
        recorder.start(250);
        recorderRef.current = recorder;
        setIsListening(true);

        const updateLevel = () => {
          if (!analyserRef.current || !streamRef.current) return;
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          const average = data.reduce((sum, value) => sum + value, 0) / data.length / 255;
          setAudioLevel(average);
          animationFrameRef.current = window.requestAnimationFrame(updateLevel);
        };
        updateLevel();
      };
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type !== "transcript" || !message.transcript) return;
        if (message.is_final) {
          finalTranscriptRef.current = `${finalTranscriptRef.current} ${message.transcript}`.trim();
        }
        const nextTranscript = `${finalTranscriptRef.current} ${message.is_final ? "" : message.transcript}`.trim();
        latestTranscriptRef.current = nextTranscript;
        setTranscript(nextTranscript);
      };
      socket.onerror = () => {
        setError("Could not connect to the speech-to-text server.");
        stop();
      };
      socket.onclose = () => {
        if (isListening) setIsListening(false);
      };
      return true;
    } catch (startError) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setError(startError.name === "NotAllowedError" ? "Allow microphone access to start speaking." : "Microphone could not be started.");
      return false;
    }
  }, [isListening, stop]);

  const toggle = useCallback(() => (isListening ? stop() : start()), [isListening, start, stop]);

  const saveTranscript = useCallback(async ({ userId, durationSeconds = 0, topic = null }) => {
    const text = (latestTranscriptRef.current || transcript).trim();
    if (!userId || !text) return null;

    const response = await authFetch("/api/v1/transcripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        transcript: text,
        duration_seconds: Math.max(0, Math.round(durationSeconds)),
        topic,
      }),
    });
    if (!response.ok) throw new Error("Unable to save transcript");
    return response.json();
  }, [transcript]);

  useEffect(() => stop, [stop]);

  return { audioLevel, error, isListening, saveTranscript, start, stop, toggle, transcript };
}
