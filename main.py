"""Convenience launcher for the TopstepX Command Center services."""
from __future__ import annotations

import argparse
import os
import signal
import subprocess
import sys
import time
from pathlib import Path
from typing import Iterable, List

PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Launch backend, frontend, or both services."
    )
    parser.add_argument(
        "target",
        choices=("all", "backend", "frontend"),
        default="all",
        nargs="?",
        help="Service target to launch (default: all).",
    )
    return parser


def ensure_directories_exist() -> None:
    for path in (BACKEND_DIR, FRONTEND_DIR):
        if not path.exists():
            raise FileNotFoundError(f"Expected directory missing: {path}")


def run_process(command: Iterable[str], cwd: Path) -> subprocess.Popen:
    env = os.environ.copy()
    return subprocess.Popen(command, cwd=str(cwd), env=env)


def launch_services(target: str) -> List[subprocess.Popen]:
    ensure_directories_exist()

    processes: List[subprocess.Popen] = []
    if target in {"all", "backend"}:
        processes.append(run_process(["npm", "run", "dev"], BACKEND_DIR))
    if target in {"all", "frontend"}:
        processes.append(run_process(["npm", "run", "dev"], FRONTEND_DIR))
    return processes


def terminate_processes(processes: Iterable[subprocess.Popen]) -> None:
    for proc in processes:
        if proc.poll() is None:
            try:
                proc.send_signal(signal.SIGINT)
            except (ProcessLookupError, ValueError):
                proc.terminate()
    for proc in processes:
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()


def main(argv: Iterable[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(list(argv) if argv is not None else None)

    processes = launch_services(args.target)
    if not processes:
        parser.error("No processes launched")
    try:
        while True:
            for proc in processes:
                code = proc.poll()
                if code is not None:
                    terminate_processes(processes)
                    return code
            time.sleep(0.5)
    except KeyboardInterrupt:
        terminate_processes(processes)
        return 0


if __name__ == "__main__":
    sys.exit(main())
