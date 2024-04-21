import { EPGHeader } from '@/components/epg/header';
import { EPGTimeScale } from '@/components/epg/time_scale';
import { EPGBody } from '@/components/epg/body';
import { MirakurunEvent } from "@/models/mirakurun";
import { mirakurun } from '@/gateway/mirakurun';

// 番組表ページ
export default async function EPG() {
  const headerLabels = [
    "NHK総合１・東京",
    "NHKEテレ１・東京",
    "日テレ１",
    "テレビ朝日",
    "TBS１",
    "テレビ東京１",
  ]

  const sampleProgram = await mirakurun.fetchEventInfo(1)
  const currentHour = (new Date()).getHours()
  const programs = new Map<string, Array<MirakurunEvent>>()
  programs.set("16", [
    sampleProgram, sampleProgram, sampleProgram,
  ])

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
