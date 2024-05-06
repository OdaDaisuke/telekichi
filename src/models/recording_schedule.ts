import { ProgramInfo } from './program_info'

// DBのモデル
export interface RecordingScheduleMetadata {
  schedule_id: string
  start_at: string
  finished: number
  program_info: string
}

export interface RecordingSchedule {
  scheduleId: string
  startAt: string
  programInfo: ProgramInfo
  isRecording: boolean
  finished: number
}
