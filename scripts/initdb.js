import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("../db/telekichi.db");

const run = () => {
  // recording_schedules
  db.run("CREATE TABLE IF NOT EXISTS recording_schedules(id VARCHAR(36) PRIMARY KEY)")

  // recording_schedule_metadat
  db.run("CREATE TABLE IF NOT EXISTS recording_schedule_metadata(schedule_id VARCHAR(36) PRIMARY KEY, start_at integer NOT NULL, program_info JSON)")

  // recording_status
  db.run("CREATE TABLE IF NOT EXISTS recording_status(schedule_id VARCHAR(36), status integer NOT NULL, filepath TEXT, thumbnail_generated integer, ss_thumbnail_image_count integer)")
}

run()
