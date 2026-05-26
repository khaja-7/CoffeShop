@echo off
SETLOCAL EnableDelayedExpansion
title Coffee Shop Spring Boot API Server

echo ☕ Checking Java installation...
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Java is not installed or not in your PATH.
    echo Please install JDK 17 or higher.
    pause
    exit /b 1
)

echo ☕ Checking Maven installation...
where mvn >nul 2>&1
if %ERRORLEVEL% eq 0 (
    echo ✅ Global Maven found.
    set MVN_CMD=mvn
    goto :run
)

echo ⚠️ Global Maven not found. Checking local Maven in .maven/ folder...
if exist ".maven\apache-maven-3.9.6\bin\mvn.cmd" (
    echo ✅ Local Maven found.
    set MVN_CMD=".maven\apache-maven-3.9.6\bin\mvn.cmd"
    goto :run
)

echo ⬇️ Local Maven not found. Running setup-maven.ps1 to download it...
powershell -ExecutionPolicy Bypass -File .\setup-maven.ps1
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to download Maven automatically.
    echo Please install Maven manually or run setup-maven.ps1 as Administrator.
    pause
    exit /b 1
)

if exist ".maven\apache-maven-3.9.6\bin\mvn.cmd" (
    echo ✅ Local Maven set up successfully.
    set MVN_CMD=".maven\apache-maven-3.9.6\bin\mvn.cmd"
    goto :run
) else (
    echo ❌ Could not find Maven after setup script execution.
    pause
    exit /b 1
)

:run
echo 🚀 Starting Coffee Shop API Server on http://localhost:5000 ...
call %MVN_CMD% spring-boot:run
if %ERRORLEVEL% neq 0 (
    echo ❌ Spring Boot failed to run. Check the error logs above.
    pause
)
