import crypto from 'crypto'
import { RecordingType, RecordingMetadata } from '@/models/recording'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'
import { RecordingStatus } from '@/models/recording_status'
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

  getRecordingScheduleMetadata = async (scheduleId: string): Promise<RecordingScheduleMetadata> => {
    return this.dbClient.getRecordingScheduleMetadata(scheduleId)
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

  getRecordingStatus = async (id: string): Promise<RecordingStatus | null> => {
    return this.dbClient.getRecordingStatus(id)
  }

  listRecordedStatus = async (): Promise<Array<RecordingStatus>> => {
    return this.dbClient.listRecordedStatus()
  }

  insertRecordingStatus = async (id: string, scheduleId: string, status: string, filepath: string) => {
    return this.dbClient.insertRecordingStatus(id, scheduleId, status, filepath)
  }

  updateRecordingStatus = async (id: string, recordingStatus: number, thumbnailGenerated: number, ssThumbnailImageCount: number) => {
    return this.dbClient.updateRecordingStatus(id, recordingStatus, thumbnailGenerated, ssThumbnailImageCount)
  }

  private saveRecordingScheduleMetadata = async (scheduleId: string, startAt: number, metadata: RecordingMetadata) => {
    await this.dbClient.createRecordingScheduleMetadata(scheduleId, startAt, metadata.toJSON())
  }
}

export const dbStore = new DbStore()
