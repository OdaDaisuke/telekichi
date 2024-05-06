'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecordingStatusDecoded } from '@/models/recording_status';
import { apiClient } from '@/gateway/api';
import { AppButton } from '@/components/button';

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
        <Link
          href={{ pathname: '/play', query: { vod: 1, recordingId: recordingStatus.id }}}
          target="_blank"
        >視聴</Link>
      </div>
    })}
  </div>
}
