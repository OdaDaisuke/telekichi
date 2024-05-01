// mirakurunからストリームを受け取ってパイプレスポンスするサーバ
const http = require('http');
const { spawn } = require('child_process');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/stream') {
    // ffmpegコマンドを実行し、標準出力をレスポンスにpipeで流す
    const ffmpegProcess = spawn('ffmpeg', [
      '-re',
      '-dual_mono_mode', 'main',
      '-i', 'http://192.168.40.71:40772/api/channels/GR/16/services/3239123608/stream',
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
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      console.log(`ffmpeg process exited with code ${code}`);
      res.end();
    });

    // リクエストヘッダーにMIMEタイプを設定
    res.writeHead(200, {
      'Content-Type': 'video/webm'
    });
  } else {
    // その他のリクエストに404を返す
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
