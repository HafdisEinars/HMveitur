const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("fixtures.js", "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);

const rows = context.window.HMVEITUR_SEED.matches
  .map((match) => [
    match.id,
    match.startsAt,
    match.stage,
    match.groupName || "",
    match.homeTeam,
    match.awayTeam,
    match.venue
  ].join("|"))
  .join("\n");

const sqlPath = "supabase-schema.sql";
const sql = fs.readFileSync(sqlPath, "utf8");
const nextSql = sql.replace(
  /from regexp_split_to_table\(\$fixtures\$[\s\S]*?\$fixtures\$, E'\\n'\) as line/,
  `from regexp_split_to_table($fixtures$\n${rows}\n$fixtures$, E'\\n') as line`
);

if (nextSql === sql) {
  throw new Error("Could not find fixtures block in supabase-schema.sql");
}

fs.writeFileSync(sqlPath, nextSql, "utf8");
