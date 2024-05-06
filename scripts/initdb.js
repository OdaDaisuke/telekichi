import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("../db/telekichi.db");

const run = () => {
  // recording_schedule_metadata
  db.run("CREATE TABLE IF NOT EXISTS recording_schedule_metadata(schedule_id VARCHAR(36) PRIMARY KEY, start_at integer NOT NULL, finished integer default 0, program_info JSON)")

  // recording_status
  db.run("CREATE TABLE IF NOT EXISTS recording_status(id VARCHAR(36) PRIMARY KEY, schedule_id VARCHAR(36), status integer NOT NULL, thumbnail_generated integer, ss_thumbnail_image_count integer, program_info JSON)")
}

run()
