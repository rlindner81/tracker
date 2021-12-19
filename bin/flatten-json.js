"use strict";

const path = require("path");

process.stdout.write(JSON.stringify(require(path.join(process.cwd(), process.argv[2]))))
