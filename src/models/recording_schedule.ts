import { MirakurunProgram } from './mirakurun'

// DBのモデル
export interface RecordingScheduleMetadata {
  schedule_id: string
  start_at: string
  program_info: string
}

export interface RecordingSchedule {
  scheduleId: string
  startAt: string
  programInfo: {
    scheduleId: string,
    sid: number,
    program: MirakurunProgram,
  }
}
