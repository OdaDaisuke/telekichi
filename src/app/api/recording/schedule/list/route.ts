import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'
import { RecordingSchedule, RecordingScheduleMetadata } from '@/models/recording_schedule'

export async function GET(
  req: Request,
  res: NextApiResponse<Array<RecordingSchedule>>
) {
  const url = new URL(req.url || "")
  const metadataList: Array<RecordingScheduleMetadata> = []

  if (url.searchParams.get("filter") === 'exclude_finished') {
    const res = await dbStore.getRecordingScheduleMetadataListWithExcludeFinished()
    metadataList.push(...res)
  } else {
    const res = await dbStore.getRecordingScheduleMetadataList()
    metadataList.push(...res)
  }

  const recordingItems = await dbStore.listRecordedStatusByRecording()

  const response = metadataList.map(item => {
    const matchRecording = recordingItems.filter(recordingItem => {
      return recordingItem.schedule_id === item.schedule_id
    })
    return {
      scheduleId: item.schedule_id,
      startAt: item.start_at,
      programInfo: JSON.parse(item.program_info),
      finished: item.finished,
      isRecording: matchRecording.length > 0,
    }
  })

  return NextResponse.json(
    response,
    { status: 200 }
  );
}
