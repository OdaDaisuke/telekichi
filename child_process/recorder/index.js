import { spawn } from 'child_process'
import cron from 'node-cron'
import { apiClient } from './api_client.js'
import { timestampToCron } from 'libtelekichi'
import { generateSsThumbnail } from './ss_thumbnail.js'

console.log('starting recorder')

// 実際の設定時刻の何秒前に録画プロセス開始するか[ms]
// 意図：録画プロセス開始から実際に録画開始するまでの遅延を考慮するため
const recordingStartTimeOffset = -(1000 * 5)

const record = async (scheduleId, durationSec, channel, serviceId, pid) => {
  const channelType = 'GR'
  // const inputSource = `http://192.168.40.71:40772/api/channels/GR/26/services/3273701032/stream`
  const inputSource = `http://192.168.40.71:40772/api/channels/${channelType}/${channel}/services/${serviceId}/stream`

  const d = new Date()
  const outputFilename = `output_${channelType}_${channel}_${serviceId}_${pid}_${d.getTime()}`
  const outputFilenameWithExt = `${outputFilename}.webm`

  const status = 1
  const outputFilepath = `${process.cwd()}/${outputFilenameWithExt}`
  await apiClient.createRecordingStatus(scheduleId, status, outputFilepath)

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
    '-b:v', '9000k',
    '-deadline', 'realtime',
    '-speed', '4',
    '-t', durationSec,
    '-cpu-used', '-8',
    '-y',
    '-f', 'webm',
    outputFilenameWithExt,
  ]);

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`${data}`);
  });

  ffmpegProcess.on('close', async (code) => {
    const status = 2
    // TODO: サムネ/const thumbnailImageUrl = ''
    await apiClient.updateRecordingStatus(scheduleId, status)
    console.log(`ffmpeg process exited with code ${code}`);

    generateSsThumbnail(outputFilepath, outputFilename)
  });
}

const startRecordingScheduler = () => {
  const queuedScheduleIdList = new Set()

  // APIからスケジュールを取得して、キューしてないものがあればcron設定
  const pullAndScheduleRecording = async () => {
    const scheduleList = await apiClient.fetchRecordingScheduleList()

    const currentTime = (new Date()).getTime()

    // 放送中のスケジュールがあれば即時録画
    // FIXME: 録画を即時停止したい場合に対応
    const ongoingSchedule = scheduleList.getOngoingSchedule(currentTime)
    if (ongoingSchedule !== null && !queuedScheduleIdList.has(ongoingSchedule.scheduleId)) {
      const endAt = ongoingSchedule.programInfo.program.startAt + ongoingSchedule.programInfo.program.duration
      const durationSec = parseInt(`${(endAt - currentTime + recordingStartTimeOffset) / 1000}`, 10)
      const pid = ongoingSchedule.programInfo.program.id
      const sid = ongoingSchedule.programInfo.sid
      const cid = ongoingSchedule.programInfo.cid

      console.log('start ongoing recording', ongoingSchedule.scheduleId, cid, sid, `${durationSec}sec`)
      record(ongoingSchedule.scheduleId, durationSec, cid, sid, pid)
      queuedScheduleIdList.add(ongoingSchedule.scheduleId)
    }

    // 予約されているスケジュールはcron設定
    const upcomingSchedule = scheduleList.getUpcomingSchedule(currentTime)
    if (upcomingSchedule !== null && !queuedScheduleIdList.has(upcomingSchedule.scheduleId)) {
      console.log('start upcoming recording', upcomingSchedule.scheduleId, upcomingSchedule.programInfo.cid, upcomingSchedule.programInfo.sid)
      const startAt = upcomingSchedule.programInfo.program.startAt + recordingStartTimeOffset
      const cronValue = timestampToCron(startAt)
      // FIXME: 設定変わったらcron設定も変える
      cron.schedule(cronValue, () => {
        const pid = upcomingSchedule.programInfo.program.id
        const sid = upcomingSchedule.programInfo.sid
        const cid = upcomingSchedule.programInfo.cid
        const durationSec = parseInt(`${upcomingSchedule.programInfo.program.duration / 1000}`, 10)
        record(upcomingSchedule.scheduleId, durationSec, cid, sid, pid)
      })
      queuedScheduleIdList.add(upcomingSchedule.scheduleId)
    }
    console.log('pulled')
  }
  setInterval(pullAndScheduleRecording, 1000 * 5)
}

startRecordingScheduler()
