import axios, { AxiosInstance } from "axios"
import { RecordingSchedule } from "@/models/recording_schedule"
import { RecordingStatusDecoded } from '@/models/recording_status'
import { MirakurunProgram } from "@/models/mirakurun"

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
      const r = await this.client.get<Array<RecordingSchedule>>(`/recording/schedule/list?filter=exclude_finished`)
      return r.data
    } catch (e) {
      throw e
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
}

export const apiClient = new ApiClient()

