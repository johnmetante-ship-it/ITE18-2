@echo off
setlocal

REM Change to the Frontend folder (same location as this script)
cd /d "%~dp0Frontend"

REM ---- Locate npm ----
where npm >nul 2>nul
if errorlevel 1 (
    echo npm was not found. Install Node.js LTS from https://nodejs.org and try again.
    pause
    exit /b 1
)

REM ---- Install dependencies on first run ----
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo npm install failed.
        pause
        exit /b 1
    )
)

echo Starting Vite dev server at http://localhost:5173 ...
npm run dev

pause
endlocal
