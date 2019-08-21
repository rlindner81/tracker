const { unlinkSync } = require("fs")
const { execSync } = require("child_process")
const package = require("./package.json")
const dependencies = Object.keys(package.dependencies)
const devDependencies = Object.keys(package.devDependencies)

const run = cmd => {
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

run(`npm install ${dependencies.map(dep => dep + "@latest").join(" ")}`)
run(`npm install --dev ${devDependencies.map(dep => dep + "@latest").join(" ")}`)
unlinkSync("package-lock.json")
run("npm install --package-lock-only")
