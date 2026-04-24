@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js가 설치되어 있지 않거나 PATH에 없습니다.
  echo https://nodejs.org 에서 설치 후 다시 실행하세요.
  pause
  exit /b 1
)
node scripts\save-config-server.cjs
pause
