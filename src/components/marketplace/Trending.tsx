import { useCallback, useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { PaginationInfo } from '@/types/common'
import { Drc20Data } from '@/types/drc20'

import { DoginalsCollection } from '../../types/dogeNft'
import RefreshButton from '../RefreshButton'
import Search from '../Search'
import DoginalTrendingTable from './DoginalTrendingTable'
import Drc20TrendingTable from './Drc20TrendingTable'
import SortBy from './SortBy'
import TypeFilter from './TypeFilter'

export enum DisplayType {
  DOGINALS,
  DRC20,
}

export enum SortByTypes {
  VolumeDescending = 'Volume: High to Low',
  VolumeAscending = 'Volume: Low to High',
  PriceAscending = 'Price: Low to High',
  PriceDescending = 'Price: High to Low',
}

type TrendingProps = {
  dogeNftCollections: DoginalsCollection[]
  drc20List: Drc20Data[]
  dogePrice: number
  refetchData: () => void
  paginationInfo: PaginationInfo
  fetchDrc20ListByTick: (filterByTick: string) => Promise<void>
  fetchDogeNftByName: (filterByName: string) => Promise<void>
}

const getDisplayTabBySearchParams = (searchParams: URLSearchParams) => {
  const tab = searchParams.get('tab')
  if (tab === 'nfts') {
    return DisplayType.DOGINALS
  } else {
    return DisplayType.DRC20
  }
}

export const Trending = ({
  dogeNftCollections,
  drc20List,
  dogePrice,
  refetchData,
  paginationInfo,
  fetchDrc20ListByTick,
  fetchDogeNftByName,
}: TrendingProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [displayedType, setDisplayedType] = useState(getDisplayTabBySearchParams(searchParams))

  const [selectedSortType, setSelectedSortType] = useState<SortByTypes>(SortByTypes.VolumeDescending)
  const [searchValue, setSearchValue] = useState<string>('')
  const [isSorting, setIsSorting] = useState(false)

  const handleSearchClick = async () => {
    if (searchValue) {
      setIsSorting(true)
      if (displayedType === DisplayType.DRC20) {
        await fetchDrc20ListByTick(searchValue)
      } else {
        await fetchDogeNftByName(searchValue)
      }
      setIsSorting(false)
    } else {
      refetchData()
    }
  }

  const onSetDisplayedType = useCallback(
    (type: DisplayType) => {
      setSelectedSortType(SortByTypes.VolumeDescending)
      setSearchValue('')
      setDisplayedType(type)
      // set the tab to the query string
      searchParams.set('tab', type === DisplayType.DOGINALS ? 'nfts' : 'drc-20')
      navigate(`${location.pathname}?${searchParams.toString()}`)
    },
    [navigate, location.pathname, searchParams]
  )

  useEffect(() => {
    if (searchParams.get('tab') === 'nfts') {
      setDisplayedType(DisplayType.DOGINALS)
    } else {
      setDisplayedType(DisplayType.DRC20)
    }
  }, [searchParams])

  useMemo(() => {
    if (!searchValue) {
      refetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return (
    <div className="flex flex-col w-full md:mt-14">
      <div className="flex flex-row w-full">
        <TypeFilter displayedType={displayedType} setDisplayedType={onSetDisplayedType} />
        <div className="flex flex-row justify-end items-center pb-3 gap-2">
          <RefreshButton refetchData={refetchData} setIsSorting={setIsSorting} />
          <Search
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            handleSearchClick={handleSearchClick}
            displayedType={displayedType}
          />
        </div>
      </div>
      <SortBy selectedSortType={selectedSortType} setSelectedSortType={setSelectedSortType} />
      {displayedType === DisplayType.DOGINALS ? (
        <DoginalTrendingTable
          collections={dogeNftCollections}
          selectedSortType={selectedSortType}
          dogePrice={dogePrice}
          isSorting={isSorting}
          setIsSorting={setIsSorting}
          currentDogeNftPage={paginationInfo.currentDogeNftPage}
          totalDogeNftPages={paginationInfo.totalDogeNftPages}
          setCurrentDogeNftPage={paginationInfo.setCurrentDogeNftPage}
        />
      ) : (
        <Drc20TrendingTable
          drc20List={drc20List}
          selectedSortType={selectedSortType}
          dogePrice={dogePrice}
          isSorting={isSorting}
          setIsSorting={setIsSorting}
          currentDrc20Page={paginationInfo.currentDrc20Page}
          totalDrc20Pages={paginationInfo.totalDrc20Pages}
          setCurrentDrc20Page={paginationInfo.setCurrentDrc20Page}
        />
      )}
    </div>
  )
}

export default Trending
