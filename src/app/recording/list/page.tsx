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
        <img src={recordingStatus.thumbnail_image_path} />
        <h3>{recordingStatus.program_info.program.name}</h3>
        <p>{recordingStatus.program_info.program.description}</p>
        <video controls>
          <source src={recordingStatus.filepath} />
        </video>
      </div>
    })}
  </div>
}
