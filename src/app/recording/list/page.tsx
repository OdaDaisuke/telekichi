'use client'
import { useEffect, useState } from 'react';
import { RecordingSchedule } from '@/models/recording_schedule';
import { apiClient } from '@/gateway/api';

// 録画済みファイル一覧
export default function RecordingList() {
  const [recordingStatusList, setRecordingStatusList] = useState<Array<RecordingStatus>>([])

  useEffect(() => {
    apiClient.fetchRecordingStatusList().then((list) => {
      setRecordingStatusList(list)
    })
  }, [])

  return <div>
    {recordingStatusList.map((recordingStatus, i) => {
      return <div key={i}>
        <h3>{recordingStatus.programInfo.program.name}</h3>
        <div>{recordingStatus.scheduleId}</div>
        <div>{recordingStatus.startAt}</div>
      </div>
    })}
  </div>
}
