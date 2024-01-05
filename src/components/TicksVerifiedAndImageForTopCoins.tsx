import { Popover, Tooltip } from 'antd'
import React, { useEffect, useState, useMemo, useCallback } from 'react';

export default function TicksVerifiedAndImageForTopCoins({
  row,
  index,
  featuredTicks,
}: {
  row: any
  index: number
  featuredTicks?: string[]
}) {
  const [imgSrc, setImgSrc] = useState(
    `https://drc-20-icons.s3.eu-central-1.amazonaws.com/${row.tick.toLowerCase()}.png`
  )
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
    }
  }

  const verifyTrustLevel = () => {
    if (row?.trustLevel === 0) {
      return '/ticks/caution.png'
    }

    if (row?.trustLevel === 2) {
      return '/ticks/verify.png'
    }

    return ''
  }

  useEffect(() => {
    const codes = getUtf8Codes(row.tick)
    setTickId(`ID: ${codes}`)
  }, [row, setTickId])

  const combinedStyleTrustLevel = {
    display: 'inline-block',
    width: '0.9rem',
    height: '0.9rem',
    borderRadius: '50%',
    marginLeft: '5px',
    marginBottom: '-3px',
    backgroundSize: 'cover',
    backgroundImage: `url(${verifyTrustLevel()})`,
  }

  const combinedStyleTickImage = {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    marginLeft: '16px',
    marginRight: '8px',
    marginBottom: '-3px',
    backgroundSize: 'cover',
    backgroundImage: `url(${imgSrc})`,
  }

  return (
    <div className="text-left text-sm">
      <span style={{ color: '#808a9d', fontSize: '12px' }}>{index + 1}</span>
      <div style={combinedStyleTickImage}>
        <img src={imgSrc} onError={handleError} alt="tick" style={{ display: 'none' }} />
      </div>
      <Popover content={tickId} trigger="hover" placement="right">
        <a href={`/drc20/${row.tick}`} rel="noopener noreferrer">
          <span style={{ fontWeight: 'bold', textAlign: 'left', color: '#000', textDecoration: 'none' }}>
            {row.tick}
          </span>
        </a>
      </Popover>
      <div style={combinedStyleTrustLevel}></div>
      {((featuredTicks && featuredTicks.includes(row.tick)) || row.featured) && (
        <div className="flex flex-row justify-center items-center ml-2">
          <img src="/ticks/featured.png" alt="featured" style={{ marginLeft: '-5px', height: '14px', width: '14px' }} />
        </div>
      )}
    </div>
  )
}
