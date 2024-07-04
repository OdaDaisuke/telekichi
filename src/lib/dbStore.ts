import crypto from 'crypto'
import { RecordingType, RecordingMetadata } from '@/models/recording'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'
import { RecordingStatus } from '@/models/recording_status'
import { DbClient }from './dbClient'
import { MirakurunProgram } from '@/models/mirakurun'
import { AppSettingsObject, AppSetting, SettingType } from '@/models/setting'

const dbClient = new DbClient()

class DbStore {
  private readonly dbClient: DbClient = dbClient

  constructor() {}

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

  deleteDeadRecordingScheduleMetadatas = async () => {
    const now = (new Date()).getTime()
    await this.dbClient.deleteDeadRecordingScheduleMetadata(now)
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

  getAppSettings = async (): Promise<AppSettingsObject> => {
    const settings = await this.dbClient.listSettings()
    const settingMap = new Map<SettingType, string>()
    settings.map(setting => {
      settingMap.set(setting.setting_type, setting.value)
    })
    console.log('s', settings)

    return {
      mirakurun: {
        host: settingMap.get(SettingType.MirakurunHost) || '',
        port: settingMap.get(SettingType.MirakurunPort) || '',
      },
      recording: {
        destination: {
          storage: settingMap.get(SettingType.RecordingDestinationStorage) || '',
          path: settingMap.get(SettingType.RecordingDestinationPath) || '',
        },
        resolution: settingMap.get(SettingType.RecordingResolution) || '',
      },
    }
  }

  updateAppSetting = async (settingType: string, value: string): Promise<AppSetting> => {
    // valueがnullの場合はdefaultValueに上書き
    if (value === '') {
      await this.dbClient.updateAppSettingToDefaultValue(settingType)
    }
    // そうでない場合はvalueに上書き
    await this.dbClient.updateAppSetting(settingType, value)
    const row = await this.dbClient.getSetting(settingType)
    return row
  }
}

export const dbStore = new DbStore()
