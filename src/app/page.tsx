"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EPGHeader } from '@/components/epg/header';
import { EPGTimeScale } from '@/components/epg/time_scale';
import { EPGBody, ProgramsPerService } from '@/components/epg/body';
import { MirakurunChannelList, MirakurunChannel, MirakurunProgram } from "@/models/mirakurun";
import { mirakurun } from '@/gateway/mirakurun';
import { AppButton } from '@/components/button';

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
          serviceId: defaultService.serviceId,
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
  const router = useRouter()
  const [selectedProgram, selectProgram] = useState<{
    ctype: string,
    cid: string,
    sid: number,
    program: MirakurunProgram
  } | null>(null)
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

  const onClickCloseProgramInfo = () => {
    selectProgram(null)
  }

  const onClickCell = (pid: number) => {
    console.log('pid', pid)
    programsPerService.map((programs) => {
      const ctype = programs.channelType
      const cid = programs.channelId
      const sid = programs.serviceId
      const filtered = programs.programs.filter((program) => program.id === pid)
      if (filtered.length > 0) {
        selectProgram({
          ctype,
          cid,
          sid,
          program: filtered[0],
        })
        return
      }
    })
  }

  return (
    <div>
      <EPGHeader channels={channels}/>
      <div className="flex">
        <EPGTimeScale currentHour={currentHour}/>
        <EPGBody programsPerService={programsPerService} currentTime={currentTime} onClickCell={onClickCell} />
      </div>
      <div>
        {selectedProgram !== null && <div className="fixed right-0 top-0 h-screen w-96 p-4 bg-gray-800">
          <div onClick={onClickCloseProgramInfo} className="cursor-pointer">
            <span className="text-5xl i-lucide-circle-x mb-2"></span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{selectedProgram.program.name}</h3>
          <p className="mb-2">{selectedProgram.program.description}</p>
          <div className="text-gray-200 text-xs">{(new Date(selectedProgram.program.startAt).toDateString())}</div>
          <div>
            <AppButton>
              <Link
                href={{ pathname: '/play', query: { ctype: selectedProgram.ctype, cid: selectedProgram.cid, sid: selectedProgram.sid, pid: selectedProgram.program.id }}}
                target="_blank"
              >視聴</Link>
            </AppButton>
            <AppButton>
              <Link
                href={{ pathname: '/recording/setting/upsert', query: { ctype: selectedProgram.ctype, cid: selectedProgram.cid, sid: selectedProgram.sid, pid: selectedProgram.program.id }}}
                target="_blank"
              >録画する</Link>
            </AppButton>
          </div>
        </div>}
      </div>
    </div>
  );
}
