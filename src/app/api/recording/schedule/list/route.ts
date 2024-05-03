import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'

export async function GET(
  req: Request,
  res: NextApiResponse<Array<string>>
) {
  const metadataList = await dbStore.getRecordingScheduleMetadataList()
  const response = metadataList.map(item => {
    return {
      scheduleId: item.schedule_id,
      cron: item.cron,
      programInfo: JSON.parse(item.program_info),
    }
  })

  return NextResponse.json(
    response,
    { status: 200 }
  );
}
