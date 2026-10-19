@echo off
setlocal EnableDelayedExpansion
title "AtherControl - Test and Verification Suite"

:: Automatically add common Python install directories to PATH if present
if exist "%LOCALAPPDATA%\Programs\Python\Python313-arm64" set "PATH=%LOCALAPPDATA%\Programs\Python\Python313-arm64;%LOCALAPPDATA%\Programs\Python\Launcher;!PATH!"
if exist "%LOCALAPPDATA%\Programs\Python\Python313" set "PATH=%LOCALAPPDATA%\Programs\Python\Python313;%LOCALAPPDATA%\Programs\Python\Launcher;!PATH!"
if exist "%LOCALAPPDATA%\Programs\Python\Python312" set "PATH=%LOCALAPPDATA%\Programs\Python\Python312;%LOCALAPPDATA%\Programs\Python\Launcher;!PATH!"
if exist "%LOCALAPPDATA%\Programs\Python\Python311" set "PATH=%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Launcher;!PATH!"
if exist "%ProgramFiles%\Python313" set "PATH=%ProgramFiles%\Python313;!PATH!"
if exist "%ProgramFiles%\Python312" set "PATH=%ProgramFiles%\Python312;!PATH!"

echo ======================================================================
echo    ATHERCONTROL - LEAVER ACCESS REVIEW AUDITOR
echo    Ziro Digital National Agentic AI Hackathon 2026
echo    Problem Statement ID: f7298732-d5be-4fc4-8c8e-f65eb6d01c7e
echo ======================================================================
echo.

:: Detect Python executable
set "PYTHON_EXEC="
python --version >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXEC=python"
) else (
    py --version >nul 2>nul
    if %errorlevel% equ 0 (
        set "PYTHON_EXEC=py"
    )
)

if "%1"=="--help" goto HELP
if "%1"=="-h" goto HELP
if "%1"=="--dev" goto CLI_DEV
if "%1"=="--build" goto CLI_BUILD
if "%1"=="--py" goto CLI_PYTHON
if "%1"=="--ts" goto CLI_TS
if "%1"=="--ci" goto CLI_CI
if "%1"=="--all" goto CLI_ALL

:MENU
echo [1] Run Complete Test Suite (TypeScript + Python TC1-TC4)
echo [2] Run TypeScript Test Suite (TC1-TC4)
echo [3] Run Python Native Agent Test Suite (TC1-TC4)
echo [4] Verify Production Build (tsc + vite)
echo [5] Launch AtherControl Web UI (npm run dev)
echo [6] Run Full CI Verification & Exit
echo [7] Exit
echo.
set /p CHOICE="Select an option [1-7] (Default: 1): "
if "%CHOICE%"=="" set CHOICE=1
if "%CHOICE%"=="1" goto MENU_ALL
if "%CHOICE%"=="2" goto MENU_TS
if "%CHOICE%"=="3" goto MENU_PYTHON
if "%CHOICE%"=="4" goto MENU_BUILD
if "%CHOICE%"=="5" goto MENU_DEV
if "%CHOICE%"=="6" goto CLI_CI
if "%CHOICE%"=="7" goto END
goto MENU

:: --- Direct CLI Handlers (Non-Interactive, Exit Cleanly) ---

:CLI_TS
echo [Executing TypeScript Test Suite (TC1-TC4)]
call npm run test:cli
exit /b %errorlevel%

:CLI_PYTHON
echo [Executing Python Test Suite (TC1-TC4)]
if defined PYTHON_EXEC (
    %PYTHON_EXEC% python_agent\test_suite.py
    exit /b %errorlevel%
) else (
    echo [NOTE] Python not found in PATH. Skipping Python tests.
    exit /b 0
)

:CLI_BUILD
echo [Executing Production Build (tsc + vite)]
call npm run build
exit /b %errorlevel%

:CLI_DEV
echo [Launching AtherControl Web UI]
call npm run dev
exit /b %errorlevel%

:CLI_ALL
echo [Executing Full Test Suite]
call npm run test:cli
if %errorlevel% neq 0 exit /b %errorlevel%
if defined PYTHON_EXEC (
    %PYTHON_EXEC% python_agent\test_suite.py
    exit /b %errorlevel%
)
exit /b 0

:CLI_CI
echo.
echo ======================================================================
echo [1/3] Running TypeScript Test Suite...
echo ======================================================================
call npm run test:cli
if %errorlevel% neq 0 (
    echo [FAIL] TypeScript tests failed.
    exit /b 1
)

echo.
echo ======================================================================
echo [2/3] Running Python Test Suite...
echo ======================================================================
if defined PYTHON_EXEC (
    %PYTHON_EXEC% python_agent\test_suite.py
    if !errorlevel! neq 0 (
        echo [FAIL] Python tests failed.
        exit /b 1
    )
) else (
    echo [NOTE] Python not found in PATH. Skipped Python native test suite.
)

echo.
echo ======================================================================
echo [3/3] Running Production Build Compilation...
echo ======================================================================
call npm run build
if %errorlevel% neq 0 (
    echo [FAIL] Build failed.
    exit /b 1
)

echo.
echo ======================================================================
echo [SUCCESS] All CI Verification Checks Passed!
echo ======================================================================
exit /b 0

:: --- Interactive Menu Handlers (Pause & Return to Menu) ---

:MENU_ALL
echo.
echo [1/2] Executing TypeScript Official Test Suite (TC1-TC4)...
call npm run test:cli
echo.
echo [2/2] Executing Python Native Agent Test Suite (TC1-TC4)...
if defined PYTHON_EXEC (
    %PYTHON_EXEC% python_agent\test_suite.py
) else (
    echo [NOTE] Python not found in PATH. Skipped Python native test suite.
)
echo.
pause
goto MENU

:MENU_TS
echo.
call npm run test:cli
echo.
pause
goto MENU

:MENU_PYTHON
echo.
if defined PYTHON_EXEC (
    %PYTHON_EXEC% python_agent\test_suite.py
) else (
    echo [NOTE] Python not found in PATH. Skipped Python native test suite.
)
echo.
pause
goto MENU

:MENU_BUILD
echo.
call npm run build
echo.
pause
goto MENU

:MENU_DEV
echo.
echo Launching AtherControl Web Application...
call npm run dev
goto END

:HELP
echo Usage:
echo   test.bat            - Interactive test menu
echo   test.bat --all      - Run all tests (TS + Python)
echo   test.bat --ts       - Run TypeScript test runner (TC1-TC4)
echo   test.bat --py       - Run Python test runner (TC1-TC4)
echo   test.bat --build    - Run production build
echo   test.bat --ci       - Run full verification (TS + Python + Build)
echo   test.bat --dev      - Launch development web server
goto END

:END
endlocal
