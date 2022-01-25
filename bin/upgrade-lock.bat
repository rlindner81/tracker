@ECHO OFF

SETLOCAL
CD /d %~dp0\..
npm run upgrade-lock --prefix frontend
npm run upgrade-lock --prefix backend
ENDLOCAL
