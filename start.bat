@echo off
title AgriCopilot Platform
cd /d "%~dp0"
echo ==============================================
echo       Starting AgriCopilot Platform...
echo ==============================================
echo.
echo Launching http://localhost:3000 in your browser...
start http://localhost:3000
npm run dev
if errorlevel 1 (
    echo.
    echo Server encountered an error.
    pause
)
