// mirakurunからストリームを受け取ってパイプレスポンスするサーバ
import { spawn } from 'child_process'
import express from 'express'

const port = 8081

const server = express()
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
})

server.get('/stream/:channel_type/:channel_id/services/:service_id', (req, res) => {
  const channelType = req.params.channel_type
  const channelId = req.params.channel_id
  const serviceId = req.params.service_id

  const inputOriginHost = 'http://192.168.40.71:40772'
  // const inputSource = `http://192.168.40.71:40772/api/channels/GR/16/services/3239123608/stream`
  const inputSource = `${inputOriginHost}/api/channels/${channelType}/${channelId}/services/${serviceId}/stream`
  console.log('input source', inputSource)

  const ffmpegProcess = spawn('ffmpeg', [
    '-re',
    '-dual_mono_mode', 'main',
    '-i', inputSource,
    '-sn',
    '-threads', '3',
    '-c:a', 'libvorbis',
    '-ar', '48000',
    '-b:a', '192k',
    '-ac', '2',
    '-c:v', 'libvpx-vp9',
    '-vf', 'yadif,scale=-2:720',
    '-b:v', '3000k',
    '-deadline', 'realtime',
    '-speed', '4',
    '-cpu-used', '-8',
    '-y',
    '-f', 'webm',
    'pipe:1'
  ]);

  ffmpegProcess.stdout.pipe(res);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
    res.end();
  });

  res.writeHead(200, {
    'Content-Type': 'video/webm'
  });
})
