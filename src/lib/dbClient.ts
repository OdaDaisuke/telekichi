import sqlite3 from 'sqlite3'

export class DbClient {
  private readonly db: sqlite3.Database

  constructor() {
    this.db = new sqlite3.Database("./db/telekichi.db");
  }

  getRecordingSchedules = async (): Promise<Array<string>> => {
    const p = new Promise<Array<string>>((resolve, reject) => {
      this.db.all<string>("select id from recording_schedules", (err, rows) => {
        const ids = rows.map(row => {
          return row
        })
        resolve(ids)
      })
    })
    return await p
  }

  addRecordingSchedule = async (id: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('insert into recording_schedules(id) VALUES(?)', [id], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }

  createRecordingScheduleMetadata = async (scheduleId: string, dataJson: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('insert into recording_schedule_metadata(schedule_id, data) VALUES(?, ?)', [scheduleId, dataJson], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }
}
