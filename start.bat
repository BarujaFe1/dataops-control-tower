@echo off
setlocal
cd /d "%~dp0"

echo === DataOps Control Tower ===
echo.

if not exist "apps\api\.venv" (
  echo Creating Python venv...
  python -m venv apps\api\.venv
)

call apps\api\.venv\Scripts\activate.bat
python -m pip install -q -r apps\api\requirements.txt

if not exist "apps\web\node_modules" (
  echo Installing frontend dependencies...
  pushd apps\web
  call npm install
  popd
)

start "ControlTower API" cmd /k "cd /d %~dp0apps\api && call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"
timeout /t 2 /nobreak >nul
start "ControlTower Web" cmd /k "cd /d %~dp0apps\web && npm run dev"

echo.
echo API:  http://127.0.0.1:8000/docs
echo Web:  http://localhost:3000
start http://localhost:3000
endlocal
