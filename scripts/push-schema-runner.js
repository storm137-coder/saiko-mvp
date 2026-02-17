const fs = require("fs");
const path = require("path");

function loadEnvFromFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    if (!line || line.trim().startsWith("#")) return;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) return;
    const key = match[1];
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

const envPath = path.join(__dirname, "..", ".env");
loadEnvFromFile(envPath);

require("ts-node/register");
require("./push-schema.ts");
