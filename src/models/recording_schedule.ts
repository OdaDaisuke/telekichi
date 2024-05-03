import { MirakurunProgram } from './mirakurun'

export interface RecordingScheduleMetadata {
  schedule_id: string
  cron: string
  program_info: string
  // MirakurunProgramのJSON string
}
