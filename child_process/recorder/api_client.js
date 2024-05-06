import axios from "axios"
import { ScheduleList } from './models.js'

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000/api",
    })
  }

  fetchRecordingScheduleList = async () => {
    try {
      const r = await this.client.get("/recording/schedule/list")
      return new ScheduleList(r.data)
    } catch (e) {
      console.error('[fetchRecordingScheduleList]error')
      return new ScheduleList([])
    }
  }

  createRecordingStatus = async (scheduleId, status, filepath) => {
    const res = await this.client.post("/recording/status", {
      scheduleId,
      status,
      filepath,
    })
    return res.data.recordingId
  }

  updateRecordingStatus = async (recordingId, status, thumbnailGenerated, ssThumbnailImageCount) => {
    await this.client.put("/recording/status", {
      id: recordingId,
      status,
      thumbnailGenerated,
      ssThumbnailImageCount,
    })
  }
}

export const apiClient = new ApiClient()
