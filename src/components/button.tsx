interface Props {
  onClick?: () => void
  children: React.ReactNode
}

export const AppButton = (props: Props) => {
  return <button onClick={props.onClick} className="border mr-2 mt-2 px-6 py-2">
    {props.children}
  </button>
}