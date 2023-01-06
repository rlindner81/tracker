#!/usr/bin/env node
const { execSync } = require("child_process");

const run = (commands) => {
  const command = commands
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join(" && \\\n");
  console.log(command);
  execSync(command, { stdio: "inherit" });
};

const args = process.argv.slice(2);
const doUpdateGit = true;
const doUpdateFrontend =
  args.length === 0 || args.some((arg) => /front/gi.test(arg));
const doUpdateBackend =
  args.length === 0 || args.some((arg) => /back/gi.test(arg));

let shellCommands =
  (doUpdateGit
    ? `
    cd /var/www/tracker
    git pull
  `
    : "") +
  (doUpdateFrontend
    ? `
    cd /var/www/tracker/frontend
    npm ci --package-lock
    npm run build-only
  `
    : "") +
  (doUpdateBackend
    ? `
    supervisorctl stop tracker
    cd /var/www/tracker/backend
    npm ci --package-lock --only=production
    supervisorctl start tracker
  `
    : "");

run(shellCommands);
