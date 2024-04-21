"use client";
import { useState, useEffect } from 'react';
import { EPGHeader } from '@/components/epg/header';
import { EPGTimeScale } from '@/components/epg/time_scale';
import { EPGBody } from '@/components/epg/body';
import { MirakurunEvent, MirakurunChannelList } from "@/models/mirakurun";
import { mirakurun } from '@/gateway/mirakurun';

// 番組表ページ
export default function EPG() {
  const [channels, setChannels] = useState<MirakurunChannelList>([])
  const [programs, setPrograms] = useState<Map<string, Array<MirakurunEvent>>>(new Map())

  useEffect(() => {
    mirakurun.fetchChannels().then(channels => {
      setChannels(channels)
    })

    mirakurun.fetchEventInfo(1).then(sampleProgram => {
      const newPrograms = programs
      newPrograms.set("16", [
        sampleProgram, sampleProgram, sampleProgram,
      ])
      setPrograms(newPrograms)
    })
  }, [])

  const headerLabels: Array<string> = [
    // "NHK総合１・東京",
    // "NHKEテレ１・東京",
    // "日テレ１",
    // "テレビ朝日",
    // "TBS１",
    // "テレビ東京１",
  ]
  channels.forEach(channel => {
    headerLabels.push(channel.name)
  })
  console.log(channels)

  const currentHour = (new Date()).getHours()

  return (
    <div>
      <EPGHeader labels={headerLabels}/>
      <div className="flex">
        <EPGTimeScale currentHour={currentHour}/>
        <EPGBody programs={programs} currentTime={(new Date()).getTime()}/>
      </div>
    </div>
  );
}
