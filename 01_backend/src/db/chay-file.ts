import { readFileSync } from "node:fs";
import { pool } from "./pool";

async function main() {
  const tenFile = process.argv[2];
  if (!tenFile) {
    console.log("Cách dùng: npx tsx src/db/chay-file.ts sql/schema.sql");
    return;
  }

  const sql = readFileSync(tenFile, "utf8");

  try {
    await pool.query(sql);
    console.log("OK: đã chạy xong", tenFile);
  } catch (err: any) {
    console.log("LỖI | code:", err.code, "|", err.message);
    if (err.position) console.log("Gần vị trí ký tự:", err.position);
  } finally {
    await pool.end();
  }
}

main();