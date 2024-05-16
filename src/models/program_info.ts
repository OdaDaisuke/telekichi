import { MirakurunProgram } from "./mirakurun"

export interface ProgramInfo {
  scheduleId: string
  cid: string
  sid: number
  startAt: number
  recordingType: string
  program: MirakurunProgram
}
