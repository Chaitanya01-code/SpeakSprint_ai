import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.ai_analysis.fluency import calculate_fluency

router = APIRouter(tags=["speech"])


@router.websocket("/ws/speech")
async def speech_analysis(websocket: WebSocket) -> None:
    """Receive transcribed speech and return live fluency metrics.

    The speech-to-text layer should send JSON messages with a ``transcript``
    and the elapsed ``duration_seconds`` for that transcript.
    """
    await websocket.accept()

    try:
        while True:
            message = await websocket.receive_text()
            try:
                payload = json.loads(message)
                transcript = payload.get("transcript", "")
                duration_seconds = float(payload.get("duration_seconds", 0))
                metrics = calculate_fluency(transcript, duration_seconds)
            except (ValueError, TypeError, json.JSONDecodeError) as error:
                await websocket.send_json({"error": str(error)})
                continue

            await websocket.send_json(metrics)
    except WebSocketDisconnect:
        return
