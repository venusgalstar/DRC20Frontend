import { Popover } from 'antd'
import { useEffect, useState } from 'react';

export default function TicksVerifiedAndImage({
  tick,
  trustLevel,
  featuredTicks,
  featured,
  width,
  height,
}: {
  tick: string
  trustLevel: number
  featuredTicks?: string[]
  featured?: boolean
  width?: string
  height?: string
}) {
  const [imgSrc, setImgSrc] = useState(`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tick.toLowerCase()}.png`)
  const [hasError, setHasError] = useState(false)
  const [tickId, setTickId] = useState('0')

  function getUtf8Codes(str: string) {
    const encoder = new TextEncoder()
    const utf8Bytes = encoder.encode(str)

    return utf8Bytes.join(' ')
  }

  const handleError = () => {
    if (!hasError) {
      setImgSrc('/ticks/noicon.png')
      setHasError(true)
      // console.log('error', row.tick, imgSrc, '/ticks/noicon.png')
    }
  }

  const verifyTrustLevel = () => {
    if (trustLevel === 0) {
      return '/ticks/caution.png'
    }

    if (trustLevel === 2) {
      return '/ticks/verify.png'
    }

    return ''
  }

  useEffect(() => {
    const codes = getUtf8Codes(tick)
    setTickId(`ID: ${codes}`)
  }, [tick, setTickId])

  const combinedStyleTrustLevel = {
    height: '16px',
    width: '16px',
    borderRadius: '100%',
    alignSelf: 'center',
    marginLeft: '5px',
    backgroundSize: 'cover',
    backgroundImage: `url(${verifyTrustLevel()})`,
  }

  const combinedStyleTickImage = {
    height: `${height || '24px'}`,
    width: `${width || '24px'}`,
    borderRadius: '100%',
    alignSelf: 'center',
    marginRight: '8px',
    backgroundSize: 'cover',
    backgroundImage: `url(${imgSrc})`,
  }

  return (
    <div className="flex flex-row justify-start pl-4 table-cell-shadow-right" style={{ minWidth: '100px' }}>
      <div style={combinedStyleTickImage}>
        <img src={imgSrc} onError={handleError} alt="tick" style={{ display: 'none' }} />
      </div>
      <Popover content={tickId} trigger="hover" placement="right">
        <a href={`/drc20/${tick}`} rel="noopener noreferrer">
          <span
            style={{
              fontWeight: 'bold',
              textAlign: 'left',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            {tick}
          </span>
        </a>
      </Popover>
      <div style={combinedStyleTrustLevel}></div>
      {((featuredTicks && featuredTicks.includes(tick)) || featured) && (
        <div className="flex flex-row justify-center items-center ml-2">
          <img src="/ticks/featured.png" alt="featured" style={{ marginLeft: '-5px', height: '14px', width: '14px' }} />
        </div>
      )}
    </div>
  )
}
