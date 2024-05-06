import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'

export async function GET(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  try {
    const recordedStatusList = await dbStore.listRecordedStatus()
    return NextResponse.json(
      recordedStatusList,
      { status: 200 }
    )
  } catch (e) {
    console.error('failed to fetch recording status list', e)
    return new NextResponse(
      null,
      { status: 500 }
    )
  }
}
