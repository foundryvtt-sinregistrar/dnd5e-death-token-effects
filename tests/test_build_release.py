from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class BuildReleaseTests(unittest.TestCase):
    def test_release_has_required_assets_and_valid_checksums(self) -> None:
        dist = Path(tempfile.mkdtemp(prefix="death-token-effects-release-"))
        self.addCleanup(shutil.rmtree, dist, True)
        subprocess.run(
            ["python", "-B", "dev-tools/buildScripts/build_release.py", "--dist", str(dist), "--allow-dirty"],
            cwd=ROOT,
            check=True,
        )
        manifest = json.loads((dist / "module.json").read_text(encoding="utf-8"))
        module_id, version = manifest["id"], manifest["version"]
        archive = dist / f"{module_id}-{version}.zip"
        alias = dist / f"{module_id}.zip"
        self.assertTrue(alias.is_file())
        self.assertTrue(archive.is_file())
        with zipfile.ZipFile(archive) as package:
            names = set(package.namelist())
        self.assertIn(f"{module_id}/module.json", names)
        self.assertIn(f"{module_id}/scripts/dnd5e-death-token-effects.js", names)
        self.assertNotIn(f"{module_id}/APPLY.md", names)
        checksums = {
            name: digest
            for digest, name in (line.split("  ", 1) for line in (dist / "SHA256SUMS.txt").read_text(encoding="utf-8").splitlines())
        }
        self.assertEqual(checksums[archive.name], hashlib.sha256(archive.read_bytes()).hexdigest())
        self.assertEqual(checksums[alias.name], hashlib.sha256(alias.read_bytes()).hexdigest())


if __name__ == "__main__":
    unittest.main()
