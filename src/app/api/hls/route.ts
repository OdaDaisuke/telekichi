import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import fs from 'fs'

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  console.log(process.cwd())
  const manifest = fs.readFileSync(`${process.cwd()}/src/app/api/hls/manifest.m3u8`);
  return new NextResponse(
    manifest.toString(),
    { status: 200 }
  );
}
