'use client'
import { useEffect, useState } from 'react';
import { RecordingSchedule } from '@/models/recording_schedule';
import { apiClient } from '@/gateway/api';

export default function RecordingSettingList() {
  const [recordingScheduleList, setRecordingScheduleList] = useState<Array<RecordingSchedule>>([])

  useEffect(() => {
    apiClient.fetchRecordingSettingList().then((list) => {
      setRecordingScheduleList(list)
    })
  }, [])

  return <div>
    {recordingScheduleList.map((schedule, i) => {
      return <div key={i}>
        <h3>{schedule.programInfo.program.name}</h3>
        <div>{schedule.scheduleId}</div>
        <div>{schedule.startAt}</div>
        {/* <div>{JSON.stringify(schedule.programInfo)}</div> */}
      </div>
    })}
  </div>
}
