import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'
import { mirakurun } from '@/gateway/mirakurun'
import { RecordingScheduleMetadata } from '@/models/recording_schedule'

export async function POST(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  const pid = parseInt(body.pid, 10)
  const { cid, sid, startAt, recordingType: RecordingType } = body
  if (!cid || !sid || !pid || !startAt || !RecordingType) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  // TODO: 同じ時間帯の録画があるかどうかチェック

  const program = await mirakurun.fetchProgramInfo(pid)
  const endAt = startAt + program.duration
  const recordingSettingsList = await dbStore.getRecordingScheduleMetadataList()
  if (!await validateTimeRangeDuplication(recordingSettingsList, startAt, endAt)) {
    return NextResponse.json(
      {
        error: {
          code: 5000,
          label: 'time_range_duplicated',
        },
      },
      { status: 200 }
    );
  }

  await dbStore.createRecordingSchedule(cid, sid, program, startAt, RecordingType)
  console.log('done')

  return new NextResponse(
    null,
    { status: 200 }
  );
}

const validateTimeRangeDuplication = async (recordingSettingsList: Array<RecordingScheduleMetadata>, startAt: number, endAt: number): Promise<boolean> => {
  console.log('settings', recordingSettingsList)
  const ngList = recordingSettingsList.filter(recordingSetting => {
    const programInfo = JSON.parse(recordingSetting.program_info)
    const targetStartAt = programInfo.startAt
    const targetEndAt = targetStartAt + programInfo.program.duration
    const startDuplicated = targetStartAt > startAt && targetStartAt < endAt
    console.log('startDuplicated', startDuplicated)
    const endDuplicated = startAt < targetEndAt && targetEndAt < endAt
    console.log('endDuplicated', endDuplicated)
    return startDuplicated || endDuplicated
  })

  return ngList.length === 0
}

export async function DELETE(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const url = new URL(req.url)
  const scheduleId = url.searchParams.get("id")
  if (!scheduleId) {
    return new NextResponse(
      `no ?id found`,
      { status: 400 }
    );
  }

  await dbStore.deleteRecordingScheduleMetadata(scheduleId)

  return new NextResponse(
    null,
    { status: 200 }
  );
}
