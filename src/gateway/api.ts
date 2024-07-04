import axios, { AxiosInstance } from "axios"
import { RecordingSchedule } from "@/models/recording_schedule"
import { RecordingStatusDecoded } from '@/models/recording_status'
import { MirakurunProgram } from "@/models/mirakurun"
import { AppSettingsObject, SettingType, AppSetting } from "@/models/setting"

class ApiClient {
  private readonly client: AxiosInstance
  constructor() {
    this.client = axios.create({
      baseURL: "/api",
    })
  }

  async createRecordingSetting(cid: string, sid: number, pid: number, startAt: number, recordingType: "single" | "weekly"): Promise<MirakurunProgram> {
    try {
      const r = await this.client.post(`/recording/schedule`, {
        cid,
        sid,
        pid,
        startAt,
        recordingType: recordingType
      })
      return r.data
    } catch (e) {
      throw e
    }
  }

  async deleteRecordingSetting(scheduleId: string) {
    try {
      await this.client.delete(`/recording/schedule?id=${scheduleId}`)
    } catch (e) {
      throw e
    }
  }

  async fetchRecordingSettingList(): Promise<Array<RecordingSchedule>> {
    try {
      // const r = await this.client.get<Array<any>>(`/recording/schedule/list?filter=exclude_finished`)
      const r = await this.client.get<Array<any>>(`/recording/schedule/list?filter=exclude_finished`)
      console.log('r', r.data)
      return r.data
    } catch (e: any) {
      console.error('error ' + e, e.message)
      return []
    }
  }

  async fetchRecordingStatusList(): Promise<Array<RecordingStatusDecoded>> {
    try {
      const r = await this.client.get<Array<RecordingStatusDecoded>>(`/recording/status/recorded_list`)
      return r.data
    } catch (e) {
      throw e
    }
  }

  async fetchRecordingStatus(recordingId: string): Promise<RecordingStatusDecoded> {
    try {
      const r = await this.client.get<RecordingStatusDecoded>(`/recording/status?recording_id=${recordingId}`)
      return r.data
    } catch (e) {
      throw e
    }
  }

  // 全体設定取得
  async fetchAppSettings(): Promise<AppSettingsObject> {
    try {
      const r = await this.client.get<AppSettingsObject>(`/app_settings`)
      return r.data
    } catch (e) {
      throw e
    }
  }

  // 特定の全体設定項目を更新
  async updateAppSetting(settingType: SettingType, value: string): Promise<AppSetting> {
    try {
      // 上書きして返ってきた結果を返す(デフォルト値に戻すケースに対応するため)
      const r = await this.client.put<AppSetting>(`/app_settings`, {
        settingType: settingType,
        value: value
      })
      return r.data
    } catch (e) {
      throw e
    }
  }
}

export const apiClient = new ApiClient()

