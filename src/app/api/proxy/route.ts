import http from 'http'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import Stream from 'stream'
import fs from 'fs'
import * as child_process from "child_process";

// const streamUrl = 'http://192.168.40.71:40772/api/channels/GR/16/services/23608/stream'
const streamUrl = 'http://192.168.40.71:40772/api/services/3273601024/stream'

const sleep = (): Promise<number> => new Promise((resolve) => setTimeout(resolve, 10000))

const cmd = `-O - -o /dev/null ${streamUrl}`

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ReadableStream>
) {
  const proc = child_process.spawn('wget', cmd.split(' '));
  const stream = proc.stdout;

  const readableStream = new Stream.Readable();

  const dest = fs.createWriteStream('record.ts', 'utf8');

  stream.on("data", (chunk: Buffer) => {
    readableStream.push(chunk)
    dest.write(chunk)
  });
  // readable stream作ってそれをレスポンス

  await sleep()
  return new NextResponse(
    "ok",
    { status: 200 }
  );
}
