# Run after: gh auth login
# Creates public repo, pushes main, enables GitHub Pages

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Not logged in. Run: gh auth login -h github.com -p https -w"
  exit 1
}

$username = (gh api user --jq .login)
Write-Host "GitHub user: $username"

if (-not (git remote get-url origin 2>$null)) {
  gh repo create smart-programmer --public --source=. --remote=origin --description "Smart Programmer - DSA visualizer platform"
}

git push -u origin main

gh api repos/$username/smart-programmer/pages -X POST -f "build_type=workflow" -f "source[branch]=main" -f "source[path]=/" 2>$null

Write-Host ""
Write-Host "Done! Site will be live in 1-2 minutes at:"
Write-Host "https://$username.github.io/smart-programmer/"
