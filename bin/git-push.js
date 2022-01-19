#!/usr/bin/env node
const path = require("path")
const { execSync, copyFileSync, unlinkSync } = require("child_process")

const ssh = Object.prototype.hasOwnProperty.call(process.env, "GIT_SSH") ? process.env.GIT_SSH : "ssh"
const server = Object.prototype.hasOwnProperty.call(process.env, "SERVER") ? process.env.SERVER : "goodnogood.org"
const sshCmd = process.platform === "win32" ? `${ssh} -batch -load ${server}` : `${ssh} ${server}`;
const shellJoin = process.platform === "win32" ? " ^&^& " : " && ";
const shellContinueOnNewline = process.platform === "win32" ? " ^\n" : " \\\n";

const runRemote = cmds => {
  const cmd = sshCmd + " " + cmds.split("\n").map(cmd => cmd.trim()).filter(cmd => cmd.length > 0).join(shellJoin)
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

runRemote(`
  cd /var/www/tracker
  git pull
  cd /var/www/tracker/frontend
  npm ci --package-lock
  npm run build
  supervisorctl stop tracker
  cd /var/www/tracker/backend
  npm ci --package-lock --only=production
  supervisorctl start tracker
`)
