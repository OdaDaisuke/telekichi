import { MirakurunProgram } from './mirakurun'

// 今の所単発だけ
export type RecordingType = "single"

export class RecordingMetadata {
  private readonly metadata: {
    scheduleId: string,
    cid: string,
    sid: number,
    program: MirakurunProgram,
    startAt: number,
    recordingType: RecordingType
  }

  constructor(scheduleId: string, cid: string, sid: number, program: MirakurunProgram, startAt: number, recordingType: RecordingType) {
    this.metadata = {
      scheduleId,
      cid,
      sid,
      program,
      startAt,
      recordingType,
    }
  }

  toJSON = (): string => {
    return JSON.stringify(this.metadata)
  }
}
