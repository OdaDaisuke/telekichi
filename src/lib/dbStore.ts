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

  getRecordingScheduleMetadataList = async (): Promise<Array<RecordingScheduleMetadata>> => {
    return this.dbClient.getRecordingScheduleMetadataList()
  }

  getRecordingScheduleMetadataListWithExcludeFinished = async (): Promise<Array<RecordingScheduleMetadata>> => {
    return this.dbClient.getRecordingScheduleMetadataListWithExcludeFinished()
  }

  getRecordingScheduleMetadata = async (scheduleId: string): Promise<RecordingScheduleMetadata> => {
    return this.dbClient.getRecordingScheduleMetadata(scheduleId)
  }

  finishRecordingScheduleMetadata = async (scheduleId: string) => {
    await this.dbClient.finishRecordingScheduleMetadata(scheduleId)
  }

  createRecordingSchedule = async (cid: string, sid: number, program: MirakurunProgram, startAt: number, recordingType: RecordingType) => {
    const scheduleId = crypto.randomUUID()

    const metadata = new RecordingMetadata(scheduleId, cid, sid, program, startAt, recordingType)
    await this.saveRecordingScheduleMetadata(scheduleId, startAt, metadata)
  }

  deleteRecordingScheduleMetadata = async (scheduleId: string) => {
    this.dbClient.deleteRecordingScheduleMetadata(scheduleId)
  }

  getRecordingStatus = async (id: string): Promise<RecordingStatus> => {
    return await this.dbClient.getRecordingStatus(id)
  }

  listRecordedStatus = async (): Promise<Array<RecordingStatus>> => {
    return this.dbClient.listRecordedStatus()
  }

  listRecordedStatusByRecording = async (): Promise<Array<RecordingStatus>> => {
    return this.dbClient.listRecordedStatusByRecording()
  }

  insertRecordingStatus = async (id: string, scheduleId: string, programInfoJson: string, status: string) => {
    return this.dbClient.insertRecordingStatus(id, scheduleId, programInfoJson, status)
  }

  updateRecordingStatus = async (id: string, recordingStatus: number, thumbnailGenerated: number, ssThumbnailImageCount: number) => {
    return this.dbClient.updateRecordingStatus(id, recordingStatus, thumbnailGenerated, ssThumbnailImageCount)
  }

  private saveRecordingScheduleMetadata = async (scheduleId: string, startAt: number, metadata: RecordingMetadata) => {
    await this.dbClient.createRecordingScheduleMetadata(scheduleId, startAt, metadata.toJSON())
  }
}

export const dbStore = new DbStore()
