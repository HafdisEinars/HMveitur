const fs = require("node:fs");
const vm = require("node:vm");

const fixturesSource = fs.readFileSync("fixtures.js", "utf8");
const context = { window: {} };
vm.runInNewContext(fixturesSource, context);

const fixtures = JSON.stringify(context.window.HMVEITUR_SEED.matches, null, 2);
const sqlPath = "supabase-schema.sql";
const sql = fs.readFileSync(sqlPath, "utf8");
const nextSql = sql.replace(
  /from jsonb_array_elements\(\$fixtures\$[\s\S]*?\$fixtures\$::jsonb\) as item;/,
  `from jsonb_array_elements($fixtures$\n${fixtures}\n$fixtures$::jsonb) as item;`
);

if (nextSql === sql) {
  throw new Error("Could not find fixtures block in supabase-schema.sql");
}

fs.writeFileSync(sqlPath, nextSql);
