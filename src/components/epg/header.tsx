const EPGHeaderItem = (props: {
  label: string
}) => {
  return <div className="flex-grow-0 flex-shrink-0 w-40 text-center px-2 pt-1 pb-2">
    <h3 className="font-bold">{props.label}</h3>
  </div>
}

interface EPGHeaderProps {
  labels: Array<string>
}

export const EPGHeader = (props: EPGHeaderProps) => {
  return <header className="flex">
    <div className="flex-grow-0 flex-shrink-0 block w-6"></div>
    {props.labels.map((label, index) => {
      return <EPGHeaderItem key={index} label={label} />
    })}
  </header>
}
