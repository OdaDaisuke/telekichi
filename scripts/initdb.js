import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("../db/telekichi.db");

const run = () => {
  // recording_schedules
  db.run("CREATE TABLE recording_schedules(id VARCHAR(36) PRIMARY KEY)")

  // recording_schedule_metadat
  db.run("CREATE TABLE recording_schedule_metadata(schedule_id VARCHAR(36) PRIMARY KEY, cron VARCHAR(16), program_info JSON)")
}

run()
