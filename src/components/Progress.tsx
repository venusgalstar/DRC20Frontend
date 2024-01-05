import { Progress as AntdProgress } from 'antd'

type ProgressProps = {
  percent: number
  strokeColor: string
  size?: 'small' | 'large'
}

const Progress = ({ percent, strokeColor, size = 'large' }: ProgressProps) => {
  if (size === 'small') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '24px 24px 24px 0px' }}>
        <span style={{ display: 'inline-block', fontWeight: 'bold', lineHeight: 'initial' }}>{`${percent} %`}</span>
        <AntdProgress percent={percent} strokeColor={strokeColor} strokeWidth={5} showInfo={false} />
      </div>
    )
  } else {
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBlock: '24px' }}>
        <AntdProgress percent={percent} strokeColor={strokeColor} strokeWidth={10} showInfo={false} />
        <div style={{ fontWeight: 'bold', width: '80px' }}>{`${percent} %`}</div>
      </div>
    )
  }
}

export default Progress
