@echo off
setlocal enabledelayedexpansion

REM Change to the Backend folder (same location as this script)
cd /d "%~dp0Backend"

REM ---- Locate PHP ----
set "PHP=php"
where php >nul 2>nul
if errorlevel 1 set "PHP="

if not defined PHP if exist "C:\ITE18_WebApp\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe" set "PHP=C:\ITE18_WebApp\laragon\bin\php\php-8.3.16-Win32-vs16-x64\php.exe"
if not defined PHP if exist "C:\laragon\bin\php\php-8.3.36-Win32-vs16-x64\php.exe" set "PHP=C:\laragon\bin\php\php-8.3.36-Win32-vs16-x64\php.exe"

if not defined PHP (
    echo PHP was not found.
    echo Install PHP 8.3 or edit START_BACKEND.bat to point to your php.exe.
    pause
    exit /b 1
)

echo Using PHP: !PHP!

REM ---- First-run setup: create .env and app key ----
if not exist ".env" (
    echo Creating .env from .env.example...
    copy ".env.example" ".env" >nul
    "!PHP!" artisan key:generate
)

REM ---- Create the SQLite database file when using the default sqlite driver ----
findstr /b "DB_CONNECTION=sqlite" ".env" >nul 2>nul
if not errorlevel 1 (
    if not exist "database\database.sqlite" (
        echo Creating database\database.sqlite...
        type nul > "database\database.sqlite"
    )
)

REM ---- Apply migrations (idempotent; skipped if the DB is unreachable) ----
echo Applying database migrations...
"!PHP!" artisan migrate --force >nul 2>nul
if errorlevel 1 (
    echo Warning: migrations were skipped - the database server may not be running.
    echo Check MySQL/MariaDB and your .env database settings, then run: php artisan migrate
) else (
    echo Database migrations applied.
)

REM ---- Start Laravel ----
echo Starting Laravel at http://localhost:8000 ...
"!PHP!" artisan serve

pause
endlocal
