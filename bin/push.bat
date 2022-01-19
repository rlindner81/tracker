@ECHO OFF
SETLOCAL

SET SSH=plink -load "goodnogood.org"

%SSH% ^
  cd /var/www/tracker ^&^& ^
  git pull ^&^& ^
  cd /var/www/tracker/frontend ^&^& ^
  npm ci --package-lock ^&^& ^
  npm run build ^&^& ^
  supervisorctl stop tracker ^&^& ^
  cd /var/www/tracker/backend ^&^& ^
  npm ci --package-lock --only=production ^&^& ^
  supervisorctl start tracker

ENDLOCAL
