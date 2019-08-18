const { unlinkSync } = require("fs")
const { execSync } = require("child_process")
const package = require("./package.json")

for (const dep of Object.keys(package.dependencies)) {
  execSync(`npm install --save ${dep}`, { stdio: "inherit" })
}
for (const dep of Object.keys(package.devDependencies)) {
  execSync(`npm install --save-dev ${dep}`, { stdio: "inherit" })
}
unlinkSync("package-lock.json")
execSync("npm install --package-lock-only", { stdio: "inherit" })
