"use client"
import { useEffect, useRef, useState } from 'react';
import { MirakurunProgram } from "@/models/mirakurun";
import { EPGIndicator } from './indicator';
import { MirakurunPrograms } from '@/object_value/programs';

// 1時間=1セルとした時のセルの高さ
const baseColumnCellHeight = 288
// 番組表全体の高さ
const egpHeight = baseColumnCellHeight * 24

export type ProgramsPerService = Array<{
  channelType: string,
  channelId: string,
  serviceId: number
  programs: Array<MirakurunProgram>
}>

interface EPGBodyProps {
  programsPerService: ProgramsPerService
  currentTime: number
  onClickCell: (pid: number) => void
}

export const EPGBody = (props: EPGBodyProps) => {
  const [height, setHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [ref])

  const columns: Array<React.ReactElement> = []
  props.programsPerService.map((channelAndPrograms) => {
    columns.push(<BodyColumn
      key={channelAndPrograms.serviceId}
      programs={channelAndPrograms.programs}
      currentTime={props.currentTime}
      channelType={channelAndPrograms.channelType}
      channelId={channelAndPrograms.channelId}
      serviceId={channelAndPrograms.serviceId}
      onClickCell={props.onClickCell}
    />)
  })

  return <div ref={ref} className="w-full flex relative">
    <EPGIndicator currentTime={props.currentTime} parentHeight={height} />
    {columns}
  </div>
}

const BodyColumn = (props: {
  programs: Array<MirakurunProgram>,
  currentTime: number,
  channelType: string,
  channelId: string,
  serviceId: number,
  onClickCell: (pid: number) => void
}) => {
  const programs = new MirakurunPrograms(props.programs)
  const todayPrograms = programs.filterByToday(props.currentTime).sortByStartAt()

  const rawStartAtSeconds = todayPrograms.getLatestStartAtSeconds(props.currentTime)

  // 5分単位で丸める
  const mod = rawStartAtSeconds % 300
  const startAtSeconds = (mod < 150) ? rawStartAtSeconds - mod : rawStartAtSeconds + (300 - mod)
  const offsetPercentage = startAtSeconds / 86400

  // 時間をもとに始点のy座標を決める
  const paddingTop = egpHeight * offsetPercentage

  const items = todayPrograms.programs.map((program, index) => {
    return <BodyColumnItem
      key={index}
      program={program}
      channelId={props.channelId}
      channelType={props.channelType}
      serviceId={props.serviceId}
      currentTime={props.currentTime}
      onClick={props.onClickCell} />
  })
  return <div style={{paddingTop: `${paddingTop}px`, height: `${egpHeight}px`, overflow: 'hidden', borderRight: '1px dotted #fff'}} className="flex-grow-0 flex-shrink-0 w-40">
    {items}
  </div>
}

const BodyColumnItem = (props: {
  program: MirakurunProgram,
  currentTime: number,
  channelId: string,
  channelType: string,
  serviceId: number,
  onClick: (pid: number) => void
}) => {
  const { id, name, description, startAt, duration } = props.program
  const minutes = new Date(startAt).getMinutes()
  const hours = (duration / 1000) / 3600
  const height = parseInt(`${baseColumnCellHeight * hours}`)

  const baseClass = `p-2 text-black border-gray-500 border-b-2 overflow-hidden`
  const normalClass = baseClass + " bg-white hover:opacity-85"
  const activeClass = baseClass + " bg-yellow-200 hover:opacity-85"
  const endedClass = baseClass + " bg-gray-400"

  const isActive = startAt <= props.currentTime && props.currentTime < startAt + duration
  const isEnded = startAt + duration < props.currentTime

  let selectedClass = normalClass

  if (isActive) {
    selectedClass = activeClass
  } else if (isEnded) {
    selectedClass = endedClass
  }

  return <div className={selectedClass} style={{height: `${height}px`}}>
    {isEnded && <div>
      <span className="inline-block text-xs mr-1 text-gray-500">{minutes}</span>{name}
    </div>}
    {!isEnded && <span
      onClick={() => {props.onClick(id)}}
      className="inline-block font-bold text-base mb-1 cursor-pointer"
    >
      <span className="inline-block font-bold text-base mb-1 cursor-pointer inline-block text-xs mr-1 text-gray-500">{minutes}</span>{name}
    </span>}
    {hours > 0.7 && <span className="block text-sm text-gray-600">{description}</span>}
  </div>
}
