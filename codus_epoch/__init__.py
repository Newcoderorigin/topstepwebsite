"""Codus-EPOCH recursive simulation toolkit."""
from .epochs import Epoch, EpochStack, generate_epoch_stack


def launch(seed: int = 2084) -> None:
    """Lazy entry-point to avoid pygame import side-effects during tests."""

    from .pygame_app import launch as _launch

    _launch(seed=seed)


__all__ = ["Epoch", "EpochStack", "generate_epoch_stack", "launch"]
