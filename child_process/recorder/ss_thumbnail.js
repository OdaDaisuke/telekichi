import { spawn } from 'child_process'
import fs from 'fs'
import { assetsDir } from 'libtelekichi'

// https://trac.ffmpeg.org/wiki/Create%20a%20thumbnail%20image%20every%20X%20seconds%20of%20the%20video
// // tile敷き詰め方式 shot per 10(30fps * 10)sec
// ffmpeg -i another_sky.webm -filter_complex "select='not(mod(n,300))',setpts='N/(30*TB)',scale=240:-1,tile=layout=10x10" \
//     -vsync vfr output/%04d.jpg -f null

export const generateSsThumbnail = async (inputSource, recordingId) => {
  const outputDir = `${assetsDir}/ss_thumb/${recordingId}`
  console.log(`start generating ss_thumbnail ${inputSource} : ${outputDir}`)

  fs.promises.mkdir(outputDir, {
    recursive: true,
  })

  // filter_complexを `"` で囲むと動かない
  const args = `-i ${inputSource} -filter_complex select='not(mod(n,300))',setpts='N/(30*TB)',scale=240:-1,tile=layout=10x10 -vsync vfr ${outputDir}/%04d.jpg -f null`
  console.log('args', args)
  const ffmpegProcess = spawn('ffmpeg', [
    '-i', inputSource,
    '-filter_complex', `select='not(mod(n,300))',setpts='N/(30*TB)',scale=240:-1,tile=layout=10x10`,
    '-vsync', 'vfr', `${outputDir}/%04d.jpg`, '-f', 'null',
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  const imageFileCount = new Promise((resolve, reject) => {
    ffmpegProcess.on('close', async (code) => {
      console.log(`ss_thumanbil generate process exited with code ${code}`);

      const files = fs.readdirSync(outputDir)
      const fileCount = files.length 
      resolve(fileCount)   
    })
  })
  return await imageFileCount
}

// シーンチェンジ検出方式
// ffmpeg -i another_sky.webm -vf \
//      "select=gt(scene\,1.0), scale=640:360,showinfo" \
//      -vsync vfr output/%04d.jpg -f null - 2>ffout
