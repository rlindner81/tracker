const { execSync } = require("child_process")
const package = require("./package.json")
const dependencies = Object.entries(package.dependencies).filter(([key, value]) => value.startsWith("^")).map(([key]) => key)
const devDependencies = Object.entries(package.devDependencies).filter(([key, value]) => value.startsWith("^")).map(([key]) => key)

const run = cmd => {
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

run(`npm install --no-audit --no-package-lock --only=prod ${dependencies.map(dep => dep + "@latest").join(" ")}`)
run(`npm install --no-audit --no-package-lock --only=dev ${devDependencies.map(dep => dep + "@latest").join(" ")}`)
run("npm install --package-lock-only")
