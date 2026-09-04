import asyncio
import json
import os
from pathlib import Path
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.userdb import User


load_dotenv(Path(__file__).parent.parent.parent / ".env")

router = APIRouter()


def _deepgram_api_key() -> Optional[str]:
    return os.getenv("DEEPGRAM_API_KEY") or os.getenv("DEEPGRAMMAR_API_KEY")


@router.get("/speech-to-text", tags=["Speech-to-text"])
async def speech_to_text_info() -> Dict[str, str]:
    """Describe the WebSocket endpoint used for live transcription."""
    return {
        "websocket_url": "/ws/speech-to-text",
        "audio_message": "Send audio as binary WebSocket messages",
        "transcript_message": "Receive JSON with transcript and is_final",
    }


@router.websocket("/ws/speech-to-text")
async def speech_to_text(websocket: WebSocket) -> None:
    """Stream binary audio from the browser to Deepgram and return transcripts."""
    await websocket.accept()

    user_id = websocket.query_params.get("user_id")
    previous_presence = None
    if user_id and user_id.isdigit():
        db = SessionLocal()
        try:
            user = db.scalar(select(User).where(User.id == int(user_id)))
            if user:
                previous_presence = user.presence_status
                user.presence_status = "speaking"
                db.commit()
        finally:
            db.close()

    try:
        from deepgram import DeepgramClient, LiveOptions, LiveTranscriptionEvents
    except (ImportError, SyntaxError):
        await websocket.close(code=1011, reason="Deepgram SDK is unavailable for this Python runtime")
        return

    api_key = _deepgram_api_key()
    if not api_key:
        await websocket.close(code=1011, reason="DEEPGRAM_API_KEY is not configured")
        return

    event_loop = asyncio.get_running_loop()
    transcript_queue: asyncio.Queue = asyncio.Queue()
    deepgram = DeepgramClient(api_key=api_key)
    connection = deepgram.listen.live.v("1")

    def handle_transcript(*args: Any, **kwargs: Any) -> None:
        result = args[1] if len(args) > 1 else kwargs.get("result")
        if result is None:
            return

        try:
            alternative = result.channel.alternatives[0]
            transcript = alternative.transcript
            is_final = bool(result.is_final)
        except (AttributeError, IndexError):
            return

        if transcript:
            event_loop.call_soon_threadsafe(
                transcript_queue.put_nowait,
                {"type": "transcript", "transcript": transcript, "is_final": is_final},
            )

    connection.on(LiveTranscriptionEvents.Transcript, handle_transcript)
    started = connection.start(
        LiveOptions(
            model="nova-2",
            language="en-US",
            smart_format=True,
            punctuate=True,
            interim_results=True,
            endpointing="300",
        )
    )
    if not started:
        await websocket.close(code=1011, reason="Unable to start Deepgram transcription")
        return

    receive_task = asyncio.create_task(websocket.receive())
    transcript_task = asyncio.create_task(transcript_queue.get())

    try:
        while True:
            done, _ = await asyncio.wait(
                (receive_task, transcript_task),
                return_when=asyncio.FIRST_COMPLETED,
            )

            if receive_task in done:
                message = receive_task.result()
                if message.get("type") == "websocket.disconnect":
                    break

                audio = message.get("bytes")
                command = message.get("text")
                if audio:
                    connection.send(audio)
                elif command:
                    try:
                        command_data = json.loads(command)
                    except json.JSONDecodeError:
                        command_data = command
                    if command_data == "stop" or (
                        isinstance(command_data, dict) and command_data.get("type") == "stop"
                    ):
                        break

                receive_task = asyncio.create_task(websocket.receive())

            if transcript_task in done:
                await websocket.send_json(transcript_task.result())
                transcript_task = asyncio.create_task(transcript_queue.get())
    except WebSocketDisconnect:
        pass
    finally:
        receive_task.cancel()
        transcript_task.cancel()
        connection.finish()
        if user_id and user_id.isdigit() and previous_presence is not None:
            db = SessionLocal()
            try:
                user = db.scalar(select(User).where(User.id == int(user_id)))
                if user and user.presence_status == "speaking":
                    user.presence_status = previous_presence
                    db.commit()
            finally:
                db.close()
        if websocket.client_state.name != "DISCONNECTED":
            await websocket.close()