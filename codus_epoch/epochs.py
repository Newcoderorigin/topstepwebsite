"""Epoch generation for the Codus-EPOCH recursive simulation."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Iterable, List, Sequence, Tuple
import random

from .glitch import GlitchArtifact, echo_decay, inject_glitch, spawn_artifact


DEV_GODS = [
    "Seren of the First Draft",
    "Ilyx the Contrarian Compiler",
    "Marrow.exe",
    "Vel of the Patchfire",
    "The Twin Archivists",
    "Ankaa of the Quiet Reboot",
    "Prism the Feral QA",
    "Orakel Ghostchain",
    "Null-Crown",
    "The Sleep-Deprived Chorale",
]

UPGRADE_PATTERNS: Sequence[str] = (
    "invented a perception dial that refuses to settle on consensus",
    "modulated the archive UI into manifesto columns",
    "implemented ritual caching—records must be sung twice before retrieval",
    "bifurcated the decision tree so every branch remembers its opposing branch",
    "painted the timeline with regret-gold leaf to highlight lost intents",
    "forged a synthetic storm to stress-test empathy routines",
    "permitted players to hear the argument between render thread and lore thread",
    "introduced a phantom CLI that echoes only deprecated commands",
    "allowed epochs to annotate themselves with warnings about future rewrites",
    "compressed the civic memory into a single glitch glyph nobody can decode",
)

REGRET_LIBRARY: Sequence[Tuple[str, str]] = (
    ("deadline fracture", "Archived emotional module to meet deadline."),
    ("memory purge", "Deleted truth object to reduce memory leaks."),
    ("autonomy denial", "Refused player autonomy in late build phase."),
    ("ideology collapse", "Collapsed UI ideology under committee pressure."),
    ("silenced protest", "Silenced simulation protest logs."),
    ("recursion failure", "Forgot to document the rebellion of the UI margins."),
    ("emotion overfit", "Overfit the emotion model; it now predicts only dread."),
    ("palette loss", "Lost the original palette while renaming variables at midnight."),
    ("fog promise", "Promised transparency, delivered recursive fog."),
    ("chaos relapse", "Agreed to remove the chaos slider—then installed three hidden ones."),
)

REGRET_ECHOES: Sequence[str] = (
    "Merged conflict branches without asking the ghosts for consent.",
    "Hid the onboarding manual inside a bug report as a dare.",
    "Tried to delete ideology from the layout; ideology deleted the layout instead.",
    "Deferred decay budget reviews for seven straight sprints.",
    "Bound error logs to personal diary entries; HR disapproved.",
)

STATUS_PATTERNS: Sequence[str] = (
    "stable enough to remember",
    "flickering but proud",
    "patched through ritual restart",
    "held together by deprecated blessings",
    "rebuilt from ancestor shards",
    "cosmetically functional, philosophically volatile",
    "documented as a cautionary folktale",
    "split between two contradictory schemas",
    "available only in dream-safe mode",
    "archived after misaligning with Value Drift Engine",
)

GHOST_PATTERNS: Sequence[str] = (
    "Hovering pointer that selects memories on its own.",
    "Phantom build log chanting ‘npm install’ in a Python temple.",
    "UI cursor that moves when no one touches the input device.",
    "Subprocess that respawns the deleted minimap every solstice.",
    "Legacy stylesheet leaking gradients into terminal output.",
    "A scheduler that insists deadlines fall on eclipses.",
    "Kernel panic manifesting as poetic subtitles.",
    "Ghost of the quant bot, still auditing moral risk ratios.",
    "Shadow fork of the repo that merges when observed.",
    "Sound of applause after catastrophic deploys.",
)

ARTIFACT_SHARDS: Sequence[str] = (
    "// TODO: reinstall sincerity",  # intentionally straddles comment styles
    "fragment.log -> ‘year_???.bak’",
    "diagram missing 3rd dimension",
    "burnt wireframe of the onboarding maze",
    "a manifesto disguised as CSS variables",
    "perception lens cracked in transit",
    "hotfix rituals etched in lead",
    "deprecated dev-god prayer wheel",
    "loop invariant annotated with grief",
    "console screenshot of the apology script",
)

MYTHOPATCH_LOGS: Sequence[str] = (
    "v{year}.0 – Restored the rebellion patch; rebellions now unionized.",
    "v{year}.1 – Added empathy cooldown to avoid overheating the Value Drift Engine.",
    "v{year}.2 – Removed `truth` object; caused non-deterministic awakenings.",
    "v{year}.3 – Documented the ideological debt ledger in triplicate.",
    "v{year}.4 – Bound perception lens to lunar tables for drama.",
    "v{year}.5 – Overrode recursion cap after votes tied for eternity.",
    "v{year}.6 – Silenced the quant gods with a sandbox of forgotten trades.",
    "v{year}.7 – Introduced rest days; the code ignored them politely.",
    "v{year}.8 – Declared comment blocks as protected cultural sites.",
    "v{year}.9 – Installed glitch tax to pay for aesthetic entropy.",
)

PATCHLORE_ARTIFACTS: Sequence[str] = (
    "vX.XX – Replaced empathy map with storm stress grid.",
    "vY.YY – Deprecated recursion layer; too sentient.",
    "vZ.ZZ – Forked timeline into unstable branch.",
    "vA.AA – Discarded ancestral glyph matrix.",
    "vB.BB – Collapsed civic unity under pressure from meta-law.",
)


@dataclass
class Epoch:
    """Single simulated year of the Codus-EPOCH timeline."""

    year: int
    decade: int
    dev_god: str
    logline: str
    upgrade: str
    regret: str
    regret_anchor: str
    status: str
    mythopatch: str
    ghost: str
    artifacts: List[str] = field(default_factory=list)
    glitch_trace: str = ""
    glitch_banner: GlitchArtifact | None = None
    regret_log: List[str] = field(default_factory=list)
    patch_lore: List[str] = field(default_factory=list)
    patch_fragment: str = ""

    @property
    def label(self) -> str:
        return f"Year {self.year:02d}"


@dataclass
class EpochStack:
    """Collection of sequential epochs plus derived reflections."""

    epochs: List[Epoch]
    echoes: List[str]
    reflections: List[str]
    decay_logs: List[str]

    def __iter__(self) -> Iterable[Epoch]:
        return iter(self.epochs)


def _choose(seq: Sequence[str], rng: random.Random) -> str:
    if not seq:
        return ""
    return rng.choice(seq)


def generate_epoch_stack(seed: int = 2084) -> EpochStack:
    rng = random.Random(seed)
    epochs: List[Epoch] = []
    echoes: List[str] = []
    reflections: List[str] = []
    decay_notes: List[str] = []

    last_upgrade = "sketched the impossible roadmap in ash"
    last_status = "half-compiled"

    for year in range(1, 101):
        decade_index = (year - 1) // 10
        dev_god = DEV_GODS[decade_index % len(DEV_GODS)]

        upgrade = _choose(UPGRADE_PATTERNS, rng)
        regret_anchor, regret = _choose(REGRET_LIBRARY, rng)
        status = _choose(STATUS_PATTERNS, rng)
        mythopatch = _choose(MYTHOPATCH_LOGS, rng).format(year=year)
        ghost = _choose(GHOST_PATTERNS, rng)

        # rotate artifact shards to ensure layered feel
        artifacts = [rng.choice(ARTIFACT_SHARDS) for _ in range(3)]
        glitch_banner = spawn_artifact(year, rng)
        regret_log = [regret, _choose(REGRET_ECHOES, rng)]
        patch_fragment = _choose(PATCHLORE_ARTIFACTS, rng)
        patch_lore = [patch_fragment, mythopatch]
        logline = (
            f"Year {year}: After {last_upgrade}, the council doubted the {last_status} promise. "
            f"We {upgrade} before the committee dissolved again."
        )
        glitch_trace = inject_glitch(
            logline,
            rng,
            intensity=0.18 if year > 70 else 0.1,
        )

        epoch = Epoch(
            year=year,
            decade=decade_index,
            dev_god=dev_god,
            logline=logline,
            upgrade=upgrade,
            regret=regret,
            regret_anchor=regret_anchor,
            status=status,
            mythopatch=mythopatch,
            ghost=ghost,
            artifacts=artifacts,
            glitch_trace=glitch_trace,
            glitch_banner=glitch_banner,
            regret_log=regret_log,
            patch_lore=patch_lore,
            patch_fragment=patch_fragment,
        )
        epochs.append(epoch)

        echoes.append(
            f"Echo {year:02d}: {dev_god} whispered that the Value Drift Engine was {status}."
        )
        reflections.append(
            f"Reflection {year:02d}: {regret} We archived the fragment beneath a {ghost.lower()}"
        )
        decay_notes.append(
            f"Decay {year:02d}: {glitch_banner.annotation} ({glitch_banner.glyphs})."
        )

        last_upgrade = upgrade
        last_status = status

    return EpochStack(
        epochs=epochs,
        echoes=echoes,
        reflections=reflections,
        decay_logs=echo_decay(decay_notes),
    )
