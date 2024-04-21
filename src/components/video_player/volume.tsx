interface Props {
  volume: number
  muted: boolean
  onChange: (volume: number) => void
  onToggleMute: () => void
}

export const Volume = (props: Props) => {
  return <div className="absolute left-40 bottom-4">
    <section className="cursor-pointer">
      <input
        type="range"
        min={0}
        max={1}
        step={0.02}
        value={props.volume}
        onChange={event => {
          props.onChange(event.target.valueAsNumber)
        }}
      />
      <button onClick={props.onToggleMute} className="ml-2">
        {props.muted && <span className="text-2xl i-lucide-volume-x"></span>}
        {!props.muted && <span className="text-2xl i-lucide-volume"></span>}
      </button>
    </section>
  </div>
}
