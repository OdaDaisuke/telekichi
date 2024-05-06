import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'

export async function GET(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  try {
    const recordedStatusList = await dbStore.listRecordedStatus()
    const res = recordedStatusList.map(item => {
      const recordingId = item.id
      const playableUrl = `/api/assets?assetType=video&recordingId=${recordingId}`
      const thumbnailImageUrl = `/api/assets?assetType=thumbnail&recordingId=${recordingId}`

      const ssThumbnailCount = item.ss_thumbnail_image_count
      const ssThumbnailImageUrls: Array<string> = []
      for (let i = 1; i <= ssThumbnailCount + 1; i++) {
        ssThumbnailImageUrls.push(`/api/assets?assetType=ss_thumbnail&recordingId=${recordingId}&ssThumbnailNumber=${i}`)
      }

      return {
        id: item.id,
        scheduleId: item.schedule_id,
        status: item.status,
        playableUrl,
        thumbnailImageUrl,
        ssThumbnailImageUrls,
        programInfo: JSON.parse(item.program_info),
      }
    })
    return NextResponse.json(
      res,
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
