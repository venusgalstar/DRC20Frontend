import { useCallback, useState, useEffect } from 'react'
import { getDoginalsFromCollection } from '@/api'
import { Doginal, DoginalsCollection } from '@/types/dogeNft'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

type DoginalsCollectionInfoProps = {
  doginalsCollectionInfo: DoginalsCollection | null
  supply: number
}
const DoginalsCollectionInfo = ({ doginalsCollectionInfo, supply }: DoginalsCollectionInfoProps) => {
  const symbol = doginalsCollectionInfo?.symbol

  const [doginalsData, setDoginalsData] = useState<{
    total: number
    doginals: Doginal[]
  }>()

  const fetchDoginalsData = useCallback(async () => {
    try {
      if (symbol && symbol.length > 0) {
        const { total, doginals } = await getDoginalsFromCollection(symbol, 1, 0, 'asc')
        setDoginalsData({ total, doginals })
        return
      }
    } catch (error) {
      console.error('Error fetching doginals data:', error)
    }
  }, [symbol])

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoginalsData()
    }
    fetchData()
  }, [fetchDoginalsData])

  let formattedDate = `Jun 2023`
  let floorPrice = 0

  if (doginalsCollectionInfo) {
    // format date
    const date = new Date(doginalsCollectionInfo.collectionCreationTimestamp)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    formattedDate = `${month} ${year}`

    // get floor price
    if (doginalsData?.doginals && doginalsData?.doginals.length > 0) {
      floorPrice = doginalsData.doginals[0].price
    } else {
      floorPrice = doginalsCollectionInfo.floorPrice || 0
    }
  }

  return (
    <div>
      {doginalsCollectionInfo && (
        <div className="flex flex-wrap md:w-[600px] w-[292px] max-w-2xl gap-1 -ml-1">
          <h1 className="text-4xl font-semibold w-full flex pb-4 items-center gap-1">
            <span>{doginalsCollectionInfo.name}</span>
          </h1>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
            <p>FLOOR: </p>
            <span className="flex items-center gap-1">
              <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />
              {(floorPrice / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
            <p>SUPPLY: </p>
            <span className="flex items-center gap-1">
              {doginalsCollectionInfo.supply ? doginalsCollectionInfo.supply : supply}
            </span>
          </div>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
            <p>HOLDERS:</p>
            <p>{doginalsCollectionInfo.holders || '0'}</p>
          </div>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
            <p>CREATED:</p>
            <p>{formattedDate}</p>
          </div>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs">
            <p>VOLUME: </p>
            <p className="flex items-center gap-1">
              <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />
              {(doginalsCollectionInfo.totalVolume / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="flex justify-between w-36 bg-account-page-default rounded-md p-2 text-xxs whitespace-nowrap overflow-x-auto">
            <p>LISTED: </p>
            <span className="">{doginalsCollectionInfo.totalListed}</span>
          </div>
          <div className="flex justify-between w-[292px] bg-account-page-default rounded-md p-2 text-xxs whitespace-nowrap overflow-x-auto">
            <p>RANGE: </p>
            <span className="flex items-center">
              {doginalsCollectionInfo.minInscriptionNumber} - {doginalsCollectionInfo.maxInscriptionNumber}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-left">{doginalsCollectionInfo.description}</p>
          </div>
        </div>
      )}
      {doginalsCollectionInfo === null && <div>Loading...</div>}
    </div>
  )
}

export default DoginalsCollectionInfo
