"""Speaking turn timing model."""

from datetime import datetime, timedelta


class SpeakingTurn:
	"""A timed turn for the current speaking user."""

	DEFAULT_DURATION_MINUTES = 5

	def __init__(
		self,
		user_id: int,
		duration: int = DEFAULT_DURATION_MINUTES,
		started_at: datetime | None = None,
	):
		self.user_id = user_id
		self.duration = self._validate_duration(duration)
		self.started_at = started_at or datetime.now()

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
		return self.started_at + timedelta(minutes=self.duration)

	def remaining_seconds(self, now: datetime | None = None) -> int:
		"""Return remaining time for this turn, never below zero."""
		current_time = now or datetime.now()
		return max(0, int((self.ends_at - current_time).total_seconds()))

	def set_duration(self, duration: int, admin_user) -> int:
		"""Set the current user's turn duration when called by an administrator."""
		self._require_admin(admin_user)
		self.duration = self._validate_duration(duration)
		return self.duration
