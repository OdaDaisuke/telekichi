import { MirakurunProgram } from './mirakurun'
import { ProgramInfo } from './program_info'

// DBのモデル
export interface RecordingScheduleMetadata {
  schedule_id: string
  start_at: string
  program_info: string
}

export interface RecordingSchedule {
  scheduleId: string
  startAt: string
  programInfo: ProgramInfo
}
