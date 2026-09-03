import unittest

from app.core.settingsdb import get_session_duration_seconds


class SettingsDbTests(unittest.TestCase):
    def test_default_duration_is_sixty_seconds(self):
        self.assertEqual(get_session_duration_seconds(), 60)


if __name__ == "__main__":
    unittest.main()
