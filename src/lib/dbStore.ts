import crypto from 'crypto'
import { RecordingType, RecordingMetadata } from '@/models/recording'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'
import { DbClient }from './dbClient'
import { MirakurunProgram } from '@/models/mirakurun'

class DbStore {
  private readonly dbClient: DbClient

  constructor() {
    this.dbClient = new DbClient()
  }

  /**
   * 録画設定一覧を取得
   * @returns 録画設定IDリスト
   */
  getRecordingScheduleList = async (): Promise<Array<string>> => {
    return this.dbClient.getRecordingSchedules()
  }

  getRecordingScheduleMetadataList = async (): Promise<Array<RecordingScheduleMetadata>> => {
    return this.dbClient.getRecordingScheduleMetadataList()
  }

  createRecordingSchedule = async (cid: string, sid: number, program: MirakurunProgram, startAt: number, recordingType: RecordingType) => {
    const scheduleId = crypto.randomUUID()

    // スケジュールリストに追加
    await this.addRecordingScheduleList(scheduleId)

    // 録画のためのメタデータ保存
    const metadata = new RecordingMetadata(scheduleId, cid, sid, program, startAt, recordingType)
    await this.saveRecordingScheduleMetadata(scheduleId, startAt, metadata)
  }

  deleteRecordingSchedule = async (scheduleId: string) => {
    this.dbClient.deleteRecordingSchedule(scheduleId)
  }

  addRecordingScheduleList = async (scheduleId: string) => {
    this.dbClient.addRecordingSchedule(scheduleId)
  }

  private saveRecordingScheduleMetadata = async (scheduleId: string, startAt: number, metadata: RecordingMetadata) => {
    await this.dbClient.createRecordingScheduleMetadata(scheduleId, startAt, metadata.toJSON())
  }
}

export const dbStore = new DbStore()
