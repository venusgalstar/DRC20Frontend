import { useNavigate } from 'react-router'

import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

const DoginalTrendingTableRow = ({
  index,
  imageURI,
  name,
  symbol,
  floorPrice,
  volume,
  sales,
  holders,
  supply,
  dogePrice,
  totalListed,
  visible,
}: {
  index: number
  imageURI: string
  name: string
  symbol: string
  floorPrice: number
  volume: number
  sales: number
  holders: number
  supply: number
  dogePrice: number
  totalListed: number
  visible?: boolean
}) => {
  const navigator = useNavigate()

  const handleClick = (symbol: string) => {
    navigator(`/marketplace/doginals/${symbol}`)
  }
  return (
    <>
      {visible && (
        <tr className="text-xs w-full">
          <td className="py-5 text-left sticky left-0 bg-default-background">{index}</td>
          <td
            onClick={() => handleClick(symbol)}
            className="inline-flex items-center gap-2 py-5 text-left sticky table-cell-shadow-right left-5 bg-default-background cursor-pointer"
          >
            <img src={imageURI} alt="logo" className="w-7" style={{backgroundColor:'#fff'}}></img> {name}
          </td>
          <td className="py-5 text-left">
            <div className="flex flex-col whitespace-nowrap">
              <span>
                {totalListed > 0
                  ? (floorPrice / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : 0}{' '}
                DOGE
              </span>
              <span className="text-slate-500 text-xxxs">
                $
                {totalListed > 0
                  ? ((dogePrice * floorPrice) / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : 0}
              </span>
            </div>
          </td>
          <td className="py-5 text-left">
            <div className="flex flex-col whitespace-nowrap">
              <span>
                {Number(volume / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                DOGE
              </span>
              <span className="text-slate-500 text-xxxs">
                $
                {(dogePrice * Number(volume / ONE_DOGE_IN_SHIBES)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </td>
          <td className="py-5 text-left">{totalListed}</td>
          <td className="py-5 text-left">{sales}</td>
          <td className="py-5 text-left">{holders}</td>
          <td className="py-5 text-left">{supply}</td>
        </tr>
      )}
    </>
  )
}

export default DoginalTrendingTableRow
