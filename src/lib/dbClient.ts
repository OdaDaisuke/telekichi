import sqlite3 from 'sqlite3'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'

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

  createRecordingScheduleMetadata = async (scheduleId: string, startAt: number, programInfo: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('insert into recording_schedule_metadata(schedule_id, start_at, program_info) VALUES(?, ?, ?)', [scheduleId, startAt, programInfo], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }

  getRecordingScheduleMetadataList = async (): Promise<Array<RecordingScheduleMetadata>> => {
    const p = new Promise<Array<RecordingScheduleMetadata>>((resolve, reject) => {
      this.db.all<RecordingScheduleMetadata>("select * from recording_schedule_metadata", (err, rows) => {
        if (!rows) {
          resolve([])
          return
        }
        const ids = rows.map(row => {
          return row
        })
        resolve(ids)
      })
    })
    return await p
  }

  deleteRecordingSchedule = async (scheduleId: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('delete from recording_schedules where id = ?', [scheduleId], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p

    const p2 = new Promise((resolve, reject) => {
      this.db.run('delete from recording_schedule_metadata where schedule_id = ?', [scheduleId], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p2
  }
}
