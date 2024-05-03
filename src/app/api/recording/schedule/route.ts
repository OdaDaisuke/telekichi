import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'
import { mirakurun } from '@/gateway/mirakurun'

export async function POST(
  req: NextApiRequest,
  res: NextApiResponse<ReadableStream>
) {
  const { cid, sid, pid, startAt, recordingType: RecordingType } = req.body
  console.log('req', req.body)

  // TODO: 同じ時間帯の録画があるかどうかチェック

  const program = await mirakurun.fetchProgramInfo(pid)
  await dbStore.createRecordingSchedule(cid, sid, program, startAt, RecordingType)

  return new NextResponse(
    null,
    { status: 200 }
  );
}
