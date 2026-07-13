"""Export the canonical lab snapshot for the Next.js demo."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "apps" / "api"))

from app.services.demo import build_demo_snapshot  # noqa: E402


def main() -> None:
    snap = build_demo_snapshot().model_dump(mode="json")
    targets = [
        ROOT / "data" / "demo" / "tower_snapshot.json",
        ROOT / "apps" / "web" / "src" / "data" / "tower_snapshot.json",
    ]
    for path in targets:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(snap, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {path}")


if __name__ == "__main__":
    main()
