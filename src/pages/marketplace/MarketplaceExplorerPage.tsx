import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import Hero from '@/components/hero/Hero'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import Sentry from '@/main'
import { PaginationInfo } from '@/types/common'
import { LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE, LANDING_PAGE_DRC20_ITEMS_PER_PAGE } from '@/utils/constants'

import {
  Feature,
  getAllDoginalCollections,
  getDoginalsFromCollection,
  getDrc20Data,
  getDrc20List,
  getFeatures,
} from '../../api'
import LoadingSpinnerIcon from '../../components/LoadingSpinnerIcon'
import Trending from '../../components/marketplace/Trending'
import { DoginalsCollection } from '../../types/dogeNft'
import { Drc20Data, Drc20List } from '../../types/drc20'
import PageBase from '../_base'

const MarketplaceLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [drc20DataList, setDrc20DataList] = useState<Drc20Data[] | undefined>()
  const [dogePriceInUSD, setDogePriceInUSD] = useState<number>(0)
  const [dogeNftCollections, setDogeNftCollections] = useState<DoginalsCollection[] | undefined>()
  const [currentDrc20Page, setCurrentDrc20Page] = useState<number>(1)
  const [totalDrc20Pages, setTotalDrc20Pages] = useState<number>(1)
  const [totalDrc20Tokens, setTotalDrc20Tokens] = useState<number>(0)
  const [currentDogeNftPage, setCurrentDogeNftPage] = useState<number>(1)
  const [totalDogeNftPages, setTotalDogeNftPages] = useState<number>(1)
  const [totalDogeNftCollections, setTotalDogeNftCollections] = useState<number>(0)
  const [features, setFeatures] = useState<Feature[]>([])

  const fetchFeatures = async (visible?: boolean) => {
    const features = await getFeatures(visible)
    if (features) {
      setFeatures(features)
    }
  }

  const fetchDrc20DataList = useCallback(
    async (filterByTick?: string) => {
      const { res, err } = await getDrc20List(
        currentDrc20Page === 1 ? 0 : (currentDrc20Page - 1) * LANDING_PAGE_DRC20_ITEMS_PER_PAGE,
        LANDING_PAGE_DRC20_ITEMS_PER_PAGE,
        filterByTick
      )

      if (err) {
        Sentry.captureException(err, {
          extra: {
            filter: filterByTick,
          },
        })
        console.log(err.message)
        return
      }

      setDrc20DataList(res!.data.list)
      setTotalDrc20Tokens(res!.data.total)
      setDogePriceInUSD(res!.data.DOGEprice)
      return
    },
    [currentDrc20Page]
  )

  const fetchCollections = useCallback(
    async (filterByName?: string) => {
      const { res, err } = await getAllDoginalCollections(
        currentDogeNftPage === 1 ? 0 : (currentDogeNftPage - 1) * LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE,
        LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE,
        filterByName
      )

      if (err) {
        Sentry.captureException(err, {
          extra: {
            filter: filterByName,
          },
        })
        console.log(err.message)
        return setIsLoading(false)
      }

      // get floor price for collections with floor price = 0
      const zeroFloorPriceCollections = res!.data.collections.filter((collection) => collection.floorPrice === 0)
      const collectionsWithFloorPrice = await Promise.all(
        zeroFloorPriceCollections.map(async (collection) => {
          const { doginals } = await getDoginalsFromCollection(collection.symbol, 1, 0, 'asc')
          if (!doginals || doginals.length < 1) {
            return { symbol: collection.symbol, floorPrice: 0 }
          }
          const floorPrice = doginals[0].price
          return { symbol: collection.symbol, floorPrice }
        })
      )

      const enhancedCollections = res!.data.collections.map((collection) => {
        const floorPrice = collectionsWithFloorPrice.find((c) => c.symbol === collection.symbol)?.floorPrice
        return floorPrice ? { ...collection, floorPrice } : collection
      })

      setDogeNftCollections(enhancedCollections)
      setTotalDogeNftCollections(res!.data.total)
      return setIsLoading(false)
    },
    [currentDogeNftPage]
  )

  const refetchData = async () => {
    await fetchDrc20DataList()
    await fetchCollections()
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchFeatures(true)
      await fetchDrc20DataList()
      await fetchCollections()
    }
    fetchData()
  }, [fetchCollections, fetchDrc20DataList])

  useEffect(() => {
    if (totalDrc20Tokens > 0) {
      setTotalDrc20Pages(Math.ceil(totalDrc20Tokens / LANDING_PAGE_DRC20_ITEMS_PER_PAGE))
    } else {
      setTotalDrc20Pages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDrc20Tokens])

  useEffect(() => {
    if (totalDogeNftCollections > 0) {
      setTotalDogeNftPages(Math.ceil(totalDogeNftCollections / LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE))
    } else {
      setTotalDogeNftPages(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDogeNftCollections])

  const fetchDrc20ListByTick = async (filterByTick: string) => {
    const { res, err } = await getDrc20List(
      currentDrc20Page === 1 ? 0 : (currentDrc20Page - 1) * LANDING_PAGE_DRC20_ITEMS_PER_PAGE,
      LANDING_PAGE_DRC20_ITEMS_PER_PAGE,
      filterByTick
    )
    if (err) {
      Sentry.captureException(err, {
        extra: {
          filter: filterByTick,
        },
      })
      console.error(err)
      return
    }

    setDrc20DataList(res!.data.list)
    setTotalDrc20Tokens(res!.data.list.length)
    return
  }

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="h-[3rem] w-[3rem] text-gray-600 fill-amber-500">
          <LoadingView />
        </div>
      </div>
    )
  }

  return (
    <PageBase>
      <div className="flex flex-col">
        {features && <Hero features={features} />}
        <Trending
          dogeNftCollections={dogeNftCollections!}
          drc20List={drc20DataList!}
          refetchData={refetchData}
          dogePrice={dogePriceInUSD}
          paginationInfo={{
            currentDrc20Page,
            totalDrc20Pages,
            setCurrentDrc20Page,
            currentDogeNftPage,
            totalDogeNftPages,
            setCurrentDogeNftPage,
          }}
          fetchDrc20ListByTick={(filterByTick: string) => fetchDrc20ListByTick(filterByTick)}
          fetchDogeNftByName={(filterByName: string) => fetchCollections(filterByName)}
        />
      </div>
    </PageBase>
  )
}

export default MarketplaceLandingPage
