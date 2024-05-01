import { MirakurunChannelList } from "@/models/mirakurun";

const EPGHeaderItem = (props: {
  label: string
}) => {
  return <div className="flex-grow-0 flex-shrink-0 w-40 text-center px-2 pt-1 pb-2">
    <h3 className="font-bold">{props.label}</h3>
  </div>
}

interface EPGHeaderProps {
  channels: MirakurunChannelList
}

export const EPGHeader = (props: EPGHeaderProps) => {
  return <header className="flex">
    <div className="flex-grow-0 flex-shrink-0 block w-6"></div>
    {props.channels.map((channel, index) => {
      return <EPGHeaderItem key={index} label={channel.name} />
    })}
  </header>
}
