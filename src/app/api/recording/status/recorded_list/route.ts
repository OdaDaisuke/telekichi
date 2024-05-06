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
      const s = item.filepath.split('/')
      const slash = s[s.length - 1].split('.')
      const filename = slash[0]
      const thumbnailImagePath = (item.thumbnail_generated === 2) ? `file:///Users/daisuke.oda/dev/sandbox/telekichi/child_process/recorder/thumbnail/${filename}/thumbnail.jpg` : undefined
      const ssThumbnailImageBasePath = `file:///Users/daisuke.oda/dev/sandbox/telekichi/child_process/recorder/ss_thumbnail/${filename}/`
      return {
        id: item.id,
        schedule_id: item.schedule_id,
        filepath: item.filepath,
        status: item.status,
        thumbnail_image_path: thumbnailImagePath,
        ss_thumbnail_image_base_path: ssThumbnailImageBasePath,
        ss_thumbnail_image_count: item.ss_thumbnail_image_count,
        program_info: JSON.parse(item.program_info),
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
