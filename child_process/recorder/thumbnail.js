import { spawn } from 'child_process'
import fs from 'fs'
import { assetsDir } from 'libtelekichi'

export const generateThumbnail = async (inputSource, recordingId) => {
  const outputDir = `${assetsDir}/thumbnail/${recordingId}`
  console.log(`start generating thumbnail ${inputSource} : ${outputDir}`)

  fs.promises.mkdir(outputDir, {
    recursive: true,
  })

  const args = `-i ${inputSource} -vf thumbnail=1000,scale=-1:720 -frames:v 1 ${outputDir}/thumbnail.jpg`
  console.log('args', args)
  const ffmpegProcess = spawn('ffmpeg', args.split(' '));

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  ffmpegProcess.on('close', async (code) => {
    console.log(`thumbnail generate process exited with code ${code}`);
  });
}
