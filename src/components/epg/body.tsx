"use client"
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MirakurunProgram } from "@/models/mirakurun";
import { EPGIndicator } from './indicator';

type DefaultServiceId = number

interface EPGBodyProps {
  programs: {[defaultServiceId: DefaultServiceId]: Array<MirakurunProgram>}
  currentTime: number
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
  Object.entries(props.programs).forEach(([serviceId, programs]) => {
    columns.push(<BodyColumn key={serviceId} programs={programs} currentTime={props.currentTime} />)
  })

  // TODO: 現在時刻のとこまで自動スクロール

  return <div ref={ref} className="w-full flex relative">
    <EPGIndicator currentTime={props.currentTime} parentHeight={height} />
    {columns}
  </div>
}

const baseColumnHeight = 288
const BodyColumnItem = (props: {
  program: MirakurunProgram,
  currentTime: number,
}) => {
  const { name, description, startAt, duration, eventId } = props.program
  const minutes = new Date(startAt).getMinutes()
  const hours = (duration / 1000) / 3600
  const height = parseInt(`${baseColumnHeight * hours}`)

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
    {(!isEnded) && <Link
      className="inline-block font-bold text-base mb-1 cursor-pointer"
      href={{ pathname: '/play', query: { pid: eventId }}}
    >
      <span className="inline-block text-xs mr-1 text-gray-500">{minutes}</span>{name}
    </Link>}
    {isEnded && <div>
      <span className="inline-block text-xs mr-1 text-gray-500">{minutes}</span>{name}
    </div>}
    {hours > 0.7 && <span className="block text-sm text-gray-600">{description}</span>}
  </div>
}

const BodyColumn = (props: {
  programs: Array<MirakurunProgram>,
  currentTime: number,
}) => {
  const items = props.programs.map((program, index) => {
    return <BodyColumnItem key={index} program={program} currentTime={props.currentTime} />
  })
  return <div className="flex-grow-0 flex-shrink-0 w-40">
    {items}
  </div>
}
