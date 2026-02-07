@echo off
echo Starting Cute Match Web Server...
echo.
echo Website will be available at: http://localhost:8000
echo.
python -m http.server 8000 --bind 127.0.0.1
pause
