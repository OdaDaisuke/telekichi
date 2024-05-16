import { ProgramInfo } from './program_info'

// DBのモデル
export interface RecordingScheduleMetadata {
  schedule_id: string
  start_at: number
  finished: number
  program_info: string
}

export interface RecordingSchedule {
  scheduleId: string
  startAt: number
  programInfo: ProgramInfo
  finished: number
  isRecording: boolean
}
