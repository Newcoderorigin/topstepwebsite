"""Pygame front-end for the Codus-EPOCH recursive simulation."""
from __future__ import annotations

import math
from dataclasses import dataclass
from typing import List, Tuple

import pygame

from .epochs import Epoch, EpochStack, generate_epoch_stack

WIDTH, HEIGHT = 1280, 720
MARGIN = 60
TIMELINE_X = 180
LINE_HEIGHT = 72
CARD_WIDTH = WIDTH - TIMELINE_X - MARGIN
HEADER_HEIGHT = 140
BACKGROUND_COLORS = [(15, 9, 21), (32, 24, 46), (12, 20, 28)]


@dataclass
class Palette:
    base: Tuple[int, int, int]
    accent: Tuple[int, int, int]
    faded: Tuple[int, int, int]
    text_primary: Tuple[int, int, int]
    text_secondary: Tuple[int, int, int]
    glyph: Tuple[int, int, int]


PALETTE = Palette(
    base=(24, 16, 36),
    accent=(178, 102, 255),
    faded=(72, 66, 94),
    text_primary=(235, 228, 255),
    text_secondary=(168, 164, 198),
    glyph=(255, 216, 102),
)


class EpochViewer:
    """Renders the 100-year stack with scrollable recursion."""

    def __init__(self, stack: EpochStack) -> None:
        pygame.init()
        pygame.display.set_caption("Codus-EPOCH // Recursive Memory Stack")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        self.clock = pygame.time.Clock()
        self.stack = stack
        self.offset = 0.0
        self.target_offset = 0.0
        self.scroll_speed = 0.0
        self.font_large = pygame.font.SysFont("IBM Plex Mono", 26)
        self.font_medium = pygame.font.SysFont("IBM Plex Mono", 20)
        self.font_small = pygame.font.SysFont("IBM Plex Mono", 16)
        self.font_glitch = pygame.font.SysFont("IBM Plex Mono", 14)
        self.glitch_seed = 0.0

    def run(self) -> None:
        running = True
        while running:
            dt = self.clock.tick(60) / 1000.0
            self._handle_events()
            self._update(dt)
            self._draw()
            pygame.display.flip()

            if not pygame.display.get_active():
                # Pause ghost animations when window inactive but keep history accessible.
                self.clock.tick(10)

    def _handle_events(self) -> None:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                raise SystemExit
            if event.type == pygame.KEYDOWN:
                if event.key in (pygame.K_ESCAPE, pygame.K_q):
                    pygame.quit()
                    raise SystemExit
                if event.key == pygame.K_UP:
                    self.target_offset -= LINE_HEIGHT
                if event.key == pygame.K_DOWN:
                    self.target_offset += LINE_HEIGHT
                if event.key == pygame.K_PAGEUP:
                    self.target_offset -= LINE_HEIGHT * 5
                if event.key == pygame.K_PAGEDOWN:
                    self.target_offset += LINE_HEIGHT * 5
                if event.key == pygame.K_HOME:
                    self.target_offset = 0
                if event.key == pygame.K_END:
                    self.target_offset = len(self.stack.epochs) * LINE_HEIGHT
            if event.type == pygame.MOUSEWHEEL:
                self.target_offset -= event.y * (LINE_HEIGHT / 2)

    def _update(self, dt: float) -> None:
        self.offset += (self.target_offset - self.offset) * min(12 * dt, 1)
        self.offset = max(0, min(self.offset, len(self.stack.epochs) * LINE_HEIGHT))
        self.glitch_seed += dt * 0.35

    def _draw(self) -> None:
        self._draw_background()
        self._draw_header()
        self._draw_timeline()
        self._draw_cards()
        self._draw_reflection_strip()
        self._draw_footer()

    def _draw_background(self) -> None:
        for idx, color in enumerate(BACKGROUND_COLORS):
            rect = pygame.Rect(0, HEIGHT // len(BACKGROUND_COLORS) * idx, WIDTH, HEIGHT // len(BACKGROUND_COLORS) + 1)
            pygame.draw.rect(self.screen, color, rect)
        # overlay faint noise stripes to hint at decay
        for i in range(0, WIDTH, 24):
            shade = (12 + (i * 3) % 24, 12, 18)
            pygame.draw.line(self.screen, shade, (i, 0), (i, HEIGHT), 1)

    def _draw_header(self) -> None:
        title = "CODUS-EPOCH: 100 YEARS OF UNFINISHED MEMORY"
        subtitle = "Arrow keys / mouse wheel to navigate. Mythopatch & decay bands annotate ideological drift."
        subtitle = "Arrow keys / mouse wheel to navigate. Mythopatch logs preserve ideological drift."
        overlay = pygame.Surface((WIDTH, HEADER_HEIGHT), pygame.SRCALPHA)
        overlay.fill((10, 8, 16, 210))
        self.screen.blit(overlay, (0, 0))

        self.screen.blit(self.font_large.render(title, True, PALETTE.text_primary), (MARGIN, 32))
        self.screen.blit(self.font_small.render(subtitle, True, PALETTE.text_secondary), (MARGIN, 72))

        prime_laws = "ΣA decay // ΣB mythopatch // ΣC ideology UI // ΣD ghosts // ΣE value drift // ΣF devgods"
        self.screen.blit(self.font_small.render(prime_laws, True, PALETTE.glyph), (MARGIN, 100))

    def _draw_timeline(self) -> None:
        pygame.draw.line(
            self.screen,
            PALETTE.faded,
            (TIMELINE_X, HEADER_HEIGHT),
            (TIMELINE_X, HEIGHT - MARGIN),
            3,
        )

        decade_gap = LINE_HEIGHT * 10
        for decade in range(0, 10):
            y = HEADER_HEIGHT + decade * decade_gap - self.offset
            dev_god = self.stack.epochs[decade * 10].dev_god
            label_surface = self.font_small.render(
                f"Decade {decade}: {dev_god}",
                True,
                PALETTE.text_secondary,
            )
            self.screen.blit(label_surface, (MARGIN, y + 8))
            pygame.draw.circle(
                self.screen,
                PALETTE.glyph,
                (TIMELINE_X, int(y + decade_gap / 2)),
                6,
            )

    def _draw_cards(self) -> None:
        start_y = HEADER_HEIGHT + 20
        for idx, epoch in enumerate(self.stack.epochs):
            card_y = start_y + idx * LINE_HEIGHT - self.offset
            if card_y < HEADER_HEIGHT - LINE_HEIGHT or card_y > HEIGHT:
                continue
            decay = idx / max(len(self.stack.epochs) - 1, 1)
            self._draw_epoch_card(epoch, card_y, decay)

    def _draw_epoch_card(self, epoch: Epoch, y: float, decay: float) -> None:
        card_height = LINE_HEIGHT - 8
        decay_color = self._interpolate_color(PALETTE.accent, PALETTE.faded, decay)
        card_rect = pygame.Rect(TIMELINE_X + 20, y, CARD_WIDTH - 40, card_height)

        overlay = pygame.Surface((card_rect.width, card_rect.height), pygame.SRCALPHA)
        overlay.fill((int(40 + 120 * (1 - decay)), int(20 + 60 * (1 - decay)), int(60 + 120 * (1 - decay)), 165))
        self.screen.blit(overlay, card_rect.topleft)

        pygame.draw.rect(self.screen, decay_color, card_rect, 2)
        glitch_amplitude = math.sin(self.glitch_seed + epoch.year * 0.33) * 4
        pygame.draw.rect(
            self.screen,
            (decay_color[0], max(0, decay_color[1] - 60), decay_color[2]),
            card_rect.inflate(glitch_amplitude, glitch_amplitude / 2),
            1,
        )

        text_x = card_rect.x + 16
        title = f"{epoch.label} // {epoch.status.upper()}"
        self.screen.blit(self.font_medium.render(title, True, PALETTE.text_primary), (text_x, y + 6))

        logline_lines = self._wrap_text(epoch.logline, self.font_small, card_rect.width - 32)
        for i, line in enumerate(logline_lines[:2]):
            self.screen.blit(self.font_small.render(line, True, PALETTE.text_secondary), (text_x, y + 32 + i * 18))

        glitch_lines = self._wrap_text(epoch.glitch_trace, self.font_glitch, card_rect.width - 32)
        if glitch_lines:
            glitch_color = self._fade_color(PALETTE.glyph, min(1.0, decay + 0.2))
            self.screen.blit(self.font_glitch.render(glitch_lines[0], True, glitch_color), (text_x, y + card_height - 46))

        if epoch.patch_lore:
            myth = self.font_small.render(epoch.patch_lore[0], True, PALETTE.glyph)
            self.screen.blit(myth, (text_x, y + card_height - 28))
        if len(epoch.patch_lore) > 1:
            myth_echo = self.font_small.render(epoch.patch_lore[1], True, self._fade_color(PALETTE.glyph, 0.6))
            self.screen.blit(myth_echo, (text_x, y + card_height - 14))
        myth = self.font_small.render(epoch.mythopatch, True, PALETTE.glyph)
        self.screen.blit(myth, (text_x, y + card_height - 22))

        # decorative artifacts as runes along the edge
        glyph_y = y + 10
        for shard in epoch.artifacts:
            rune = shard.split(" ")[0][:6].upper()
            glyph_surface = self.font_small.render(rune, True, self._fade_color(PALETTE.glyph, decay))
            self.screen.blit(glyph_surface, (card_rect.right - 80, glyph_y))
            glyph_y += 16

        if epoch.glitch_banner:
            banner_surface = self.font_small.render(epoch.glitch_banner.banner, True, PALETTE.text_primary)
            banner_rect = banner_surface.get_rect()
            banner_rect.topright = (card_rect.right - 8, y - 18)
            self.screen.blit(banner_surface, banner_rect)
            glyph_surface = self.font_small.render(epoch.glitch_banner.glyphs, True, self._fade_color(PALETTE.accent, 0.3))
            glyph_rect = glyph_surface.get_rect()
            glyph_rect.topright = (card_rect.right - 8, y - 36)
            self.screen.blit(glyph_surface, glyph_rect)
            if epoch.regret_log:
                regret_text = self.font_glitch.render(epoch.regret_log[0], True, self._fade_color(PALETTE.text_secondary, decay))
                self.screen.blit(regret_text, (text_x, y + card_height - 62))

    def _draw_reflection_strip(self) -> None:
        strip_height = 90
        strip_rect = pygame.Rect(0, HEIGHT - strip_height, WIDTH, strip_height)
        overlay = pygame.Surface(strip_rect.size, pygame.SRCALPHA)
        overlay.fill((10, 6, 14, 230))
        self.screen.blit(overlay, strip_rect.topleft)

        index = int((self.offset / LINE_HEIGHT) % len(self.stack.reflections))
        reflection = self.stack.reflections[index]
        echo = self.stack.echoes[index]
        decay = self.stack.decay_logs[index]
        self.screen.blit(self.font_small.render(reflection, True, PALETTE.text_primary), (MARGIN, HEIGHT - strip_height + 16))
        self.screen.blit(self.font_small.render(echo, True, PALETTE.text_secondary), (MARGIN, HEIGHT - strip_height + 44))
        self.screen.blit(self.font_small.render(decay, True, self._fade_color(PALETTE.glyph, 0.3)), (MARGIN, HEIGHT - strip_height + 60))

        hint = "Hold Q or ESC to exit. HOME/END to jump across the century."
        self.screen.blit(self.font_small.render(hint, True, PALETTE.faded), (MARGIN, HEIGHT - strip_height + 76))
        self.screen.blit(self.font_small.render(reflection, True, PALETTE.text_primary), (MARGIN, HEIGHT - strip_height + 16))
        self.screen.blit(self.font_small.render(echo, True, PALETTE.text_secondary), (MARGIN, HEIGHT - strip_height + 44))

        hint = "Hold Q or ESC to exit. HOME/END to jump across the century."
        self.screen.blit(self.font_small.render(hint, True, PALETTE.faded), (MARGIN, HEIGHT - strip_height + 68))

    def _draw_footer(self) -> None:
        glitch = math.sin(self.glitch_seed * 2.1)
        width = int(WIDTH * (0.6 + 0.2 * glitch))
        pygame.draw.line(
            self.screen,
            self._fade_color(PALETTE.accent, 0.5 + 0.5 * (glitch % 1)),
            (WIDTH - width - MARGIN, HEIGHT - MARGIN // 2),
            (WIDTH - MARGIN, HEIGHT - MARGIN // 2),
            2,
        )

    def _wrap_text(self, text: str, font: pygame.font.Font, max_width: int) -> List[str]:
        words = text.split()
        lines: List[str] = []
        current = ""
        for word in words:
            test = f"{current} {word}".strip()
            if font.size(test)[0] <= max_width:
                current = test
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        return lines

    def _interpolate_color(self, a: Tuple[int, int, int], b: Tuple[int, int, int], t: float) -> Tuple[int, int, int]:
        return (
            int(a[0] + (b[0] - a[0]) * t),
            int(a[1] + (b[1] - a[1]) * t),
            int(a[2] + (b[2] - a[2]) * t),
        )

    def _fade_color(self, color: Tuple[int, int, int], decay: float) -> Tuple[int, int, int]:
        return tuple(int(component * (1 - 0.6 * decay)) for component in color)


def launch(seed: int = 2084) -> None:
    """Entry-point to launch the pygame simulation."""
    stack = generate_epoch_stack(seed=seed)
    viewer = EpochViewer(stack)
    viewer.run()
