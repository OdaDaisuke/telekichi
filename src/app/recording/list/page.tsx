'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RecordingStatusDecoded } from '@/models/recording_status';
import { apiClient } from '@/gateway/api';

const Badge = (props: {label: string, isRight?: boolean}) => {
  if (props.isRight) {
    return <span className="text-sm mr-2" style={{ backgroundColor: 'rgb(83 106 19)', borderRadius: '2px', padding: '1px 5px',color: '#e0e0e0', float: 'right', letterSpacing: '-0.5px', }}>{props.label}</span>
  }
  if (props.label === '') {
    return <></>
  }
  return <span className="text-sm mr-2" style={{ color: '#c0c0c0', letterSpacing: '-0.5px', }}>{props.label}</span>
}

// 録画済みファイル一覧
export default function RecordingList() {
  const [recordingStatusList, setRecordingStatusList] = useState<Array<RecordingStatusDecoded>>([])

  useEffect(() => {
    apiClient.fetchRecordingStatusList().then((list) => {
      setRecordingStatusList(list)
    })
  }, [])

  const getLangLabel = (lang: string): string => {
    return {
      "jpn": "日本語",
    }[lang] || ""
  }

  const formatDate = (timestmap: number) => {
    const d = new Date(timestmap)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  const formatDuration = (durationMS: number) => {
    const durationS = durationMS / 1000
    const h = Math.floor(durationS / 3600)
    const m = Math.floor((durationS % 3600) / 60)
    return `${h}時間${m}分`
  }

  const isNew = (pid: number) => {
    return Math.random() < 0.5
  }

  return <div>
    <h2>録画済み一覧</h2>
    <ul className="flex justify-start flex-wrap mx-auto" style={{maxWidth: '1490px'}}>
      {recordingStatusList.map((recordingStatus, i) => {
        return <li key={i} className="mb-4 mx-2" style={{flex: '0 1 22%', width: '22%'}}>
          <Link
              href={{ pathname: '/play', query: { vod: 1, recordingId: recordingStatus.id }}}
              target="_blank"
            >
            <div className="bg-cover	mr-2 mb-2" style={{height: '170px', width: '100%', backgroundImage: `url(${recordingStatus.thumbnailImageUrl})`}}></div>
            {/* <img src={recordingStatus.thumbnailImageUrl} /> */}
            <div className="flex flex-wrap">
              <h3 className="flex-auto w-full text mb-1">{recordingStatus.programInfo.program.name}</h3>
              <div className="w-full" style={{}}>
                <Badge label={formatDate(recordingStatus.programInfo.startAt)} />
                <Badge label={formatDuration(recordingStatus.programInfo.program.duration)} />
                {/* <span>{JSON.stringify(recordingStatus.programInfo.program.video.resolution)}</span> */}
                {isNew(recordingStatus.programInfo.program.id) && <Badge label="New !" isRight />}
              </div>
            </div>
          </Link>
        </li>
      })}
    </ul>
  </div>
}
