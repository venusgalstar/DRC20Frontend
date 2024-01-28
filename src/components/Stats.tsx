import { useEffect, useState } from 'react';

import { fetchIntervall } from '@/utils/fetch'
import { currencyFormatter } from '@/utils/numberFormatter'

const Stats = () => {
  // Add state to track current and processed block height
  // @ts-ignore
  const [blockHeight, setBlockHeight] = useState(0)
  // @ts-ignore
  const [processedBlockHeight, setProcessedBlockHeight] = useState(0)
  const [totalVolume7d, setTotalVolume7d] = useState(0)
  const [totalMarketcap, setTotalMarketcap] = useState(0)
  const [counter, setCounter] = useState(0)

  // Function to fetch processed block height
  const fetchProcessedBlockHeight = async () => {
    const url = `${
      import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
    }stats/lastSyncedBlock`

    await fetchIntervall(
      url,
      async (response) => {
        if (response && response.status === 200) {
          const data = response.data
          setProcessedBlockHeight(data?.lastSyncedBlock)
          setBlockHeight(data?.blockHeight)
        }
        return null
      },
      45000
    )
  }

  const fetchMarketcap = async () => {
    const url = `${
      import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
    }stats/marketcap/all`

    await fetchIntervall(
      url,
      async (response) => {
        if (response && response.status === 200) {
          const data = response.data
          setTotalMarketcap(data?.drc20)
        }
        return null
      },
      45000
    )
  }

  const fetchVolume = async () => {
    const url = `${
      import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
    }stats/volume/trading/7d`

    await fetchIntervall(
      url,
      async (response) => {
        if (response && response.status === 200) {
          const data = response.data
          setTotalVolume7d(data.sum)
        }
        return null
      },
      45000
    )
  }

  useEffect(() => {
    const statsInterval = setInterval(() => setCounter(counter + 1), 15000)

    // clear on component unmount
    return () => {
      clearInterval(statsInterval)
    }
  }, [counter])

  // Fetch the block heights when the component mounts
  useEffect(() => {
    fetchProcessedBlockHeight()
    fetchVolume()
    fetchMarketcap()
  }, [])

  return (
    <div>
      <div className="show-mobile-only-flex" style={{backgroundColor:'#8EFFF1'}}>
        {counter % 3 === 0 ? (
          <>
            <span
              style={{
                color: '#000',
                fontSize: '11px',
                lineHeight: '48px',
                marginRight: '10px',
                textAlign: 'center',
              }}
            >
              Processed Blocks:
            </span>
            <span
              style={{
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '48px',
                textAlign: 'center',
              }}
            >
              {blockHeight > 0 ? `${processedBlockHeight} / ${blockHeight}` : processedBlockHeight}
            </span>
          </>
        ) : counter % 3 === 1 ? (
          <>
            <span
              style={{
                color: '#000',
                fontSize: '11px',
                lineHeight: '48px',
                marginRight: '10px',
                textAlign: 'center',
              }}
            >
              Overall Marketcap:
            </span>
            <span
              style={{
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '48px',
                textAlign: 'center',
              }}
            >
              {currencyFormatter(totalMarketcap)}
            </span>
          </>
        ) : (
          <>
            <span
              style={{
                color: '#000000',
                fontSize: '11px',
                lineHeight: '48px',
                marginRight: '10px',
                textAlign: 'center',
              }}
            >
              Volume 7d:
            </span>
            <span
              style={{
                color: '#000',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '48px',
                textAlign: 'center',
              }}
            >
              {currencyFormatter(totalVolume7d)}
            </span>
          </>
        )}
      </div>
      <div className="hide-mobile-flex">
        <span
          style={{
            color: '#000',
            fontSize: '11px',
            lineHeight: '48px',
            marginRight: '10px',
            textAlign: 'center',
          }}
        >
          Processed Blocks:
        </span>
        <span
          style={{
            color: '#000',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: '48px',
            marginRight: '8px',
            textAlign: 'center',
          }}
        >
          {blockHeight > 0 ? `${processedBlockHeight} / ${blockHeight}` : processedBlockHeight}
        </span>
        <span
          style={{
            color: '#000',
            fontSize: '11px',
            lineHeight: '48px',
            marginLeft: '70px',
            marginRight: '10px',
            textAlign: 'center',
          }}
        >
          Overall Marketcap:
        </span>
        <span
          style={{
            color: '#000',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: '48px',
            textAlign: 'center',
          }}
        >
          {currencyFormatter(totalMarketcap)}
        </span>
        <span
          style={{
            color: '#000',
            fontSize: '11px',
            lineHeight: '48px',
            marginLeft: '70px',
            marginRight: '10px',
            textAlign: 'center',
          }}
        >
          Volume 7d:
        </span>
        <span
          style={{
            color: '#000',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: '48px',
            marginRight: '70px',
            textAlign: 'center',
          }}
        >
          {currencyFormatter(totalVolume7d)}
        </span>
      </div>
    </div>
  )
}

export default Stats
