param(
  [string]$RepoPath = $PSScriptRoot + "\.."
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Resolve-Path -LiteralPath $RepoPath)

# Only tracked skill content and non-sensitive additions are eligible for sync.
git add --all
$pending = git status --porcelain
if (-not $pending) {
  exit 0
}

$stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
git commit -m "Sync skill updates ($stamp)"
git push origin main
