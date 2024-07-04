// import sqlite3 from 'sqlite3'
import fs from "fs"
import { child_process } from 'node:child_process';

const dbPath = "../db/telekichi.db"
// const db = new sqlite3.Database(dbPath);

try {
  const child = child_process.spawn("sqlite3", [dbPath])

  // TODO: 本当はちゃんとエラーハンドリングする
  fs.createReadStream("./init.sql").pipe(child.stdin)
} catch (e) {
  console.error('[DB Init error]', e)
  exit(1)
}
