const { execSync } = require("child_process")
const package = require("./package.json")
const dependencies = Object.keys(package.dependencies).filter(dep => dep.startsWith("^"))
const devDependencies = Object.keys(package.devDependencies).filter(dep => dep.startsWith("^"))

const run = cmd => {
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

run(`npm install --no-audit --no-package-lock --only=prod ${dependencies.map(dep => dep + "@latest").join(" ")}`)
run(`npm install --no-audit --no-package-lock --only=dev ${devDependencies.map(dep => dep + "@latest").join(" ")}`)
run("npm install --package-lock-only")
