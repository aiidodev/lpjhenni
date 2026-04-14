const fs = require("fs");
const path = require("path");

const out = path.join(__dirname, "..", "public", "build-id.txt");
fs.writeFileSync(
  out,
  `${new Date().toISOString()}\n${process.env.GIT_COMMIT || "local-build"}\n`,
  "utf8",
);
