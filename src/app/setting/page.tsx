'use client'
import { useEffect, useState } from 'react';
import { RecordingSchedule } from '@/models/recording_schedule';
import { apiClient } from '@/gateway/api';
import { AppSettingsObject, SettingType, AppSetting } from "@/models/setting"
import { AppButton } from '@/components/button';

export default function RecordingSettingList() {
  const [appSettings, setAppSettings] = useState<AppSettingsObject>({
    mirakurun: {
      host: '',
      port: '',
    },
    recording: {
      destination: {
        storage: '',
        path: '',
      },
      resolution: '',
    },
  })

  useEffect(() => {
    apiClient.fetchAppSettings().then((settings) => {
      setAppSettings(settings)
    }).catch(e => {
      alert('エラーが発生しました' + JSON.stringify(e))
    })
  }, [])

  const settingItems: Array<{
    label: string
    settingType: SettingType
    value: string
  }> = [
    {
      label: 'Mirakurunのホスト',
      settingType: SettingType.MirakurunHost,
      value: appSettings.mirakurun.host,
    },
    {
      label: 'Mirakurunのポート',
      settingType: SettingType.MirakurunPort,
      value: appSettings.mirakurun.port,
    },
    {
      label: '録画先ストレージ',
      settingType: SettingType.RecordingDestinationStorage,
      value: appSettings.recording.destination.storage,
    },
    {
      label: '録画先パス',
      settingType: SettingType.RecordingDestinationPath,
      value: appSettings.recording.destination.path,
    },
    {
      label: '録画解像度',
      settingType: SettingType.RecordingResolution,
      value: appSettings.recording.resolution,
    },
  ]

  const onKeyUp = async (settingType: SettingType, value: string) => {
    const res = await apiClient.updateAppSetting(settingType, value)
    setAppSettings({
      ...appSettings,
      [settingType]: res.value
    })
    alert('更新しました')
  }

  return <div>
    <h1>設定画面</h1>
    {settingItems.map(item => {
      return <div key={item.settingType}>
        <label>{item.label}</label>
        <input
          type="text"
          value={item.value}
          defaultValue={item.value}
          onChange={e => {
            setAppSettings({
              ...appSettings,
              [item.settingType]: e.target.value,
            })
          }}
          onKeyUp={(e) => onKeyUp(item.settingType, item.value)}
          style={{color:'#3f3f3f'}}
        />
      </div>
    })}
  </div>
}
