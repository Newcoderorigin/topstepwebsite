"""Glitch and decay artifact generation for Codus-EPOCH epochs."""
from __future__ import annotations

from dataclasses import dataclass
import random
from typing import Iterable, List, Sequence


GLITCH_GLYPHS: Sequence[str] = ("▓", "░", "█", "Ø", "Æ", "¿", "∴", "⌛", "✶", "¤")
PREFIXES: Sequence[str] = (
    "signal fracture",
    "memory gap",
    "ideology checksum",
    "ghost interference",
    "value drift leak",
    "timeline suture",
)
SUFFIXES: Sequence[str] = (
    "stabilized-ish",
    "unpatched",
    "documented in whispers",
    "awaiting quorum",
    "burned into UI",
    "kept for archeology",
)


@dataclass
class GlitchArtifact:
    """Represents a generated glitch band for an epoch."""

    banner: str
    glyphs: str
    annotation: str


def _choose(seq: Sequence[str], rng: random.Random) -> str:
    return rng.choice(seq)


def inject_glitch(text: str, rng: random.Random, intensity: float = 0.12) -> str:
    """Insert symbolic glitches into the supplied text."""

    if not text:
        return ""

    chars = list(text)
    glitch_count = max(1, int(len(chars) * intensity))
    positions = rng.sample(range(len(chars)), min(len(chars), glitch_count))

    for position in positions:
        chars[position] = _choose(GLITCH_GLYPHS, rng)

    return "".join(chars)


def spawn_artifact(year: int, rng: random.Random) -> GlitchArtifact:
    """Create a glitch banner describing the decay history."""

    prefix = _choose(PREFIXES, rng)
    suffix = _choose(SUFFIXES, rng)
    glyphs = "".join(_choose(GLITCH_GLYPHS, rng) for _ in range(6))
    banner = f"{prefix.upper()} {year:02d}".strip()
    annotation = f"{prefix} {suffix}."
    return GlitchArtifact(banner=banner, glyphs=glyphs, annotation=annotation)


def echo_decay(notes: Iterable[str]) -> List[str]:
    """Collapse a collection of notes into an annotated decay log."""

    collapsed: List[str] = []
    for index, note in enumerate(notes, start=1):
        collapsed.append(f"Σ-decay[{index:02d}] :: {note}")
    return collapsed


__all__ = [
    "GLITCH_GLYPHS",
    "GlitchArtifact",
    "inject_glitch",
    "spawn_artifact",
    "echo_decay",
]
