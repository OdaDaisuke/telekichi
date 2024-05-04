'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MirakurunProgram } from '@/models/mirakurun';
import { mirakurun } from '@/gateway/mirakurun';
import { AppButton } from '@/components/button';
import { apiClient } from '@/gateway/api';

export default function RecordingSettingUpsert() {
  const searchParams = useSearchParams()
  const [programInfo, setProgramInfo] = useState<MirakurunProgram | null>(null)

  const params = {
    ctype: searchParams.get('ctype') || "",
    cid: searchParams.get('cid') || "",
    sid: searchParams.get('sid') || "",
    pid: parseInt(`${searchParams.get('pid')}`, 10),
  }
  if (!params.pid) {
    return <div><p>no pid found</p></div>
  }

  useEffect(() => {
    mirakurun.fetchProgramInfo(params.pid).then((program: MirakurunProgram) => {
      setProgramInfo(program)
    })
  }, [])

  // 番組表時
  const onClickSave = async () => {
    try {
      await apiClient.createRecordingSetting(params.cid, parseInt(params.sid, 10), params.pid, Date.now(), "single")
    } catch (e) {
      console.error('failed to create recording setting', e)
      alert(`エラー`)
    }
  }

  return <div>
    <h3>{programInfo?.name}</h3>
    <p>{programInfo?.description}</p>
    <AppButton onClick={onClickSave}>保存</AppButton>
  </div>
}
