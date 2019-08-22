@ECHO OFF
SETLOCAL

SET SSH=plink -load "goodnogood.org"

%SSH% ^
  cd /var/www/tracker ^&^& ^
  git pull ^&^& ^
  cd /var/www/tracker/frontend ^&^& ^
  npm ci ^&^& ^
  npm run build ^&^& ^
  supervisorctl stop tracker ^&^& ^
  cd /var/www/tracker/backend ^&^& ^
  npm ci --only=production ^&^& ^
  supervisorctl start tracker

ENDLOCAL
