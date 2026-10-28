#!/usr/bin/env python3
"""Extract the current module version's section from CHANGELOG.md for a release."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def release_section(changelog: str, version: str) -> str:
    heading = re.compile(rf"^## \[{re.escape(version)}\].*$", re.MULTILINE)
    match = heading.search(changelog)
    if not match:
        raise ValueError(f"CHANGELOG.md does not contain a section for version {version}.")
    following = re.compile(r"^## \[", re.MULTILINE).search(changelog, match.end())
    section = changelog[match.end() : following.start() if following else len(changelog)].strip()
    if not section:
        raise ValueError(f"CHANGELOG.md section for version {version} is empty.")
    return section


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=ROOT / "module.json")
    parser.add_argument("--changelog", type=Path, default=ROOT / "CHANGELOG.md")
    parser.add_argument("--output", type=Path, default=ROOT / "dist" / "release-notes.md")
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    version = str(manifest["version"])
    section = release_section(args.changelog.read_text(encoding="utf-8"), version)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(f"## Changes\n\n{section}\n", encoding="utf-8")
    print(f"OK: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
