import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getDrc20Data } from '@/api'
import { AssetTransferTab } from '@/pages/AccountPage'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

import Drc20SubpageInfo from './Drc20SubpageInfo'

type Drc20SubpageProps = {
  tick: string
}

const Drc20SubpageHeader = ({ tick }: Drc20SubpageProps) => {
  const [floorPrice, setFloorPrice] = useState<string>('0')
  const [volume, setVolume] = useState<string>('0')
  const [holders, setHolders] = useState<string>('0')
  const [sales, setSales] = useState<string>('0')
  const [dailyVolume, setDailyVolume] = useState<string>('0')
  const [currentSupply, setCurrentSupply] = useState<string>('0')
  const [maxSupply, setMaxSupply] = useState<string>('0')
  const [mintedSupplyPercentage, setMintedSupplyPercentage] = useState<string>('0')

  useEffect(() => {
    const fetchDrc20Data = async () => {
      const { res, err } = await getDrc20Data(tick)

      if (err) {
        return
      }

      const drc20Data = res!.data

      setFloorPrice(
        (drc20Data.floorPrice / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 6,
        })
      )
      setVolume(
        (drc20Data.volume / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      )
      setDailyVolume(
        (drc20Data.twentyFourHourVolume / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      )
      setHolders(drc20Data.holders.toString())
      setSales(drc20Data.sales.toString())
      setCurrentSupply(drc20Data.currentSupply)
      setMaxSupply(drc20Data.maxSupply)
      setMintedSupplyPercentage(
        Math.round((Number(drc20Data.currentSupply) / Number(drc20Data.maxSupply)) * 100).toString()
      )
    }

    fetchDrc20Data()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="w-full flex flex-col gap-8 border-2 border-account-page-background rounded-lg bg-account-info-background px-3 py-8 md:px-6 lg:px-10 lg:py-14">
      <div className="w-full flex xxs:justify-between lg:justify-start lg:gap-8">
        <img
          className="w-28 lg:h-28 rounded-full"
          src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tick.toLowerCase()}.png`}
          alt="Drc20"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.src = '/ticks/noicon.png')}
        />
        <div className="xxs:hidden lg:flex lg:min-w-lg" style={{color:'#000'}}>
          <Drc20SubpageInfo
            tick={tick}
            floorPrice={floorPrice}
            volume={volume}
            holders={holders}
            sales={sales}
            dailyVolume={dailyVolume}
          />
        </div>
        <div className="w-full flex justify-end items-center lg:pt-4">
          <Link to={`/account?activeTab=${AssetTransferTab.Drc20}`}>
            <button className="bg-selected-color xxs:px-2 xs:px-6 py-2 rounded-lg text-white font-semibold xs:whitespace-nowrap">
              LIST FOR SALE
            </button>
          </Link>
        </div>
      </div>
      <div className="lg:hidden w-full">
        <Drc20SubpageInfo
          tick={tick}
          floorPrice={floorPrice}
          volume={volume}
          holders={holders}
          sales={sales}
          dailyVolume={dailyVolume}
        />
      </div>
      <div className="w-full flex justify-end">
        <div className="flex flex-col w-full lg:w-[95%] gap-2">
          <div className="flex flex-row justify-between text-xs">
            <span className="inline-flex xxs:text-xxs xs:text-xs">
              MINTED:{' '}
              {Number(currentSupply).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="inline-flex xxs:text-xxs xs:text-xs">
              SUPPLY:{' '}
              {Number(maxSupply).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="bg-account-page-background rounded-lg">
            <div style={{ width: `${mintedSupplyPercentage}%` }} className={`bg-selected-color p-1 rounded-lg`}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drc20SubpageHeader
