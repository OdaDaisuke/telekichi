import sqlite3 from 'sqlite3'

const db = new sqlite3.Database("../db/telekichi.db");

const run = () => {
  // recording_schedule_metadata
  db.run("CREATE TABLE IF NOT EXISTS recording_schedule_metadata(schedule_id VARCHAR(36) PRIMARY KEY, start_at integer NOT NULL, finished integer default 0, program_info JSON)")

  // recording_status
  db.run("CREATE TABLE IF NOT EXISTS recording_status(id VARCHAR(36) PRIMARY KEY, schedule_id VARCHAR(36), status integer NOT NULL, thumbnail_generated integer, ss_thumbnail_image_count integer, program_info JSON)")

  // app_settings
  db.run("CREATE TABLE IF NOT EXISTS app_settings(setting_type VARCHAR(36) PRIMARY KEY, value VARCHAR(256), default_value VARCHAR(256), description VARCHAR(256))")

  // FIXME: callbackで対応
  // DUPLICATE KEY UPDATEに対応していないので対応する
  setTimeout(() => {
    db.run("INSERT INTO app_settings(setting_type, value, default_value, description) VALUES('mirakurun_host', '127.0.0.1', '127.0.0.1', 'Mirakurunのホストを指定してください')")
    db.run("INSERT INTO app_settings(setting_type, value, default_value, description) VALUES('mirakurun_port', '40772', '40772', 'Mirakurunのポートを指定してください')")
    db.run("INSERT INTO app_settings(setting_type, value, default_value, description) VALUES('recording_destination_storage', 'local', 'local', '保存先ストレージを指定してください。')")
    db.run("INSERT INTO app_settings(setting_type, value, default_value, description) VALUES('recording_destination_path', '~/telekichi', '~/telekichi', '保存先ストレージのパスを指定してください。')")
    db.run("INSERT INTO app_settings(setting_type, value, default_value, description) VALUES('recording_resolution', '127.0.0.1', '127.0.0.1', '保存時の解像度(デフォルトでFullHD)を指定してください')")
  }, 2000)
}

run()
