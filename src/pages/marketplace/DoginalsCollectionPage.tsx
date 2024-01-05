import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  getDogecoinPriceInUsd,
  getDoginalCollectionInfo,
  getDoginalsFromCollection,
  getDoginalsOffersList,
} from '@/api'
import ActivitySorter from '@/components/ActivitySorter'
import DoginalActivityTable from '@/components/doginals/DoginalActivityTable'
import DoginalFilter from '@/components/doginals/DoginalFilter'
import DoginalsCards from '@/components/doginals/DoginalsCards'
import DoginalsHeader from '@/components/doginals/DoginalsHeader'
import SortByPrice from '@/components/doginals/SortByPrice'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import RefreshButton from '@/components/RefreshButton'
import Search from '@/components/Search'
import TypeFilter from '@/components/TypeFilter'
import { ActiveButtonIndex, ActivitySortTypes } from '@/types/common'
import { Doginal, DoginalOffer, DoginalsCollection } from '@/types/dogeNft'

import PageBase from '../_base'

const ITEMS_PER_PAGE = 20

type DoginalsCollectionPageProps = {
  address: string
}

enum SortByPriceTypes {
  PriceAscending = 'Price: Low to High',
  PriceDescending = 'Price: High to Low',
}

type ToggleSwitchProps = {
  onChange: () => void
}
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onChange }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <span className="mr-2 text-base font-medium">Listed Only</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" onChange={onChange} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#FFB627]"></div>
      </label>
    </div>
  )
}

const DoginalsCollectionPage = ({ address }: DoginalsCollectionPageProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const symbol = pathname.split('/')[3]
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [searchValue, setSearchValue] = useState<string>('')
  const [activeButtonIndex, setActiveButtonIndex] = useState<ActiveButtonIndex>(ActiveButtonIndex.FIRST)
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()
  const [doginalsData, setDoginalsData] = useState<{
    total: number
    doginals: Doginal[]
  }>()
  const [doginalsCollectionInfo, setDoginalsCollectionInfo] = useState<DoginalsCollection | null>(null)
  const [doginalsCollectionOfferList, setDoginalsCollectionOfferList] = useState<DoginalOffer[]>([])
  const [showCollectionOffers, setShowCollectionOffers] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [selectedMetadata, setSelectedMetadata] = useState<Record<string, string>>({})
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  const [selectedTags, setSelectedTags] = useState<Record<string, string | null>>({})
  const [selectedSortType, setSelectedSortType] = useState<SortByPriceTypes>(SortByPriceTypes.PriceAscending)
  const [selectedActivitySortType, setSelectedActivitySortType] = useState<ActivitySortTypes | undefined>(undefined)
  const [activityRefresh, setAcitivityRefresh] = useState<boolean>()

  const ref = useRef<null | HTMLDivElement>(null)

  const fetchCollectionInfo = async (symbol: string) => {
    try {
      const { collection } = await getDoginalCollectionInfo(symbol)

      setDoginalsCollectionInfo(collection)

      if (collection && !collection.visible) {
        navigate('/marketplace')
      }
    } catch (error) {
      console.error('Error fetching collection info:', error)
      setDoginalsCollectionInfo(null) // Set to null in case of an error
    }
  }
  const fetchCollectionOfferList = async (symbol: string) => {
    try {
      const res = await getDoginalsOffersList(symbol)
      setDoginalsCollectionOfferList(res.offers)
    } catch (error) {
      console.error('Error fetching collection offers:', error)
    }
  }

  const fetchDoginalsData = useCallback(async () => {
    const metadataKey = Object.keys(selectedMetadata)[0] // Get the metadata key
    const metadataValue = selectedMetadata[metadataKey]
    try {
      setIsLoading(true)
      const { total, doginals } = await getDoginalsFromCollection(
        symbol,
        ITEMS_PER_PAGE,
        currentPage === 1 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
        selectedSortType === SortByPriceTypes.PriceAscending ? 'asc' : 'desc',
        metadataKey,
        metadataValue,
        showCollectionOffers ? true : undefined
      )
      setDoginalsData({ total, doginals })
      return setIsLoading(false)
    } catch (error) {
      console.error('Error fetching doginals data:', error)
    }
  }, [currentPage, selectedMetadata, selectedSortType, showCollectionOffers, symbol])

  useEffect(() => {
    if (doginalsData && doginalsData.total > 0) {
      setTotalPages(Math.ceil(doginalsData.total / ITEMS_PER_PAGE))
    } else {
      setTotalPages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doginalsData])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    ref.current?.scrollIntoView({ behavior: 'auto' })
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCollectionInfo(symbol)
      await fetchCollectionOfferList(symbol)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol])

  useEffect(() => {
    const fetchData = async () => {
      await fetchDoginalsData()
    }
    fetchData()
  }, [currentPage, fetchDoginalsData, symbol])

  useEffect(() => {
    const fetchDogePriceInUsd = async () => {
      try {
        const { res, err } = await getDogecoinPriceInUsd()

        if (err) {
          console.error(err)
          return
        }

        setDogecoinPriceInUsd(res!.data.dogePriceInUsd)
      } catch (error) {
        console.error('Error fetching Dogecoin price:', error)
      }
    }

    fetchDogePriceInUsd()
  }, [])

  const handleShowCollectionOffers = (showCollectionOffers: boolean) => {
    let metadataKey: string | undefined = undefined
    let metadataValue: string | undefined = undefined
    if (selectedMetadata) {
      metadataKey = Object.keys(selectedMetadata)[0]
      metadataValue = selectedMetadata[metadataKey]
    }
    fetchDoginalsData()
  }

  const handleMetadataChange = (metadata: Record<string, string>) => {
    if (metadata) {
      const metadataKey = Object.keys(metadata)[0]
      const metadataValue = metadata[metadataKey]

      setSelectedMetadata(metadata)
      setSelectedTags(metadata)

      fetchDoginalsData()
    } else {
      setSelectedMetadata({})
      setSelectedTags({})
      fetchDoginalsData()
    }
  }

  const handleRefreshButtonClick = async () => {
    setSelectedMetadata({})
    setSelectedTags({})
    await fetchDoginalsData()
  }
  return (
    <PageBase>
      <div className="flex flex-col gap-12">
        {doginalsCollectionInfo && doginalsData && (
          <DoginalsHeader doginalsCollectionInfo={doginalsCollectionInfo} supply={doginalsData?.total} />
        )}
        <div className="w-full">
          <div className={`flex flex-row w-full ${activeButtonIndex === ActiveButtonIndex.FIRST ? 'mb-8' : 'mb-2'}`}>
            <TypeFilter
              firstButtonContent="Market"
              secondButtonContent="Activity"
              setActiveButtonIndex={setActiveButtonIndex}
            />
            <div className="border-b-2 border-account-page-default w-full flex flex-row justify-end items-center pb-3 gap-2">
              <SortByPrice selectedSortType={selectedSortType} setSelectedSortType={setSelectedSortType} />
              <RefreshButton refetchData={handleRefreshButtonClick} setIsSorting={() => {}} />
              <Search searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>
          </div>
          <div className={`flex gap-x-2 "${filterOpen ? 'justify-between' : 'justify-center'}`}>
            {doginalsData && activeButtonIndex === ActiveButtonIndex.FIRST && (
              <DoginalFilter
                setSelectedTags={setSelectedTags}
                selectedTags={selectedMetadata}
                collectionSymbol={symbol}
                showCollectionOffers={showCollectionOffers}
                setShowCollectionOffers={setShowCollectionOffers}
                onMetadataChange={handleMetadataChange}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
              />
            )}
            {isLoading ? (
              <div className="w-full h-screen flex justify-center items-center">
                <LoadingView />
              </div>
            ) : (
              <>
                {doginalsData && activeButtonIndex === ActiveButtonIndex.FIRST ? (
                  <DoginalsCards
                    doginalsData={doginalsData.doginals}
                    doginalsImage={doginalsCollectionInfo?.imageURI}
                    filterOpen={filterOpen}
                    showCollectionOffers={showCollectionOffers}
                  />
                ) : (
                  <div>
                    <ActivitySorter
                      selectedSortType={selectedActivitySortType}
                      setSelectedSortType={setSelectedActivitySortType}
                    />
                    <DoginalActivityTable
                      collectionSymbol={symbol}
                      searchValue={searchValue}
                      dogecoinPriceInUsd={dogecoinPriceInUsd!}
                      activityType={selectedActivitySortType}
                      handleRefresh={() => setAcitivityRefresh(true)}
                    />
                  </div>
                )}
              </>
            )}
          </div>
          {activeButtonIndex === ActiveButtonIndex.FIRST && (
            <div className="flex mt-8 w-full justify-center">
              <nav className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="px-2 py-2 text-base font-medium text-gray-500 border border-r-0 border-gray-300 rounded-l-md cursor-pointer hover:bg-account-page-default"
                      style={{ backgroundColor: currentPage === 1 ? '#EFF2F5' : '' }}
                    >
                      <MdKeyboardDoubleArrowLeft />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                      style={{ backgroundColor: currentPage === 1 ? '#EFF2F5' : '' }}
                    >
                      <MdKeyboardArrowLeft />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                      style={{ backgroundColor: currentPage === totalPages ? '#EFF2F5' : '' }}
                    >
                      <MdKeyboardArrowRight />
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                      style={{ backgroundColor: currentPage === totalPages ? '#EFF2F5' : '' }}
                    >
                      <span className="flex">
                        <MdKeyboardDoubleArrowRight />
                      </span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </PageBase>
  )
}

export default DoginalsCollectionPage
