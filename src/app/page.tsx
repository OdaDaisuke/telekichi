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
import { Loading } from '@/components/loading';
import { Warning } from '@/components/warning';

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
  const [selectedProgram, selectProgram] = useState<{
    ctype: string,
    cid: string,
    sid: number,
    program: MirakurunProgram
  } | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [channels, setChannels] = useState<MirakurunChannelList>([])
  const [programsPerService, setPrograms] = useState<ProgramsPerService>([])
  const [currentTime, setCurrentTime] = useState<number>((new Date()).getTime())
  const currentHour = new Date(currentTime).getHours()
  const d = new Date()
  const month = d.getMonth() + 1
  const today = d.getDate()

  useEffect(() => {
    setInterval(() => {
      setCurrentTime((new Date()).getTime())
    }, 1000 * 30)

    fetchData().then(data => {
      setChannels(data.channels)
      setPrograms(data.programsPerService)
      setLoaded(true)
    }).catch(e => {
      setLoaded(true)
      setError(e)
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

  if (!loaded) {
    return <div>
      <header className="fixed w-full" style={{backgroundColor: '#1F1F20'}}>
        <span className="block text-xl mt-4 font-italic">{month}月{today}日</span>
      </header>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="w-full h-screen">
        <Loading height={72} width={72} />
      </div>
    </div>
  }

  if (error != null) {
    return <div>
      <header className="fixed w-full" style={{backgroundColor: '#1F1F20'}}>
        <span className="block text-xl mt-4 font-italic">{month}月{today}日</span>
      </header>
      <div className="flex text-left content-center justify-start pt-32 w-full flex-wrap">
        <h2 className="w-full mb-1" style={{fontSize: '3.4rem'}}><Warning style={{height: '59px', width: '59px'}} />エラー発生</h2>
        <p className="w-full mb-16" style={{lineHeight: '1.8'}}>Mirakurunを起動してください。<br />
起動している場合は、設定が正しいかご確認ください。</p>
        <h4 className="w-full text-xl mb-2" style={{color: '#e0e0e0'}}>エラーメッセージ</h4>
        <p style={{color: '#e0e0e0'}}>{error.message}</p>
      </div>
    </div>
  }

  return (
    <div>
      <header className="fixed w-full" style={{backgroundColor: '#1F1F20'}}>
        <span className="block text-xl mt-4 font-italic">{month}月{today}日</span>
      </header>
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
