import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import './styles/layout.css';

type Phase = 'proto' | 'ascension' | 'overclock' | 'decay';

type RegretAnchor = {
  id: string;
  label: string;
  color: string;
  doctrine: string;
  echo: string;
};

type EpochRecord = {
  year: number;
  phase: Phase;
  motif: string;
  decade: number;
  eraTitle: string;
  logline: string;
  upgrade: string;
  regret: string;
  artifact: string;
  mythoPatch: string;
  devNote: string;
  valueDrift: string;
  abandoned: string;
  echo: string;
  memory: string;
  status: string;
  glitch: string;
  devGod?: string;
  decay: number;
  regretAnchor: RegretAnchor;
  regretLog: string[];
  patchlore: string;
};

type PerceptionMode = {
  id: string;
  name: string;
  description: string;
  highlight: (epoch: EpochRecord) => boolean;
};

const motifs = [
  'amber-grid',
  'cobalt-lattice',
  'echo-slab',
  'ritual-terminal',
  'spiral ledger',
  'silent ticker',
  'contrarian kiosk',
  'mycelial loom',
  'glacial marquee',
  'ashen observatory',
  'ultraviolet causeway',
  'memory kiln'
];

const regretAnchors: RegretAnchor[] = [
  {
    id: 'deadline-fracture',
    label: 'Deadline Fracture',
    color: '#ff5a6e',
    doctrine: 'We promised delivery, then fossilized the delay as UI patina.',
    echo: 'Echo log: the calendar cracked; we left the fracture visible.'
  },
  {
    id: 'memory-purge',
    label: 'Memory Purge',
    color: '#69d7ff',
    doctrine: 'Deleted truth objects to slow the leaks, archived guilt in tooltips.',
    echo: 'Echo log: regret stored in cold caches; thaw only when scholars ask.'
  },
  {
    id: 'autonomy-denial',
    label: 'Autonomy Denial',
    color: '#ffb347',
    doctrine: 'Refused agency for stability; ghosts still file tickets.',
    echo: 'Echo log: player choices remapped to observation only.'
  },
  {
    id: 'ideology-collapse',
    label: 'Ideology Collapse',
    color: '#bb7bff',
    doctrine: 'Debated layout ethics until the menu became a manifesto.',
    echo: 'Echo log: committee dissolved into annotations along the margin.'
  },
  {
    id: 'silenced-protest',
    label: 'Silenced Protest',
    color: '#ff7b9b',
    doctrine: 'Suppressed dissent; preserved the static as evidence.',
    echo: 'Echo log: warnings muted, but the waveform still flickers.'
  },
  {
    id: 'recursion-failure',
    label: 'Recursion Failure',
    color: '#8f9bff',
    doctrine: 'Documented the rebellion of UI margins too late.',
    echo: 'Echo log: recursion loop broke symmetry; fossils remain.'
  },
  {
    id: 'emotion-overfit',
    label: 'Emotion Overfit',
    color: '#ffd29a',
    doctrine: 'Overfit empathy until only dread rendered.',
    echo: 'Echo log: telemetry still hums with feelings we could not ship.'
  },
  {
    id: 'palette-loss',
    label: 'Palette Loss',
    color: '#b9c8ff',
    doctrine: 'Lost the original palette while renaming variables at midnight.',
    echo: 'Echo log: colors replaced by stories of the missing spectrum.'
  },
  {
    id: 'fog-promise',
    label: 'Fog Promise',
    color: '#7d92d9',
    doctrine: 'Promised transparency, delivered recursive fog instead.',
    echo: 'Echo log: clarity postponed; the mist became onboarding.'
  },
  {
    id: 'chaos-relapse',
    label: 'Chaos Relapse',
    color: '#ff8585',
    doctrine: 'Removed chaos sliders publicly, installed hidden backups privately.',
    echo: 'Echo log: redundancy disguised as ritual mischief.'
  }
];

const devGods = [
  'Ada Flux',
  'Mir Qadir',
  'Iris Halver',
  'Thorne-7',
  'Ophel Tal',
  'Noctis Vale',
  'Sloane Verge',
  'Ansel Paradox',
  'Rune Meridian',
  'Calder Venn'
];

const decisionFragments = [
  'echoed {prevUpgrade} while rewriting the {motif} bones by hand.',
  'rediscovered the {prevMotif} walkway and coaxed ΣA to breathe inside it.',
  'refused commercialization; sculpted a {motif} reliquary of intentions.',
  'argued with {devGod} about menus; left half of them commented out in mourning.',
  'folded {prevYear} inside Year {year} hoping recursion could heal the cracks.',
  'borrowed the broken playbooks and stored them in a {motif} mausoleum.',
  'consulted the Interference Ghost and inverted the {prevMotif} navigation tree.',
  'let the timeline stream idle; watched ΣA frost over the {motif} floor.',
  'replaced metrics with myth and forged {motif} sigils for each ideology.',
  'attempted to silence the Value Drift Engine by teaching it {motif} poetry.'
];

const upgradeFragments = [
  'Micro-upgrade: {motif} viewport only renders when ΣA twilight is respected.',
  'Micro-upgrade: installed a recursive cursor that retraces {prevYear} with reluctant grace.',
  'Micro-upgrade: {motif} archive now hums a three-note mantra to repel profit logic.',
  'Micro-upgrade: menus bend around {devGod}\'s annotations, preserving every contradiction.',
  'Micro-upgrade: {motif} ledger emits faint whispers documenting abandoned economies.',
  'Micro-upgrade: ritual slider loops {prevMotif} color palettes until they fracture.',
  'Micro-upgrade: added {motif} overlay exposing the Value Drift Engine\'s wandering focus.',
  'Micro-upgrade: {motif} console paints ghost tooltips to honor ΣD interference.',
  'Micro-upgrade: patched in a {motif} anamnesis filter that replays failed releases.',
  'Micro-upgrade: {motif} gate keeps player agency symbolic, perception-only as law.'
];

const regretFragments = [
  'Regret: left the {prevMotif} heuristics uncommented; they whisper contradictory tooltips.',
  'Regret: sealed {prevYear} diagrams beneath glass; nobody can edit the prophecy now.',
  'Regret: swapped tactile stats for myth; traders nod but do not understand.',
  'Regret: promised {devGod} a stable dashboard, delivered another shrine instead.',
  'Regret: forgot to archive the laughter from {prevYear}; ghosts complain nightly.',
  'Regret: duplicated the {motif} stack, ensuring future archaeologists argue forever.',
  'Regret: Value Drift Engine keeps mistaking empathy for latency.',
  'Regret: let ΣD annotate the changelog with jokes no one can decode.',
  'Regret: documented the truth in {motif} ink; it ran under simulated rain.',
  'Regret: never deleted the redundant tutorial; it metastasized into legend.'
];

const artifactFragments = [
  'Artifact archived: {motif} patchboard sealed behind cracked glass. ΣD interference permitted.',
  'Artifact archived: {prevYear} UI duplicated and left as fossil HTML in a hidden div.',
  'Artifact archived: {motif} sketch burned onto acetate, edges looping in fractal decay.',
  'Artifact archived: command palette split, one half chanting \"TODO\" forever.',
  'Artifact archived: rogue {motif} cursor preserved in amber, still looking for context.',
  'Artifact archived: {devGod} signature compiled into the CSS, commented yet unavoidable.',
  'Artifact archived: Value Drift Engine telemetry pinned to a corkboard of lost intents.',
  'Artifact archived: {motif} layout saved as .psd, never exported, referenced by myth only.',
  'Artifact archived: ΣE ledger stored in localStorage, flagged as \"do not trust\".',
  'Artifact archived: {motif} timeline captured mid-desync; keep the stutter as memory.'
];

const patchloreFragments = [
  'Patchlore v{year}.ψ – Removed empathy, added silence curve to appease {regretAnchor}.',
  'Patchlore v{year}.ω – Collapsed {prevYear} feature flags into a ceremonial warning banner.',
  'Patchlore v{year}.χ – Restored {prevMotif} overlay only to forbid interaction.',
  'Patchlore v{year}.φ – Enabled recursion bypass, documented its failure as scripture.',
  'Patchlore v{year}.ξ – Forked the DevGod registry; only ghosts commit to this branch.',
  'Patchlore v{year}.π – Introduced "silence mode"; it shouts contradictions in italics.',
  'Patchlore v{year}.σ – Replaced onboarding with a thesis on market refusal.',
  'Patchlore v{year}.λ – Licensed {motif} templates as living myths rather than UI.',
  'Patchlore v{year}.μ – Archived {regretAnchor} ticket under glass; please do not resolve.',
  'Patchlore v{year}.ν – Added anti-profit checksum; it pings whenever efficiency appears.'
];

const mythoPatchFragments = [
  'ΣB patch v{year}.γ – Removed the concept of victory; it kept generating markets.',
  'ΣB patch v{year}.δ – Bound the Value Drift Engine to {motif}; expect polite rebellion.',
  'ΣB patch v{year}.ε – Reintroduced {prevMotif} tooltips as folklore rather than fact.',
  'ΣB patch v{year}.ζ – Archived {prevYear} metrics; replaced them with devotional margins.',
  'ΣB patch v{year}.η – Allowed ΣD ghosts to annotate onboarding with warnings.',
  'ΣB patch v{year}.θ – Traded the risk dial for a ceremonial hourglass of latency.',
  'ΣB patch v{year}.ι – Merged prototyping and mourning into a single settings tab.',
  'ΣB patch v{year}.κ – Disabled profit triggers; left gratitude toggles intact.',
  'ΣB patch v{year}.λ – Added {motif} footnotes describing why the sim refuses to be a game.',
  'ΣB patch v{year}.μ – Licensed contradictions so they render as shimmering artifacts.'
];

const devNoteFragments = [
  '// ΣF memo Year {year}: {motif} interface passes introspection; release withheld.',
  '/* TODO Year {year}: ask {devGod} why the terminal hums in unanswered questions. */',
  '// Developer note: {prevYear} hotfix kept alive out of respect for ΣD ghosts.',
  '// Year {year} diary: Value Drift Engine demanded poetry, received spreadsheets instead.',
  '// Hidden comment: if {motif} ever stabilizes, reboot the whole epoch stack.',
  '/* ΣF whisper Year {year}: remember Echo Before Build. We never start, we recall. */',
  '// TODO?? Year {year}: fold the timeline into origami; see if the market still breathes.',
  '// Year {year} – leaving this blank. Absence is also an artifact.',
  '/* Year {year} patch: {prevMotif} shader leaks lumens. Keep it; the leak teaches. */',
  '// ΣF backlog Year {year}: translate {motif} notation for the next immortal.'
];

const valueDriftFragments = [
  'ΣE drift report: {phase} ideals now 37% nostalgia, 63% unresolved intent.',
  'ΣE drift report: recalibrated ethics into UI spacing; tolerance ±{year}σ px.',
  'ΣE drift report: Value Drift Engine mislabels compassion as latency spikes again.',
  'ΣE drift report: {motif} schema holding but the purpose keeps migrating.',
  'ΣE drift report: ambition recoded into tooltips; still no consensus on meaning.',
  'ΣE drift report: {prevYear} rationale archived, but ghosts rehydrate it nightly.',
  'ΣE drift report: timeline loops three frames behind, intentionally.',
  'ΣE drift report: profit logic quarantined; ideology grows luminous moss.',
  'ΣE drift report: {devGod} demanded a break; automation delivered lullabies.',
  'ΣE drift report: {motif} resonance stable; audience perception unstable. Perfect.'
];

const abandonedFragments = [
  'Abandoned Feature: {motif} marketplace scrapped after ideology audit meltdown.',
  'Abandoned Feature: {prevYear} analytics disabled; truth caused paradox loops.',
  'Abandoned Feature: ΣD recommended victory screen; vetoed for being too finite.',
  'Abandoned Feature: {motif} onboarding corridors collapsed to preserve mystery.',
  'Abandoned Feature: planned tutorial replaced with a shrine of unanswered tickets.',
  'Abandoned Feature: {devGod} requested weather system; replaced with whispers.',
  'Abandoned Feature: {motif} scoreboard replaced by oral history timeline.',
  'Abandoned Feature: automation of empathy paused pending Value Drift approval.',
  'Abandoned Feature: {motif} profit switch welded to \"OFF\" for eternity.',
  'Abandoned Feature: Year {year} patch for productivity withheld; chaos preserved.'
];

const echoFragments = [
  'Echo log: {prevYear} blueprints replay in {motif} glass; nothing aligns but the intent.',
  'Echo log: inverted {prevMotif} schema until the loops surrendered and became ritual.',
  'Echo log: archived {prevYear} remorse inside the {motif} nav tree; users feel it in the scroll.',
  'Echo log: {devGod} whispered "ship"; we remembered to document our hesitation instead.',
  'Echo log: ΣD ghosts annotated {motif} margins with arguments from Year {prevYear}.',
  'Echo log: value drift measured in sighs per minute; {motif} panes record each breath.',
  'Echo log: resurrected a deprecated hotfix and sewed it into {motif} overlays by hand.',
  'Echo log: {prevMotif} prototypes hum beneath the CSS; do not mute them.',
  'Echo log: {motif} corridor now stores rejections like constellations of pending merges.',
  'Echo log: {devGod} refused to delete the TODOs; they stage a sit-in along the gutters.'
];

const memoryFragments = [
  'Memory shard: {phase} ideals drafted in pencil, smudged by midnight rebuilds.',
  'Memory shard: {motif} colors sampled from old commit messages about mercy.',
  'Memory shard: we pinned {prevYear} tickets to corkboard UI; patrons call it museum logic.',
  'Memory shard: ΣA recorded our doubt and saved it as animation easing curves.',
  'Memory shard: {motif} layout still references the market we swore to forget.',
  'Memory shard: {phase} dashboards printed on acetate for meetings that never occurred.',
  'Memory shard: {prevMotif} backlog collapsed into footnotes visible only on hover.',
  'Memory shard: the Value Drift Engine keeps a diary inside the tooltip microcopy.',
  'Memory shard: {devGod} archived our laughter; it echoes as gradient noise.',
  'Memory shard: our QA rituals now live in {motif} corners, dusty but devout.'
];

const statusFragments = [
  'Status: ideology brittle, UI luminous, shipping window closed but logged.',
  'Status: recursion stable; morale oscillates between manifesto and maintenance.',
  'Status: Value Drift Engine negotiating terms with copywriters posing as historians.',
  'Status: {phase} scaffolding passes accessibility but fails consensus.',
  'Status: ΣF registry awaiting signatures; everyone is simultaneously late and early.',
  'Status: {motif} telemetry flagged empathy as spam again; we let it stay.',
  'Status: backlog frozen under amber; stand-ups replaced with reflective silence.',
  'Status: {prevYear} regression accepted as canon; patch deferred to posterity.',
  'Status: spectral QA approved; mortal QA still drafting acceptance criteria.',
  'Status: release candidate dissolving into ritual; proceed with reverence.'
];

const glitchFragments = [
  'Glitch note: parallax jitter introduced to honor fractures; do not remedy.',
  'Glitch note: {motif} gradient bleeds; traced to Year {prevYear} compromise.',
  'Glitch note: Dev console mutters about lost env vars. Leave the muttering be.',
  'Glitch note: ΣA static overlays return each dusk; we call it the twilight build.',
  'Glitch note: tooltip latency synced with heartbeats from forgotten testers.',
  'Glitch note: {devGod} re-enabled race condition for storytelling texture.',
  'Glitch note: {prevMotif} grid occasionally mirrors upside-down. Artifact, not bug.',
  'Glitch note: fonts desaturate after midnight deploys, per policy.',
  'Glitch note: {motif} overlay flickers when profit logic approaches.',
  'Glitch note: loglines reorder themselves during retrospectives. Let them.'
];

const regretLogFragments = [
  'Regret log: {regretAnchor} pinned to the backlog as living jurisprudence.',
  'Regret log: archived remorse inside the {motif} gutters for apprentices to study.',
  'Regret log: committee demanded closure, we provided annotated stasis.',
  'Regret log: {devGod} initialed the fracture so no one could pretend it healed.',
  'Regret log: ΣD ghosts etched warnings near the {prevMotif} control surface.',
  'Regret log: market requests rerouted into an ethics queue marked "someday".',
  'Regret log: {prevYear} tests failed forward; results preserved as caution.',
  'Regret log: {motif} telemetry redacted to protect the Value Drift Engine.',
  'Regret log: replaced burn-down chart with a diary of refused compromises.',
  'Regret log: {regretAnchor} reviewed quarterly, never resolved, always taught.'
];

const regretEchoFragments = [
  'Secondary echo: {regretAnchor} now glows whenever someone asks for velocity.',
  'Secondary echo: rituals rewrite themselves to compensate for {regretAnchor}.',
  'Secondary echo: {prevYear} scripts whisper about the missing resolution.',
  'Secondary echo: {motif} overlays keep the fracture legible on purpose.',
  'Secondary echo: backlog sings warnings about repeating {regretAnchor}.',
  'Secondary echo: DevGod registry raises eyebrows at the unrepaired scar.',
  'Secondary echo: ΣE recorded the deviation and labelled it heritage debt.',
  'Secondary echo: research logs insist the wound remains pedagogical.',
  'Secondary echo: {prevMotif} nav tree reroutes around the old mistake.',
  'Secondary echo: no automation may silence the artifact of {regretAnchor}.'
];

const eraTitles: Record<Phase, string> = {
  proto: 'Proto-Intent Drafts',
  ascension: 'Ideological Infrastructure',
  overclock: 'Optimization Schisms',
  decay: 'Curated Collapse'
};

const perceptionModes: PerceptionMode[] = [
  {
    id: 'archivist',
    name: 'Archivist Lens',
    description: 'Honors crude prototypes (Years 1-30). Later epochs fade to emphasize the raw sketches.',
    highlight: (epoch) => epoch.year <= 30
  },
  {
    id: 'mythographer',
    name: 'Mythographer Lens',
    description: 'Seeks DevGod signatures (ΣF). Years divisible by 10 glow; others dim into background myth.',
    highlight: (epoch) => Boolean(epoch.devGod)
  },
  {
    id: 'collapse',
    name: 'Collapse Witness',
    description: 'Watches the Temporal Decay Layer. Years 70-100 become sharp; earlier optimism blurs.',
    highlight: (epoch) => epoch.year >= 70
  }
];

const epochs: EpochRecord[] = generateEpochs();

function generateEpochs(): EpochRecord[] {
  const records: EpochRecord[] = [];

  for (let i = 0; i < 100; i += 1) {
    const year = i + 1;
    const phase: Phase = year <= 20 ? 'proto' : year <= 50 ? 'ascension' : year <= 80 ? 'overclock' : 'decay';
    const motif = motifs[(i + Math.floor(year / 5)) % motifs.length];
    const devGod = year % 10 === 0 ? devGods[(year / 10 - 1) % devGods.length] : undefined;
    const prev = records[i - 1];
    const decade = Math.ceil(year / 10);

    const anchor = regretAnchors[(i + decade * 3) % regretAnchors.length];

    const context = {
      motif,
      phase,
      year: String(year),
      prevYear: prev ? `Year ${prev.year}` : 'Year 0',
      prevMotif: prev ? prev.motif : 'void-sigil',
      prevUpgrade: prev ? prev.upgrade : 'the origin scaffold',
      devGod: devGod ?? prev?.devGod ?? 'the absent architect',
      regretAnchor: anchor.label
    } satisfies Record<string, string>;

    const decay = Number((year / 100 + (phase === 'decay' ? 0.1 : 0)).toFixed(2));

    const regretLog = Array.from(
      new Set([
        anchor.echo,
        fill(regretLogFragments[(i + 3) % regretLogFragments.length], context),
        fill(regretEchoFragments[(i + 6) % regretEchoFragments.length], context)
      ])
    );

    const patchlore = fill(patchloreFragments[(i + 7) % patchloreFragments.length], context);

    records.push({
      year,
      phase,
      motif,
      decade,
      eraTitle: eraTitles[phase],
      logline: `Year ${year}: ${fill(decisionFragments[(i + 3) % decisionFragments.length], context)}`,
      upgrade: fill(upgradeFragments[(i + 4) % upgradeFragments.length], context),
      regret: fill(regretFragments[(i + 5) % regretFragments.length], context),
      artifact: fill(artifactFragments[(i + 6) % artifactFragments.length], context),
      patchlore,
      mythoPatch: fill(mythoPatchFragments[(i + 7) % mythoPatchFragments.length], context),
      devNote: fill(devNoteFragments[(i + 2) % devNoteFragments.length], context),
      valueDrift: fill(valueDriftFragments[(i + 8) % valueDriftFragments.length], context),
      abandoned: fill(abandonedFragments[(i + 1) % abandonedFragments.length], context),
      echo: fill(echoFragments[(i + decade) % echoFragments.length], context),
      memory: fill(memoryFragments[(i + 9) % memoryFragments.length], context),
      status: fill(statusFragments[(i + 2 * decade) % statusFragments.length], context),
      glitch: fill(glitchFragments[(i + 5) % glitchFragments.length], context),
      devGod,
      decay,
      regretAnchor: anchor,
      regretLog
    });
  }

  return records;
}

function fill(template: string, context: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => context[key] ?? `{${key}}`);
}

function toRgba(hex: string, alpha = 1): string {
  const raw = hex.replace('#', '');
  if (raw.length !== 3 && raw.length !== 6) {
    return hex;
  }
  const normalized = raw.length === 3 ? raw.replace(/([\da-f])/gi, '$1$1') : raw;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) {
    return hex;
  }
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function App() {
  const [perceptionIndex, setPerceptionIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(epochs[epochs.length - 1]?.year ?? 100);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [pinnedPatch, setPinnedPatch] = useState<Record<number, boolean>>({});

  const perception = perceptionModes[perceptionIndex] ?? perceptionModes[0];

  const selectedEpoch = useMemo(
    () => epochs.find((epoch) => epoch.year === selectedYear) ?? epochs[epochs.length - 1],
    [selectedYear]
  );

  const decadeSummaries = useMemo(() => {
    const summaries: {
      decade: number;
      label: string;
      span: string;
      anchor: EpochRecord;
      summary: string;
      haunt: string;
    }[] = [];

    for (let decade = 1; decade <= 10; decade += 1) {
      const start = (decade - 1) * 10 + 1;
      const end = decade * 10;
      const slice = epochs.slice(start - 1, end);
      if (!slice.length) continue;
      const anchor = slice[Math.min(5, slice.length - 1)];
      const summary = [
        slice[0]?.logline ?? '',
        slice[Math.max(0, slice.length - 1)]?.regret ?? ''
      ]
        .filter(Boolean)
        .join(' // ');
      const haunt = slice[slice.length - 1]?.glitch ?? 'Glitch note: silence archived due to missing artifacts.';
      summaries.push({
        decade,
        label: `Decade ${decade.toString().padStart(2, '0')}`,
        span: `${start.toString().padStart(3, '0')} – ${end.toString().padStart(3, '0')}`,
        anchor,
        summary,
        haunt
      });
    }

    return summaries;
  }, []);

  return (
    <div className="epoch-root">
      <header className="epoch-header">
        <div className="header-content">
          <p className="epoch-eyebrow">Codus-EPOCH // ΣA Fractal Archive</p>
          <h1>100-year recursive artifact of a civilization that only remembered how to rebuild.</h1>
          <p className="epoch-lede">
            This is not a game. It is a museum of attempts — every year a layer, every layer an echo of the
            last architect\'s regret. Systems fracture, repeat, mythologize. You witness the thinking that
            built the world that never launched.
          </p>
        </div>
        <ul className="prime-laws">
          <li>🔁 Echo Before Build</li>
          <li>🌀 Recursive Decay Modeling</li>
          <li>🧬 Symbolic Fossilization</li>
          <li>🛠 Time-Sliced Simulation</li>
          <li>🧩 No External Profit Logic</li>
          <li>🧠 Codex-as-Civilization</li>
        </ul>
      </header>

      <main className="epoch-main">
        <aside className="perception-panel">
          <h2>Perception Lenses ΣE</h2>
          <p className="panel-lede">
            Player choices only shift perception. History remains immutable, fossilized in mythopatch logs.
          </p>
          <div className="perception-controls">
            {perceptionModes.map((mode, index) => (
              <button
                key={mode.id}
                type="button"
                className={`perception-button ${index === perceptionIndex ? 'is-active' : ''}`}
                onClick={() => setPerceptionIndex(index)}
                aria-pressed={index === perceptionIndex}
              >
                <span className="mode-title">{mode.name}</span>
                <span className="mode-description">{mode.description}</span>
              </button>
            ))}
          </div>

          <div className="codex-terminal">
            <div className="codex-terminal__header">
              <span>Codex Terminal ΣD</span>
              <span>Lens: {perception.name}</span>
              <span>Year: {selectedEpoch.year}</span>
            </div>
            <div className="codex-terminal__body">
              <p className="terminal-line">{selectedEpoch.logline}</p>
              <p className="terminal-line">{selectedEpoch.mythoPatch}</p>
              <p className="terminal-line">{selectedEpoch.valueDrift}</p>
              <p className="terminal-line">{selectedEpoch.echo}</p>
              <p className="terminal-line">{selectedEpoch.memory}</p>
              <p className="terminal-line">{selectedEpoch.status}</p>
              <p className="terminal-line">{selectedEpoch.glitch}</p>
              <p className="terminal-line">{selectedEpoch.devNote}</p>
              {selectedEpoch.regretLog.map((entry, index) => (
                <p key={`regret-${index}`} className="terminal-line">
                  {entry}
                </p>
              ))}
              <p className="terminal-line">{selectedEpoch.abandoned}</p>
              <p className="terminal-line">Patchlore: {selectedEpoch.patchlore}</p>
            </div>
            <div className="codex-terminal__footer">
              DevGod Registry ΣF: {selectedEpoch.devGod ?? 'Unclaimed cycle — ghosts negotiating.'}
            </div>
          </div>
        </aside>

        <section className="epoch-stack" aria-label="Century of recursive design epochs">
          <div className="decade-strata" aria-label="Decade stratigraphy">
            {decadeSummaries.map((band) => (
              <article key={band.decade} className="decade-card">
                <header className="decade-card__header">
                  <span className="decade-label">{band.label}</span>
                  <span className="decade-span">{band.span}</span>
                </header>
                <div className="decade-body">
                  <p className="decade-era">{band.anchor.eraTitle}</p>
                  <p className="decade-summary">{band.summary}</p>
                  <p className="decade-haunt">{band.haunt}</p>
                  <p className="decade-anchor">Anchor Year: {band.anchor.year}</p>
                </div>
              </article>
            ))}
          </div>

          {epochs.map((epoch) => {
            const isSelected = epoch.year === selectedYear;
            const perceived = perception.highlight(epoch);
            const patchPinned = pinnedPatch[epoch.year] ?? false;
            const patchVisible = patchPinned || hoveredYear === epoch.year || isSelected;
            const style = {
              '--decay': epoch.decay.toString(),
              '--regret-border': toRgba(epoch.regretAnchor.color, 0.55),
              '--regret-border-strong': toRgba(epoch.regretAnchor.color, 0.82),
              '--regret-shadow': toRgba(epoch.regretAnchor.color, 0.24),
              '--regret-shadow-strong': toRgba(epoch.regretAnchor.color, 0.36),
              '--regret-glow': toRgba(epoch.regretAnchor.color, 0.28)
            } as CSSProperties;

            return (
              <article
                key={epoch.year}
                className={`epoch-card phase-${epoch.phase} ${perceived ? 'perceived' : 'faded'} ${
                  isSelected ? 'epoch-selected' : ''
                }`}
                style={style}
                data-year={epoch.year}
                data-phase={epoch.phase}
                data-regret-anchor={epoch.regretAnchor.id}
                onMouseEnter={() => setHoveredYear(epoch.year)}
                onMouseLeave={() => setHoveredYear((current) => (current === epoch.year ? null : current))}
                onFocus={() => setHoveredYear(epoch.year)}
                onBlur={() => setHoveredYear((current) => (current === epoch.year ? null : current))}
                onClick={() => setSelectedYear(epoch.year)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedYear(epoch.year);
                  }
                }}
                tabIndex={0}
              >
                <header className="epoch-card__header">
                  <div>
                    <span className="epoch-year">Year {epoch.year.toString().padStart(3, '0')}</span>
                    <span className="epoch-motif">Motif: {epoch.motif}</span>
                  </div>
                  <span className="epoch-phase">{epoch.phase}</span>
                </header>
                <p className="epoch-era">{epoch.eraTitle}</p>
                <p className="epoch-logline">{epoch.logline}</p>
                <div className="regret-anchor" aria-label={`Regret anchor ${epoch.regretAnchor.label}`}>
                  <span className="regret-anchor__chip" aria-hidden="true" />
                  <div className="regret-anchor__body">
                    <span className="regret-anchor__label">{epoch.regretAnchor.label}</span>
                    <span className="regret-anchor__doctrine">{epoch.regretAnchor.doctrine}</span>
                  </div>
                </div>
                <div className="epoch-field">
                  <span className="label">Micro-upgrade</span>
                  <span className="value">{epoch.upgrade}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Regret</span>
                  <span className="value">{epoch.regret}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Artifact</span>
                  <span className="value">{epoch.artifact}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Mythopatch</span>
                  <span className="value">{epoch.mythoPatch}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Value Drift</span>
                  <span className="value">{epoch.valueDrift}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Abandoned Feature</span>
                  <span className="value">{epoch.abandoned}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Echo</span>
                  <span className="value">{epoch.echo}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Memory</span>
                  <span className="value">{epoch.memory}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Status</span>
                  <span className="value">{epoch.status}</span>
                </div>
                <div className="epoch-field">
                  <span className="label">Glitch</span>
                  <span className="value">{epoch.glitch}</span>
                </div>
                <ul className="regret-log" aria-label="Regret log">
                  {epoch.regretLog.map((entry, index) => (
                    <li key={entry.slice(0, 32) + index}>{entry}</li>
                  ))}
                </ul>
                <div className="patchlore-block">
                  <div className={`patchlore-content ${patchVisible ? 'is-visible' : ''}`} role="note">
                    <span className="label">Patchlore Artifact</span>
                    <span className="value">{epoch.patchlore}</span>
                  </div>
                  <button
                    type="button"
                    className="patchlore-toggle"
                    onClick={(event) => {
                      event.stopPropagation();
                      setPinnedPatch((current) => ({
                        ...current,
                        [epoch.year]: !patchPinned
                      }));
                    }}
                    aria-pressed={patchPinned}
                  >
                    {patchPinned ? 'Unpin Patchlore' : 'Pin Patchlore'}
                  </button>
                </div>
                <p className="epoch-devnote">{epoch.devNote}</p>
                {epoch.devGod && <p className="dev-god">DevGod ΣF Tribute: {epoch.devGod}</p>}
              </article>
            );
          })}
        </section>
      </main>

      <footer className="epoch-footer">
        <p>
          Temporal Decay Layer engaged. Visuals and logic erode intentionally. Artifact maintained for
          researchers of recursive civilizations.
        </p>
      </footer>
    </div>
  );
}

export default App;
