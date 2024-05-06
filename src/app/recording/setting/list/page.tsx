'use client'
import { useEffect, useState } from 'react';
import { RecordingSchedule } from '@/models/recording_schedule';
import { apiClient } from '@/gateway/api';
import { AppButton } from '@/components/button';

export default function RecordingSettingList() {
  const [recordingScheduleList, setRecordingScheduleList] = useState<Array<RecordingSchedule>>([])

  useEffect(() => {
    apiClient.fetchRecordingSettingList().then((list) => {
      setRecordingScheduleList(list)
    })
  }, [])

  const onClickDeleteSetting = async (scheduleId: string, programName: string) => {
    if (window.confirm(`「${programName}」の録画設定を削除しますか？`)) {
      await apiClient.deleteRecordingSetting(scheduleId)
      location.reload()
    }
  }

  return <div>
    {recordingScheduleList.map((schedule, i) => {
      const isFinished = schedule.finished === 1
      return <div key={i}>
        <h3>{schedule.isRecording && <span>[録画中]</span>}{schedule.programInfo.program.name}</h3>
        <div>{schedule.scheduleId}</div>
        <div>{schedule.startAt}</div>
        {isFinished && <p>録画完了</p>}
        {!schedule.isRecording && <AppButton onClick={() => {onClickDeleteSetting(schedule.scheduleId, schedule.programInfo.program.name)}}>削除</AppButton>}
      </div>
    })}
  </div>
}
