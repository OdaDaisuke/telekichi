import http from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import Stream from 'stream'
import fs from 'fs'
import * as child_process from "child_process";

// webmとしてパイプレスポンスする
const cmd = 'ffmpeg -re -dual_mono_mode main -i http://192.168.40.71:40772/api/channels/GR/16/services/3239123608/stream -sn -threads 3 -c:a libvorbis -ar 48000 -b:a 192k -ac 2 -c:v libvpx-vp9 -vf yadif,scale=-2:720 -b:v 3000k -deadline realtime -speed 4 -cpu-used -8 -y -f webm pipe:0'
// const cmd = 'ffmpeg -re -dual_mono_mode main -i http://192.168.40.71:40772/api/channels/GR/16/services/3239123608/stream -sn -threads 3 -c:a libvorbis -ar 48000 -b:a 192k -ac 2 -c:v libvpx-vp9 -vf yadif,scale=-2:720 -b:v 3000k -deadline realtime -speed 4 -cpu-used -8 -y -f webm pipe:1'
const sleep = (): Promise<number> => new Promise((resolve) => setTimeout(resolve, 10000))

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ReadableStream>
) {
  const cmds = cmd.split(' ')
  const proc = child_process.spawn(cmds[0], cmds.slice(1, cmds.length),
  // {
    // shell: true,
    // stdio: 'inherit',}
  )
  const stream = proc.stdout;
  // if (!stream) {
  //   return new NextResponse(
  //     "no stream found",
  //     { status: 500 }
  //   );
  // }

  proc.on('error', (err) => {
    console.error('ffmpegの実行中にエラーが発生しました:', err);
  })

  stream.on('data', (data) => {
    console.log('data')
  })
  proc.stderr?.on('data', (data) => {
    console.error('error:', data);
  })

  // return new NextResponse(
  //   'ok',
  //   { status: 200 }
  // );
  await sleep()
  return new NextResponse(
    "ok",
    { status: 200 }
  );
}
