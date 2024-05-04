import axios, { AxiosInstance } from "axios"
import { RecordingSchedule } from "@/models/recording_schedule"

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

  async fetchRecordingSettingList(): Promise<Array<RecordingSchedule>> {
    try {
      const r = await this.client.get<Array<RecordingSchedule>>(`/recording/schedule/list`)
      return r.data
    } catch (e) {
      throw e
    }
  }
}

export const apiClient = new ApiClient()

