import { ProgramInfo } from "./program_info"

export interface RecordingStatus {
  id: string
  schedule_id: string
  status: number
  thumbnail_generated: number
  ss_thumbnail_image_count: number
  program_info: string
}

export interface RecordingStatusDecoded {
  id: string
  scheduleId: string
  status: number
  playableUrl: string
  thumbnailImageUrl: string
  ssThumbnailImageUrls: Array<string>
  programInfo: ProgramInfo
}
