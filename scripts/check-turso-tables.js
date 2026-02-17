const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

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

async function main() {
  const envPath = path.join(__dirname, "..", ".env");
  loadEnvFromFile(envPath);

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("TURSO_DATABASE_URL is missing in .env");
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table'",
  );

  console.log(result.rows);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
