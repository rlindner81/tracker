const { join } = require("path")
const { execSync } = require("child_process")
const packageJson = require(join(process.cwd(), "/package.json"))
const dependencies = !packageJson.dependencies ? null : packageJson.dependencies
const devDependencies = !packageJson.devDependencies ? null : packageJson.devDependencies
const allDependencies = !dependencies && !devDependencies ? null : { ...dependencies, ...devDependencies }

const pickCaret = ([, value]) => value.startsWith("^")
const chooseLatest = ([key]) => key + "@latest"
const chooseSame = ([key]) => key

const run = (cmd) => {
  console.log(cmd)
  execSync(cmd, { stdio: "inherit" })
}

const npm = (command, options, deps, choose) => {
  if (deps) {
    run(
      `npm ${command} --no-audit --no-package-lock ${options} ${Object.entries(deps)
        .filter(pickCaret)
        .map(choose)
        .join(" ")}`
    )
  }
}

if (!allDependencies) {
  return
}

npm("uninstall", "--no-save", allDependencies, chooseSame)
npm("install", "--only=prod", dependencies, chooseLatest)
npm("install", "--only=dev", devDependencies, chooseLatest)
run("npm install --package-lock-only")
