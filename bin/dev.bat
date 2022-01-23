@ECHO OFF

SETLOCAL
CD /d %~dp0\..
START "" npm run serve --prefix frontend &
START "" npm start --prefix backend
ENDLOCAL
