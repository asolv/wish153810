# UTF-8 인코딩 설정
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  USFK BidTrack - 프로덕션 빌드" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# node_modules 확인
if (-not (Test-Path "$projectPath\node_modules")) {
    Write-Host "[1/3] 패키지 설치 중..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "패키지 설치 실패" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host "[2/3] 빌드 중..." -ForegroundColor Yellow
Write-Host ""

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "빌드 실패" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "[3/3] 빌드 완료 - 프로덕션 서버 시작 중..." -ForegroundColor Green
Write-Host ""
Write-Host "  접속 주소: http://localhost:3000" -ForegroundColor White
Write-Host "  종료: Ctrl+C" -ForegroundColor Gray
Write-Host ""

npm run start
