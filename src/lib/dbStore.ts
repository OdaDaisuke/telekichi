import crypto from 'crypto'
import { RecordingType, RecordingMetadata } from '@/models/recording'
import { DbClient }from './dbClient'
import { timestampToCron } from './util'
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

  // getRecordingScheduleList = async (scheduleIds: Array<string>): Promise<any> => {
  // }

  createRecordingSchedule = async (cid: string, sid: number, program: MirakurunProgram, startAt: number, recordingType: RecordingType) => {
    const scheduleId = crypto.randomUUID()

    // スケジュールリストに追加
    await this.addRecordingScheduleList(scheduleId)

    // 録画のためのメタデータ保存
    const cron = timestampToCron(startAt)
    console.log('cron', cron)
    const metadata = new RecordingMetadata(scheduleId, cron, cid, sid, program, startAt, recordingType)
    await this.saveRecordingScheduleMetadata(scheduleId, metadata)
  }

  public addRecordingScheduleList = async (scheduleId: string) => {
    this.dbClient.addRecordingSchedule(scheduleId)
  }

  private saveRecordingScheduleMetadata = async (scheduleId: string, metadata: RecordingMetadata) => {
    const data = metadata.toJSON()
    await this.dbClient.createRecordingScheduleMetadata(scheduleId, data)
  }
}

export const dbStore = new DbStore()
