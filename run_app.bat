@echo off
title Mausam Mitra Prototype
echo ========================================================
echo   Launching Mausam Mitra AI Prototype (SIH ID: 26076)...
echo ========================================================
if exist "..\.venv\Scripts\python.exe" (
    "..\.venv\Scripts\python.exe" server.py
) else (
    python server.py
    if errorlevel 1 (
        echo Opening index.html directly in your default browser...
        start index.html
    )
)
pause
