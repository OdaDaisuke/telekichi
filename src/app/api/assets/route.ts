import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { assetsDir } from 'libtelekichi'
import fs from 'fs'
import path from 'path'
import { dbStore } from '@/lib/dbStore'

// サムネ、シーンサーチサムネ、録画済み動画を返す

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ReadableStream>
) {
  const url = new URL(req.url || "")
  const assetType = url.searchParams.get("assetType")
  const recordingId = url.searchParams.get("recordingId")
  const ssThumbnailNumber = url.searchParams.get("ssThumbnailNumber")
  if (!assetType || !recordingId) {
    return new NextResponse(
      "need both ?assetType and ?recordingId.",
      { status: 400 }
    )
  }

  if (!(assetType === "thumbnail" || assetType === "ss_thumbnail" || assetType === "video")) {
    return new NextResponse(
      `invalid ?assetType specified ${assetType}`,
      { status: 400 }
    )
  }

  // recording status -> parse filename
  const recordingStatus = await dbStore.getRecordingStatus(recordingId as string)
  if (!recordingStatus) {
    return new NextResponse(
      `no recordoing status found recordingId:${recordingId}`,
      { status: 400 }
    )
  }

  switch (assetType) {
    case "thumbnail":
      const thumbnailPath = path.resolve(`${assetsDir}/thumbnail/${recordingId}/thumbnail.jpg`)
      if (!fs.existsSync(thumbnailPath)) {
        return new NextResponse(
          `no video found recordingId:${recordingId}`,
          { status: 500 }
        )
      }

      const thumbnail = fs.readFileSync(thumbnailPath);
      return new NextResponse(thumbnail, {
        headers: {
          'content-type': 'image/jpg'
        },
      })
    case "ss_thumbnail":
      if (!ssThumbnailNumber) {
        return new NextResponse(
          `no ?ssThumbnailNumber found`,
          { status: 400 }
        )
      }
      const file = `0000${ssThumbnailNumber}`.slice(-4)
      const ssThumbnailPath = path.resolve(`${assetsDir}/ss_thumb/${recordingId}/${file}.jpg`)
      if (!fs.existsSync(ssThumbnailPath)) {
        return new NextResponse(
          `no ssThumbnail found recordingId:${recordingId}, ssThumbnailNumber:${ssThumbnailNumber}`,
          { status: 500 }
        )
      }

      const ssThumbnail = fs.readFileSync(ssThumbnailPath);
      return new NextResponse(ssThumbnail, {
        headers: {
          'content-type': 'image/jpg'
        },
      })
    case "video":
      const filepath = `${assetsDir}/video/${recordingId}/video.webm`
      
      const videoPath = path.resolve(filepath)
      if (!fs.existsSync(videoPath)) {
        return new NextResponse(
          `no video found recordingId:${recordingId}`,
          { status: 500 }
        )
      }

      let video = fs.readFileSync(videoPath);
      return new NextResponse(video, {
        headers: {
          'content-type': 'video/webm'
        },
      })
  }
}
