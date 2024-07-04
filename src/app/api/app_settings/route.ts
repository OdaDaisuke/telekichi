import crypto from 'crypto'
import type { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { dbStore } from '@/lib/dbStore'
import { AppSetting } from '@/models/setting'

export async function PUT(
  req: Request,
  res: NextApiResponse
) {
  const body = await req.json()
  const { settingType, value } = body
  if (!settingType) {
    return new NextResponse(
      `Invalid request ${JSON.stringify(body)}`,
      { status: 400 }
    );
  }

  try {
    const updated = await dbStore.updateAppSetting(settingType, value)
    return NextResponse.json(
      updated,
      { status: 200 }
    )
  } catch (e) {
    console.error('failed', e)
    return new NextResponse(
      null,
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  res: NextApiResponse<AppSetting>
) {
  try {
    const appSettings = await dbStore.getAppSettings()
    return NextResponse.json(
      appSettings,
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
