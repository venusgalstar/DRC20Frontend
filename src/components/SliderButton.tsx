import { Button } from 'antd'

export type SliderButtonProps = {
  isDisabled?: boolean
  onClick?: () => void
  text?: string
  style?: React.CSSProperties
}

const SliderButton = ({
  text = 'Confirm',
  isDisabled,
  onClick,
  style = {
    background: '#feb628',
    border: 'none',
    borderRadius: '16px',
    color: 'white',
    fontWeight: 'bold',
    height: '40px',
    margin: '48px 0 16px 0',
    width: '260px',
  },
}: SliderButtonProps) => {
  return (
    <Button disabled={isDisabled} style={style} onClick={onClick}>
      {text}
    </Button>
  )
}

export default SliderButton
