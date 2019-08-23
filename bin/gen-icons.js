#!/usr/bin/env node
// PROJECT=tracker INKSCAPE=/Applications/Inkscape.app/Contents/Resources/bin/inkscape bin/gen-icons.js
const path = require("path")
const { execSync, copyFileSync, unlinkSync } = require("child_process")

const project = Object.prototype.hasOwnProperty.call(process.env, "PROJECT") ? process.env.PROJECT : "project"
const inkscape = Object.prototype.hasOwnProperty.call(process.env, "INKSCAPE") ? process.env.INKSCAPE : "inkscape"
const convert = Object.prototype.hasOwnProperty.call(process.env, "CONVERT") ? process.env.CONVERT : "convert"
const source = Object.prototype.hasOwnProperty.call(process.env, "SOURCE") ? process.env.SOURCE : path.join(__dirname, "..", "assets", `${project}.svg`)
const target = Object.prototype.hasOwnProperty.call(process.env, "TARGET") ? process.env.TARGET : path.join(__dirname, "..", "frontend", "public", "img", "icons")

const run = cmd => {
    console.log(cmd)
    execSync(cmd, { stdio: "inherit" })
  }
  
// PNG
const gen_png = (name, size) => {
  run(`${inkscape} --without-gui --export-png ${path.join(target, `${name}.png`)} --export-width ${size} --export-height ${size} ${source}`)
}

const gen_png_white_bg = (name, size) => {
  run(`${inkscape} --without-gui --export-png ${path.join(target, `${name}.png`)} --export-width ${size} --export-height ${size} --export-background 'ffffff' --export-background-opacity '1.0' ${source}`)
}

gen_png("android-chrome-192x192", 192)
gen_png("android-chrome-512x512 ",512)
gen_png("white_bg apple-touch-icon-60x60", 60)
gen_png("white_bg apple-touch-icon-76x76", 76)
gen_png("white_bg apple-touch-icon-120x120 ",120)
gen_png("white_bg apple-touch-icon-152x152 ",152)
gen_png("white_bg apple-touch-icon-180x180 ",180)
gen_png("white_bg apple-touch-icon ",180)
gen_png("favicon-16x16", 16)
gen_png("favicon-32x32", 32)
gen_png("msapplication-icon-144x144 ",144)
gen_png("mstile-150x150 ",150)

// SVG
copyFileSync(source, path.join(target, "safari-pinned-tab.svg"))

// ICO
run(`${convert} -resize x16 -gravity center -crop 16x16+0+0 -flatten -colors 256 ${path.join(target, "favicon-16x16.png")} ${path.join(target, "favicon-16x16.ico")}`)
run(`${convert} -resize x32 -gravity center -crop 32x32+0+0 -flatten -colors 256 ${path.join(target, "favicon-32x32.png")} ${path.join(target, "favicon-32x32.ico")}`)
run(`${convert} ${path.join(target, "favicon-16x16.ico")} ${path.join(target, "favicon-32x32.ico")} ${path.join(target, "..","..", "favicon.ico")}`)
unlinkSync(path.join(target, "favicon-16x16.ico"))
unlinkSync(path.join(target, "favicon-32x32.ico"))
