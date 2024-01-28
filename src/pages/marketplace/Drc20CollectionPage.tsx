import { useLocation } from 'react-router-dom'
import { useCallback, useState, useEffect } from 'react'
import { getDogecoinPriceInUsd, getDrc20OfferList } from '@/api'
import ActivitySorter from '@/components/ActivitySorter'
import ActivityTable from '@/components/ActivityTable'
import SortByPrice from '@/components/doginals/SortByPrice'
import Drc20Cards, { Drc20Card, Drc20Offer } from '@/components/drc20/Drc20Cards'
import Drc20SubpageHeader from '@/components/drc20/Drc20SubpageHeader'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { DisplayType } from '@/components/marketplace/Trending'
import RefreshButton from '@/components/RefreshButton'
import Search from '@/components/Search'
import TypeFilter from '@/components/TypeFilter'
import { ActiveButtonIndex, ActivitySortTypes, ITEMS_PER_PAGE, SortByPriceTypes } from '@/types/common'

import PageBase from '../_base'

type Drc20SubpageProps = {
  address: string
}

const Drc20CollectionPage = ({ }: Drc20SubpageProps) => {
  const { pathname } = useLocation()
  const tick = decodeURIComponent(pathname.split('/')[3])

  const [searchValue, setSearchValue] = useState<string>('')
  const [activeButtonIndex, setActiveButtonIndex] = useState<ActiveButtonIndex>(ActiveButtonIndex.FIRST)
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()
  const [selectedSortType, setSelectedSortType] = useState<ActivitySortTypes | undefined>(undefined)
  const [drc20Cards, setDrc20Cards] = useState<Drc20Card[]>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalOffers, setTotalOffers] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedSortByPriceType, setSelectedSortByPriceType] = useState<SortByPriceTypes>(
    SortByPriceTypes.PriceAscending
  )
  const [_activityRefresh, setAcitivityRefresh] = useState<boolean>()

  useEffect(() => {
    const fetchDogePriceInUsd = async () => {
      const { res, err } = await getDogecoinPriceInUsd()

      if (err) {
        console.log(err)
        return err
      }

      return setDogecoinPriceInUsd(res!.data.dogePriceInUsd)
    }

    fetchDogePriceInUsd()
  }, [])

  const fetchDrc20Offers = useCallback(async () => {
    const data = await getDrc20OfferList(
      tick,
      currentPage === 1 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
      ITEMS_PER_PAGE,
      selectedSortByPriceType === SortByPriceTypes.PriceAscending ? 'asc' : 'desc',
      'unitPrice'
    )
    setTotalOffers(data.total)

    const drc20Offers = data.offers

    const drc20Cards = drc20Offers
      .map((drc20Offer: Drc20Offer) => ({
        price:
          drc20Offer.calcUnitPrice > 0
            ? drc20Offer.calcUnitPrice
            : drc20Offer.unitPrice > 0
            ? drc20Offer.unitPrice?.toString()
            : (drc20Offer.price / drc20Offer.amount).toString(),
        total: drc20Offer.price?.toString(),
        amount: drc20Offer.amount?.toString(),
        address: drc20Offer.address,
        inscriptionNumber: drc20Offer.inscriptionNumber?.toString(),
        offerId: drc20Offer.offerId,
        inscriptionId: drc20Offer.inscriptionId,
      }))
      .sort((offerA: Drc20Offer, offerB: Drc20Offer) => Number(offerA.price) - Number(offerB.price))

    setDrc20Cards(drc20Cards)
    setIsLoading(false)
  }, [currentPage, selectedSortByPriceType, tick])

  useEffect(() => {
    if (totalOffers > 0) {
      setTotalPages(Math.ceil(totalOffers / ITEMS_PER_PAGE))
    } else {
      setTotalPages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalOffers])

  useEffect(() => {
    async function fetchData() {
      await fetchDrc20Offers()
      setIsLoading(false)
    }

    fetchData()
  }, [currentPage, fetchDrc20Offers, tick])

  const handleRefreshButtonClick = async () => {
    setIsLoading(true)
    if (activeButtonIndex === ActiveButtonIndex.FIRST) {
      await fetchDrc20Offers()
      setSelectedSortType(undefined)
    } else {
      await fetchDrc20Offers()
      setIsLoading(false)
    }
  }

  return (
    <PageBase>
      <div className="flex flex-col gap-12">
        <Drc20SubpageHeader tick={tick} />
        <div className="w-full">
          <div className={`flex flex-row w-full ${activeButtonIndex === ActiveButtonIndex.FIRST ? 'mb-8' : ''}`}>
            <TypeFilter
              firstButtonContent="Market"
              secondButtonContent="Activity"
              setActiveButtonIndex={setActiveButtonIndex}
            />
            <div className="border-account-page-default flex flex-row justify-end items-center pb-3 gap-2">
              <SortByPrice
                selectedSortType={selectedSortByPriceType}
                setSelectedSortType={setSelectedSortByPriceType}
              />
              <RefreshButton refetchData={async () => await handleRefreshButtonClick()} setIsSorting={() => {}} />
              <Search searchValue={searchValue} setSearchValue={setSearchValue} displayedType={DisplayType.DRC20} />
            </div>
          </div>
          {isLoading ? (
            <div className="w-full h-screen flex justify-center items-center">
              <LoadingView />
            </div>
          ) : activeButtonIndex === ActiveButtonIndex.FIRST ? (
            <Drc20Cards
              tick={tick}
              searchValue={searchValue}
              dogecoinPriceInUsd={dogecoinPriceInUsd!}
              fetchDrc20Offers={fetchDrc20Offers}
              drc20Cards={drc20Cards}
              totalOffers={totalOffers}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              setTotalPages={setTotalPages}
              currentPage={currentPage}
            />
          ) : (
            <div>
              <ActivitySorter selectedSortType={selectedSortType} setSelectedSortType={setSelectedSortType} />
              <ActivityTable
                tick={tick}
                searchValue={searchValue}
                dogecoinPriceInUsd={dogecoinPriceInUsd!}
                activityType={selectedSortType}
                handleRefresh={() => setAcitivityRefresh(true)}
              />
            </div>
          )}
        </div>
      </div>
    </PageBase>
  )
}

export default Drc20CollectionPage
