import crypto from 'crypto'
import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'

export async function POST(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  const { scheduleId, status } = body
  if (!scheduleId) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  try {
    // program info from metadata
    const recordingScheduleMetadata = await dbStore.getRecordingScheduleMetadata(scheduleId)

    const recordingId = crypto.randomUUID()
    await dbStore.insertRecordingStatus(recordingId, scheduleId, recordingScheduleMetadata.program_info, status)
    return NextResponse.json(
      {
        recordingId,
      },
      { status: 200 }
    )
  } catch (e: any) {
    console.error('failed', e)
    return new NextResponse(
      null,
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  let { id, status, thumbnailGenerated, ssThumbnailImageCount } = body
  if (!id) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  try {
    const recordingStatus = await dbStore.getRecordingStatus(id)
    if (!recordingStatus) {
      console.error('no recording status found')
      return new NextResponse(
        null,
        { status: 500 }
      )
    }

    if (!status) {
      status = recordingStatus.status
    }
    if (!thumbnailGenerated) {
      thumbnailGenerated = recordingStatus.thumbnail_generated
    }
    if (!ssThumbnailImageCount) {
      ssThumbnailImageCount = recordingStatus.ss_thumbnail_image_count
    }

    await dbStore.updateRecordingStatus(id, status, thumbnailGenerated, ssThumbnailImageCount)
    await dbStore.finishRecordingScheduleMetadata(recordingStatus.schedule_id)
  } catch (e) {
    console.error('failed to update recording status', e)
    return new NextResponse(
      null,
      { status: 500 }
    )
  }

  return new NextResponse(
    null,
    { status: 200 }
  )
}

export async function GET(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const url = new URL(req.url)
  const recordingId = url.searchParams.get("recording_id")
  if (!recordingId) {
    return new NextResponse(
      `no ?recordingId found`,
      { status: 400 }
    );
  }

  try {
    // program info from metadata
    const recordingStatus = await dbStore.getRecordingStatus(recordingId as string)
    const playableUrl = `/api/assets?assetType=video&recordingId=${recordingId}`
    const thumbnailImageUrl = `/api/assets?assetType=thumbnail&recordingId=${recordingId}`
    const ssThumbnailCount = recordingStatus.ss_thumbnail_image_count
    const ssThumbnailImageUrls: Array<string> = []
    for (let i = 1; i <= ssThumbnailCount + 1; i++) {
      ssThumbnailImageUrls.push(`/api/assets?assetType=ss_thumbnail&recordingId=${recordingId}&ssThumbnailNumber=${i}`)
    }

    return NextResponse.json(
      {
        id: recordingStatus.id,
        scheduleId: recordingStatus.schedule_id,
        status: recordingStatus.status,
        playableUrl,
        thumbnailImageUrl,
        ssThumbnailImageUrls,
        programInfo: JSON.parse(recordingStatus.program_info),
      },
      { status: 200 }
    )
  } catch (e: any) {
    console.error('failed', e)
    return new NextResponse(
      null,
      { status: 500 }
    )
  }
}