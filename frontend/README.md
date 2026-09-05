# SpeakSprint AI Frontend

React and Vite frontend for SpeakSprint AI.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## SpeakSprint Development

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

The frontend runs at `http://127.0.0.1:5173` and uses `http://localhost:8001` locally. Set `VITE_BACKEND_URL` in `frontend/.env` to override the backend URL.

Available scripts:

```bash
npm run build
npm run lint
npm run preview
```

The application includes user analytics, transcript history, shared leaderboard data, admin AI reports, change-aware background refresh, and admin PDF export through `jspdf`. The Gemini API key stays in the backend environment and is never sent to the browser.

