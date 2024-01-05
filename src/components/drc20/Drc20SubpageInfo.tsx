import { useNavigate } from 'react-router'
import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { drc20TrustLevel } from '@/api'
import { TrustLevel } from '@/utils/constants'

type Drc20SubpageInfoProps = {
  tick: string
  floorPrice: string
  volume: string
  holders: string
  sales: string
  dailyVolume: string
}

const Drc20SubpageInfo = ({ tick, floorPrice, volume, holders, sales, dailyVolume }: Drc20SubpageInfoProps) => {
  const navigate = useNavigate()
  const [trustLevel, setTrustLevel] = useState<TrustLevel>(TrustLevel.NORMAL)

  const fetchDrc20TrustLevel = async () => {
    const trustLevel = await drc20TrustLevel(tick)

    setTrustLevel(trustLevel)
  }

  useEffect(() => {
    fetchDrc20TrustLevel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return (
    <div>
      <div className="flex flex-wrap max-w-lg gap-1">
        <h1 className="text-4xl font-semibold w-full flex pb-4 items-center gap-1">
          <span className="hover:cursor-pointer" onClick={() => navigate(`/drc20/${tick}`)}>
            {tick}
          </span>
          {trustLevel === TrustLevel.TRUSTWORTHY && (
            <img src={'/images/verifiedIcon.svg'} alt="verified" className="w-6" />
          )}
          {trustLevel === TrustLevel.UNTRUSTWORTHY && (
            <img src={'/images/dangerIcon.png'} alt="danger" className="w-6" />
          )}
        </h1>
        <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
          <p>PRICE: </p>
          <span className="flex items-center gap-1">
            <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />
            {floorPrice}
          </span>
        </div>
        <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
          <p>VOLUME: </p>
          <span className="flex items-center gap-1">
            <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />
            {volume}
          </span>
        </div>
        <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
          <p>HOLDERS:</p>
          <p>
            {Number(holders).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
          <p>SALES: </p>
          <p>
            {Number(sales).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs whitespace-nowrap overflow-x-auto">
          <p>24H VOLUME: </p>
          <span className="flex items-center gap-1">
            <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />
            {dailyVolume}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Drc20SubpageInfo
