#!/usr/bin/env node
const { execSync } = require("child_process")

const shellJoin = process.platform === "win32" ? " ^&^& " : " && ";

const run = cmds => {
  const cmd = cmds.split("\n").map(cmd => cmd.trim()).filter(cmd => cmd.length > 0).join(shellJoin)
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

run(`
  npm ci --package-lock --prefix frontend
  npm ci --package-lock --prefix backend
`)
