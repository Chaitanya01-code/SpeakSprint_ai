"""Speaking session timing models."""

from datetime import datetime, timedelta


class SpeakingSession:
    """A speaking session owned by one user.

    Duration is stored in minutes to keep the public API readable. New sessions
    default to five minutes unless an administrator supplies another value.
    """

    DEFAULT_DURATION_MINUTES = 5

    def __init__(
        self,
        user_id: int,
        topic: str,
        duration: int = DEFAULT_DURATION_MINUTES,
    ):
        self.user_id = user_id
        self.topic = topic
        self.duration = self._validate_duration(duration)
        self.created_at = datetime.now()

    @staticmethod
    def _validate_duration(duration: int) -> int:
        if isinstance(duration, bool) or not isinstance(duration, int) or duration <= 0:
            raise ValueError("Duration must be a positive number of minutes")
        return duration

    @staticmethod
    def _require_admin(admin_user) -> None:
        if not getattr(admin_user, "is_admin", False):
            raise PermissionError("Only an administrator can change the timer")

    @property
    def ends_at(self) -> datetime:
        """Return the time at which this session should end."""
        return self.created_at + timedelta(minutes=self.duration)

    def remaining_seconds(self, now: datetime | None = None) -> int:
        """Return remaining time for the current speaking user, never below zero."""
        current_time = now or datetime.now()
        return max(0, int((self.ends_at - current_time).total_seconds()))

    def set_duration(self, duration: int, admin_user) -> int:
        """Set this user's session duration when called by an administrator."""
        self._require_admin(admin_user)
        self.duration = self._validate_duration(duration)
        return self.duration