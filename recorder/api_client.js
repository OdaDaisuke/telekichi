import axios from "axios"
import { ScheduleList } from './models.js'

class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000/api",
    })
  }

  async fetchRecordingScheduleList() {
    try {
      const r = await this.client.get("/recording/schedule/list")
      return new ScheduleList(r.data)
    } catch (e) {
      return []
    }
  }
}

export const apiClient = new ApiClient()
