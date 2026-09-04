import unittest

from app.core.settingsdb import get_session_duration_seconds


class SettingsDbTests(unittest.TestCase):
    def test_default_duration_is_two_minutes(self):
        self.assertEqual(get_session_duration_seconds(), 120)


if __name__ == "__main__":
    unittest.main()
