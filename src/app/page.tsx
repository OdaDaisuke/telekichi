"use client";
import { useState, useEffect } from 'react';
import { EPGHeader } from '@/components/epg/header';
import { EPGTimeScale } from '@/components/epg/time_scale';
import { EPGBody } from '@/components/epg/body';
import { MirakurunProgram, MirakurunChannelList, MirakurunChannel } from "@/models/mirakurun";
import { mirakurun } from '@/gateway/mirakurun';

// 番組表ページ
export default function EPG() {
  const [channels, setChannels] = useState<MirakurunChannelList>([])
  const [programs, setPrograms] = useState<{[defualtServiceId: number]: Array<MirakurunProgram>}>({})

  useEffect(() => {
    const data: {[defualtServiceId: number]: Array<MirakurunProgram>} = {}
    const run = async () => {
      const channels = await mirakurun.fetchChannels();
      setChannels(channels);

      channels.map((channel: MirakurunChannel) => {
        const services = channel.services
        const defaultService = services[0]
        mirakurun.fetchPrograms(defaultService.serviceId).then(fetchedPrograms => {
          data[defaultService.serviceId] = fetchedPrograms.slice(0, 30)  
        })
        return
      })

      setTimeout(() => {
        console.log('d', data)
        setPrograms(data)
      }, 1900)
    }

    run()
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
