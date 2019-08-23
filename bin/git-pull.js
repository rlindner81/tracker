#!/usr/bin/env node
const path = require("path")
const { execSync, copyFileSync, unlinkSync } = require("child_process")

const project = Object.prototype.hasOwnProperty.call(process.env, "PROJECT") ? process.env.PROJECT : "project"
const inkscape = Object.prototype.hasOwnProperty.call(process.env, "INKSCAPE") ? process.env.INKSCAPE : "inkscape"
const convert = Object.prototype.hasOwnProperty.call(process.env, "CONVERT") ? process.env.CONVERT : "convert"
const source = Object.prototype.hasOwnProperty.call(process.env, "SOURCE") ? process.env.SOURCE : path.join(__dirname, "..", "assets", `${project}.svg`)
const target = Object.prototype.hasOwnProperty.call(process.env, "TARGET") ? process.env.TARGET : path.join(__dirname, "..", "frontend", "public", "img", "icons")

const run = cmds => {
  const cmd = cmds.split("\n").map(cmd => cmd.trim()).filter(cmd => cmd.length > 0).join(" && \\\n")
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

run(`
  cd /var/www/tracker
  git pull
  cd /var/www/tracker/frontend
  npm ci
  npm run build
  supervisorctl stop tracker
  cd /var/www/tracker/backend
  npm ci --only=production
  supervisorctl start tracker
`)
