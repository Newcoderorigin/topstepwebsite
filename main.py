"""Launcher for the Codus-EPOCH pygame memory simulation."""

from __future__ import annotations

import argparse
from typing import Iterable

from codus_epoch import launch


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Run the Codus-EPOCH recursive simulation."
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=2084,
        help="Seed controlling the mythological randomization of epochs.",
    )
    return parser


def main(argv: Iterable[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(list(argv) if argv is not None else None)
    launch(seed=args.seed)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
