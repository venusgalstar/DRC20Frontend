import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { ONE_DOGE_IN_SHIBES, TrustLevel } from '@/utils/constants'

import { drc20TrustLevel } from '../../api'
import SupplyProgressBar from './SupplyProgressBar'

const Drc20TrendingTableRow = ({
  index,
  tick,
  price,
  volume,
  percentPriceChange,
  // transactions,
  holders,
  currentSupply,
  maxSupply,
  dogePrice,
}: {
  index: number
  tick: string
  price: number
  volume: number
  percentPriceChange?: number
  // transactions: number
  holders: number
  currentSupply: number
  maxSupply: number
  dogePrice: number
}) => {
  const navigator = useNavigate()
  const [trustLevel, setTrustLevel] = useState<TrustLevel>(TrustLevel.NORMAL)

  const fetchDrc20TrustLevel = async () => {
    const trustLevel = await drc20TrustLevel(tick)

    setTrustLevel(trustLevel)
  }

  const handleClick = (tick: string) => {
    navigator(`/marketplace/drc20/${tick}`)
  }

  useMemo(() => {
    fetchDrc20TrustLevel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const formatPercentPriceChange = (priceChange: number) => {
    return Math.round(priceChange)
  }

  const handleTextColor = (percentPriceChange: number) => {
    return percentPriceChange < 0 ? 'text-[#E82C44]' : 'text-[#23D581]'
  }

  return (
    <>
      <tr className="text-xs w-full">
        <td className="py-5 text-left sticky left-0 marketplace-table-cell-shadow-right xxs:bg-similar-to-bg-color tableScrollBreakpoint:bg-inherit">
          <span className="flex items-center">
            <span className="pr-4">{index}</span>
            <a onClick={() => handleClick(tick)} className="flex items-center gap-2">
              <img
                className="w-7 object-cover rounded-2xl"
                src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tick.toLowerCase()}.png`}
                alt="Drc20"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                  (e.currentTarget.src = '/ticks/noicon.png')
                }
              />{' '}
              {tick}
              {trustLevel === TrustLevel.TRUSTWORTHY && (
                <img src={'/images/verifyIcon.png'} alt="verified" className="h-3 w-3" />
              )}
              {trustLevel === TrustLevel.UNTRUSTWORTHY && (
                <img src={'/images/dangerIcon.png'} alt="danger" className="h-3 w-3" />
              )}
            </a>
          </span>
        </td>
        {/* <td className="py-5 text-left sticky table-cell-shadow-right left-6 bg-default-background">
          <a onClick={() => handleClick(tick)} className="inline-flex items-center gap-2">
            <img
              className="w-7 object-cover rounded-2xl"
              src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tick.toLowerCase()}.png`}
              alt="Drc20"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = '/ticks/noicon.png')
              }
            />{' '}
            {tick}
            {trustLevel === TrustLevel.TRUSTWORTHY && (
              <img src={'/images/verifyIcon.png'} alt="verified" className="h-3 w-3" />
            )}
            {trustLevel === TrustLevel.UNTRUSTWORTHY && (
              <img src={'/images/dangerIcon.png'} alt="danger" className="h-3 w-3" />
            )}
          </a>
        </td> */}
        <td className="py-5 text-left pl-5">
          <div className="flex flex-col">
            <span>
              {(price / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              DOGE
            </span>
            <span className="text-slate-500 text-xxxs">
              $
              {(dogePrice * (price / ONE_DOGE_IN_SHIBES)).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </td>
        <td className="py-5 text-left">
          <div className="flex flex-col whitespace-nowrap">
            <span>
              {(volume / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              DOGE
            </span>
            <span className="text-slate-500 text-xxxs">
              $
              {(dogePrice * (volume / ONE_DOGE_IN_SHIBES)).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </td>
        {typeof percentPriceChange === 'number' ? (
          <td className={`${handleTextColor(percentPriceChange)} py-5 text-left`}>
            {percentPriceChange > 0 ? '+' : ''}
            {percentPriceChange.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            %
          </td>
        ) : (
          <td className="py-5 text-left">0%</td>
        )}
        {/* <td className="py-5 text-left">{transactions}</td> */}
        <td className="py-5 text-left">
          <div className="flex flex-col">
            <span>
              $
              {(dogePrice * (price / ONE_DOGE_IN_SHIBES) * currentSupply).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </td>
        <td className="py-5 text-left">{holders}</td>
        <td className="py-5 text-left">
          <SupplyProgressBar currentSupply={currentSupply} maxSupply={maxSupply} />
        </td>
      </tr>
    </>
  )
}

export default Drc20TrendingTableRow
