import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'

export async function POST(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  const { scheduleId, status, filepath } = body
  if (!scheduleId) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  try {
    await dbStore.insertRecordingStatus(scheduleId, status, filepath)
  } catch (e) {
    console.error(e)
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

export async function PUT(
  req: Request,
  res: NextApiResponse<ReadableStream>
) {
  const body = await req.json()
  let { scheduleId, status, thumbnailImageUrl } = body
  console.log(scheduleId, status, thumbnailImageUrl)
  if (!scheduleId) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  try {
    const recordingStatus = await dbStore.getRecordingStatus(scheduleId)
    console.log('r', recordingStatus)
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
    if (!thumbnailImageUrl) {
      thumbnailImageUrl = recordingStatus.thumbnail_image_url
    }

    await dbStore.updateRecordingStatus(scheduleId, status, thumbnailImageUrl)
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