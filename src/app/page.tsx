"use client";
import { useState, useEffect } from 'react';
import { EPGHeader } from '@/components/epg/header';
import { EPGTimeScale } from '@/components/epg/time_scale';
import { EPGBody, ProgramsPerService } from '@/components/epg/body';
import { MirakurunChannelList, MirakurunChannel } from "@/models/mirakurun";
import { mirakurun } from '@/gateway/mirakurun';

const fetchData = async () => {
  const channels = await mirakurun.fetchChannels();
  // ID小さい順にソート
  channels.sort((a, b) => {
    return parseInt(a.channel, 10) - parseInt(b.channel, 10)
  })

  const promises: Array<Promise<null>> = []
  const programsPerService: ProgramsPerService = []
  channels.map((channel: MirakurunChannel) => {
    const services = channel.services
    const defaultService = services[0]
    const p = new Promise<null>((resolve, reject) => {
      mirakurun.fetchPrograms(defaultService.serviceId).then(fetchedPrograms => {
        programsPerService.push({
          channelType: channel.type,
          channelId: channel.channel,
          serviceId: defaultService.id,
          programs: fetchedPrograms.slice(0, 1000),
        })
        resolve(null)
      })
    })
    promises.push(p)
  })

  await Promise.all(promises)
  return {
    channels,
    programsPerService,
  }
}

// 番組表ページ
export default function EPG() {
  const [channels, setChannels] = useState<MirakurunChannelList>([])
  const [programsPerService, setPrograms] = useState<ProgramsPerService>([])
  const [currentTime, setCurrentTime] = useState<number>((new Date()).getTime())
  const currentHour = new Date(currentTime).getHours()

  useEffect(() => {
    setInterval(() => {
      setCurrentTime((new Date()).getTime())
    }, 1000 * 30)

    fetchData().then(data => {
      setChannels(data.channels)
      setPrograms(data.programsPerService)
    })
  }, [])

  const headerLabels: Array<string> = []
  channels.forEach(channel => {
    headerLabels.push(channel.name)
  })
  return (
    <div>
      <EPGHeader channels={channels}/>
      <div className="flex">
        <EPGTimeScale currentHour={currentHour}/>
        <EPGBody programsPerService={programsPerService} currentTime={currentTime}/>
      </div>
    </div>
  );
}
