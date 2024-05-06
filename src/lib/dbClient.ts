import sqlite3 from 'sqlite3'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'
import { RecordingStatus } from '@/models/recording_status'

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

  getRecordingScheduleMetadata = async (scheduleId: string): Promise<RecordingScheduleMetadata> => {
    const p = new Promise<RecordingScheduleMetadata>((resolve, reject) => {
      this.db.get<RecordingScheduleMetadata>("select * from recording_schedule_metadata where schedule_id = ?", [scheduleId], (err, row) => {
        resolve(row)
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

  getRecordingStatus = async (scheduleId: string): Promise<RecordingStatus | null> => {
    const p = new Promise<RecordingStatus | null>((resolve, reject) => {
      this.db.get<RecordingStatus>("select * from recording_status where schedule_id = ?", [scheduleId], (err, row) => {
        console.log('error', err)
        if (err) {
          resolve(null)
          return
        }
        resolve(row)
      })
    })
    return await p
  }

  insertRecordingStatus = async (scheduleId: string, status: string, filepath: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('insert into recording_status(schedule_id, status, filepath) VALUES(?, ?, ?)', [scheduleId, status, filepath], (err) => {
        if (err) {
          reject(`error ${JSON.stringify(err)}`)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }

  updateRecordingStatus = async (scheduleId: string, recordingStatus: number | undefined, thumbnailImageUrl: string | undefined) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('update recording_status set status = ?, thumbnail_image_url = ? where schedule_id = ?', [recordingStatus, thumbnailImageUrl, scheduleId], (err) => {
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
