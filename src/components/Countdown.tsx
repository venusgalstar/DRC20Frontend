import CountdownAntd from 'antd/lib/statistic/Countdown'
import React from 'react'

type CountdownProps = {
  value: number
  onFinish?: () => void
  containerStyle?: React.CSSProperties
  itemStyle?: React.CSSProperties
}

const CountdownItem = ({ value, style }: { value: any; style: any }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: '#FFB627',
      color: '#FFF',
      margin: '4px',
      padding: '4px 0',
      borderRadius: '0px',
      height: '28px',
      width: '36px',
      textAlign: 'center',
      ...style,
    }}
  >
    {value}
  </span>
)

const Countdown = ({ value, onFinish, containerStyle, itemStyle }: CountdownProps) => {
  const [remainingMilliseconds, setRemainingMilliseconds] = React.useState<number>(0)

  const days = Math.floor(remainingMilliseconds / 1000 / 86400)
  const hours = Math.floor((remainingMilliseconds / 1000 / 3600) % 24)
  const minutes = Math.floor(((remainingMilliseconds / 1000) % 3600) / 60)
  const seconds = Math.floor(((remainingMilliseconds / 1000) % 3600) % 60)

  return (
    <div style={containerStyle}>
      <CountdownAntd
        title=""
        value={value}
        format=""
        onChange={(val) => setRemainingMilliseconds(val as number)}
        onFinish={onFinish}
      />
      <CountdownItem value={`${days}d`} style={itemStyle} />
      <CountdownItem value={`${hours}h`} style={itemStyle} />
      <CountdownItem value={`${minutes}m`} style={itemStyle} />
      <CountdownItem value={`${seconds}s`} style={itemStyle} />
    </div>
  )
}

export default Countdown
