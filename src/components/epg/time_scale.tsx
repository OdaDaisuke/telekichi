interface EPGTimeScaleProps {
  currentHour: number
}

export const EPGTimeScale = (props: EPGTimeScaleProps) => {
  const hours = Array.from({ length: 24 }, (_, index) => index);
  return <div className="flex-grow-0 flex-shrink-0 w-6">
    {hours.map((hour, index) => {
      return <Item key={index} hour={hour} isActive={props.currentHour === hour} />
    })}
  </div>
}

const Item = (props: {
  hour: number,
  isActive?: boolean
}) => {
  if (props.isActive) {
    return <div className="w-5 text-sm flex justify-center items-center font-bold h-32 [&:not(:last-child)]:border-yellow-500 bg-yellow-500 text-black">{props.hour}</div>
  }

  return <div className="w-5 text-sm flex justify-center items-center font-bold h-32 [&:not(:last-child)]:border-b-2 border-indigo-500">{props.hour}</div>
}
