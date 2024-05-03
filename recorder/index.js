import { spawn } from 'child_process'
import levelup from 'levelup'
import leveldown from 'leveldown'
import cron from 'node-cron'

// dbからデータ一覧引っ張ってくる
// cron実行

const record = (durationSec) => {
  const inputOriginHost = 'http://192.168.40.71:40772'
  const inputSource = `http://192.168.40.71:40772/api/channels/GR/21/services/3274001056/stream`
  const d = new Date()

  const outputFilename = `./output${d.getTime()}.webm`
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
    '-vf', 'yadif,setdar=dar=16/9,scale=(dar*oh):1080',
    '-b:v', '7200k',
    '-deadline', 'realtime',
    '-speed', '4',
    '-t', durationSec,
    '-cpu-used', '-8',
    '-y',
    '-f', 'webm',
    outputFilename,
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`ffmpeg process exited with code ${code}`);
  });
}

const startRecordingScheduler = () => {
  // unix timestampからcron tabに変換する
  cron.schedule('* * * * *', () => {
    const durationSec = 10
    record(durationSec)
    console.log('end recording')
  });
}

startRecordingScheduler()

const setupDb = () => {
  const db = levelup(leveldown('./recording_db'))

  db.getMany('name', 'levelup', function (err) {
    if (err) {
      return console.log('Ooops!', err)
    }

    db.get('name', function (err, value) {
      if (err) {
        return console.log('Ooops!', err)
      }

      console.log('name=' + value)
    })
  })  
}
