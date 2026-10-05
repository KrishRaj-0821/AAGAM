import subprocess
import re
import os
import json

PATTERNS = {
    "Fast2SMS API Key": re.compile(r'(?i)(fast2sms[_-]?api[_-]?key|fast2sms)\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,64})["\']?'),
    "Generic Fast2SMS Key": re.compile(r'(?i)authorization["\']?\s*:\s*["\']?([a-zA-Z0-9]{30,64})["\']?'),
    "Django Secret Key": re.compile(r'(?i)SECRET_KEY\s*=\s*["\']([^"\']{20,})["\']'),
    "JWT Secret Key": re.compile(r'(?i)(SIGNING_KEY|JWT_SECRET)\s*=\s*["\']([^"\']{15,})["\']'),
    "Private Key": re.compile(r'-----BEGIN [A-Z ]*PRIVATE KEY-----'),
    "AWS Access Key": re.compile(r'(?i)(AKIA|ABIA|ACCA)[0-9A-Z]{16}'),
    "Generic API Token": re.compile(r'(?i)(api[_-]?key|access[_-]?token|bearer[_-]?token)\s*[:=]\s*["\']([a-zA-Z0-9_\-\.]{25,})["\']'),
    "Webhook with credentials": re.compile(r'https?://[a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+@')
}

def scan_git_history():
    print("=" * 60)
    print("SCANNING COMPLETE GIT REPOSITORY HISTORY FOR SECRETS")
    print("=" * 60)

    # 1. Get list of all commits
    cmd_commits = ["git", "log", "--all", "--pretty=format:%H|%an|%ad|%s", "--date=iso"]
    res = subprocess.run(cmd_commits, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    commit_lines = res.stdout.strip().split("\n")
    print(f"Total commits in repository history: {len(commit_lines)}")

    findings = []

    # 2. Get full git log diff
    cmd_diff = ["git", "log", "-p", "--all", "--full-history"]
    res_diff = subprocess.run(cmd_diff, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    
    current_commit = "UNKNOWN"
    current_file = "UNKNOWN"
    line_number = 0

    for line in res_diff.stdout.split("\n"):
        if line.startswith("commit "):
            current_commit = line.split()[1]
        elif line.startswith("diff --git"):
            parts = line.split()
            if len(parts) >= 4:
                current_file = parts[3]
        
        # Only check added/changed lines (lines starting with +)
        if line.startswith("+") and not line.startswith("+++"):
            content = line[1:].strip()
            for rule_name, pat in PATTERNS.items():
                m = pat.search(content)
                if m:
                    # Ignore harmless test / dev placeholders
                    if any(ignore_str in content.lower() for ignore_str in [
                        "django-insecure-dev-aagam-test-key",
                        "testpassword",
                        "your_secret_key",
                        "placeholder",
                        "dummy"
                    ]):
                        continue

                    matched_val = m.group(0)
                    masked = matched_val[:12] + "..." + matched_val[-4:] if len(matched_val) > 16 else matched_val
                    findings.append({
                        "rule": rule_name,
                        "commit": current_commit,
                        "file": current_file,
                        "sample": masked,
                        "raw_line": content[:100]
                    })

    # 3. Check current workspace files for active uncommitted secrets
    print("\nScanning current workspace files for active secrets...")
    for root, dirs, files in os.walk("."):
        if ".git" in root or "node_modules" in root or "__pycache__" in root or ".venv" in root:
            continue
        for f in files:
            path = os.path.join(root, f)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fh:
                    for idx, line in enumerate(fh, 1):
                        for rule_name, pat in PATTERNS.items():
                            m = pat.search(line)
                            if m:
                                content = line.strip()
                                if any(ignore_str in content.lower() for ignore_str in [
                                    "django-insecure-dev-aagam-test-key",
                                    "testpassword",
                                    "your_secret_key",
                                    "placeholder",
                                    "dummy"
                                ]):
                                    continue
                                findings.append({
                                    "rule": f"[ACTIVE] {rule_name}",
                                    "commit": "WORKING_TREE",
                                    "file": path,
                                    "line": idx,
                                    "sample": m.group(0)[:12] + "...",
                                    "raw_line": content[:100]
                                })
            except Exception:
                pass

    print(f"\nScan completed. Found {len(findings)} potential secret references.")
    report_file = "scripts/secret_scan_report.json"
    with open(report_file, "w") as out:
        json.dump(findings, out, indent=2)
    print(f"Report written to {report_file}")
    return findings

if __name__ == "__main__":
    scan_git_history()
