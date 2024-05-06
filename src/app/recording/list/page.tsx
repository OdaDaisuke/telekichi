'use client'
import { useEffect, useState } from 'react';
import { RecordingStatusDecoded } from '@/models/recording_status';
import { apiClient } from '@/gateway/api';

// 録画済みファイル一覧
export default function RecordingList() {
  const [recordingStatusList, setRecordingStatusList] = useState<Array<RecordingStatusDecoded>>([])

  useEffect(() => {
    apiClient.fetchRecordingStatusList().then((list) => {
      setRecordingStatusList(list)
    })
  }, [])

  return <div>
    {recordingStatusList.map((recordingStatus, i) => {
      return <div key={i}>
        <img src={recordingStatus.thumbnailImageUrl} />
        <h3>{recordingStatus.programInfo.program.name}</h3>
        <p>{recordingStatus.programInfo.program.description}</p>
        <video controls>
          <source src={recordingStatus.playableUrl} type="video/webm" />
        </video>
      </div>
    })}
  </div>
}
