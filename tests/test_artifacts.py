"""Tests ensuring epochs bind glitch artifacts and regret logs."""
from __future__ import annotations

import unittest

from codus_epoch.epochs import generate_epoch_stack
from codus_epoch.glitch import GLITCH_GLYPHS


class ArtifactBindingTest(unittest.TestCase):
    def test_each_epoch_contains_glitch_trace_and_regret_log(self) -> None:
        stack = generate_epoch_stack(seed=2201)
        for epoch in stack.epochs:
            self.assertGreaterEqual(len(epoch.regret_log), 2)
            self.assertTrue(any(glyph in epoch.glitch_trace for glyph in GLITCH_GLYPHS))
            self.assertIsNotNone(epoch.glitch_banner)
            self.assertTrue(epoch.patch_lore)
            self.assertTrue(epoch.patch_fragment)
            self.assertTrue(epoch.regret_anchor)


if __name__ == "__main__":
    unittest.main()
