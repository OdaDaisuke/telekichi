interface Props {
  onClick: () => void
}

export const GoBack = (props: Props) => {
  return <div onClick={props.onClick} className="absolute top-2 left-2 cursor-pointer">
    <span className="text-7xl i-lucide-chevron-left"></span>
  </div>
}
