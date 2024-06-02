import axios, { AxiosInstance } from "axios"
import { MirakurunChannelList, MirakurunProgram } from "@/models/mirakurun"

class Mirakurun {
  private readonly client: AxiosInstance
  constructor() {
    this.client = axios.create({
      baseURL: "http://192.168.40.71:40772/api",
      timeout: 4000,
    })
  }

  async fetchChannels(): Promise<MirakurunChannelList> {
    const r = await this.client.get<MirakurunChannelList>("/channels?type=GR")
    return r.data
  }

  async fetchPrograms(serviceId: number): Promise<Array<MirakurunProgram>> {
    const r = await this.client.get<Array<MirakurunProgram>>(`/programs?serviceId=${serviceId}`)
    return r.data
  }

  /**
   * 番組の情報取得
   * @param programId 番組ID
   * @returns 
   */
  async fetchProgramInfo(programId: number): Promise<MirakurunProgram> {
    const r = await this.client.get<MirakurunProgram>(`/programs/${programId}`)
    return r.data
  }
}

export const mirakurun = new Mirakurun()
