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

  getRecordingStatus = async (id: string): Promise<RecordingStatus | null> => {
    const p = new Promise<RecordingStatus | null>((resolve, reject) => {
      this.db.get<RecordingStatus>("select * from recording_status where id = ?", [id], (err, row) => {
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

  listRecordedStatus = async (): Promise<Array<RecordingStatus>> => {
    const p = new Promise<Array<RecordingStatus>>((resolve, reject) => {
      this.db.all<RecordingStatus>("select * from recording_status where status = 2", (err, rows) => {
        if (err) {
          console.log('error', err)
          resolve([])
          return
        }
        resolve(rows)
      })
    })
    return await p
  }

  insertRecordingStatus = async (id: string, scheduleId: string, programInfoJson: string, status: string) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('insert into recording_status(id, schedule_id, program_info, status) VALUES(?, ?, ?, ?)', [id, scheduleId, programInfoJson, status], (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }

  updateRecordingStatus = async (id: string, recordingStatus: number | undefined, thumbnailGenerated: number, ssThumbnailImageCount: number) => {
    const p = new Promise((resolve, reject) => {
      this.db.run('update recording_status set status = ?, thumbnail_generated = ?, ss_thumbnail_image_count = ? where id = ?', [recordingStatus, thumbnailGenerated, ssThumbnailImageCount, id], (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve(undefined)
      })
    })
    await p
  }
}
