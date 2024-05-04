import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'
import { mirakurun } from '@/gateway/mirakurun'

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
  await dbStore.createRecordingSchedule(cid, sid, program, startAt, RecordingType)
  console.log('done')

  return new NextResponse(
    null,
    { status: 200 }
  );
}

export async function DELETE(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  const scheduleId = body.scheduleId
  if (!scheduleId) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  await dbStore.deleteRecordingSchedule(scheduleId)

  return new NextResponse(
    null,
    { status: 200 }
  );
}
