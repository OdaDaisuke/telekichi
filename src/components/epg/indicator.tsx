interface EPGIndicatorProps {
  currentTime: number
  parentHeight: number
}

// 現在時刻インジケータ
export const EPGIndicator = (props: EPGIndicatorProps) => {
  const maxMin = 60 * 24

  const d = new Date(props.currentTime)
  const h = d.getHours()
  const m = d.getMinutes()

  const current = h * 60 + m
  const currentPercentage = (current / maxMin) * 100

  const displayH = `0${h}`.slice(-2)
  const displayM = `0${m}`.slice(-2)
  const displayLabel = `${displayH}:${displayM}`

  return <div className="absolute l-0 left-0 w-full h-1" style={{top: `${currentPercentage}%`, left: '-4px'}}>
    <span className="absolute bg-yellow-500 l-2 z-30" style={{background:'rgb(235 179 5)', top:0,height: 'calc(tan(60deg) * 18px / 2)', width: '9px', clipPath: 'polygon(0 50%, 100% 0, 100% 100%)'}}></span>
    <span className="absolute text-black font-bold text-xs bg-yellow-500 z-30 pr-1" style={{left: 9}}>{displayLabel}</span>
    <span className="absolute bg-yellow-500 z-20" style={{height: '1px',width:'100%',left: 10, top: '7px'}}></span>
  </div>
}
