import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useLocation } from 'react-router'

import RevokeDrc20Overview from '@/components/account/RevokeDrc20Overview'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { DisplayType } from '@/components/marketplace/Trending'
import TypeFilter from '@/components/marketplace/TypeFilter'
import RefreshButton from '@/components/RefreshButton'
import { AddressConsumingProps } from '@/types/common'
import { Drc20, Drc20Offer, Drc20Response } from '@/types/drc20'
import { TransferInscription, TransferInscriptionResponse } from '@/types/transferInscriptions'

import {
  drc20TrustLevel,
  getDogecoinPriceInUsd,
  getDrc20Balance,
  getDrc20OfferList,
  getDrc20TransferInscriptions,
  postRefreshInscriptions,
  resolveListingPrice,
} from '../api'
import AccountInfo from '../components/account/AccountInfo'
import RevokeDogeNftOverview from '../components/account/RevokeDogeNftOverview'
import Search from '../components/Search'
import PageBase from './_base'

const ITEMS_PER_PAGE = 20

export enum AssetTransferTab {
  Doginals = 'transferDoginals',
  Drc20 = 'transferDrc20s',
}

function RevokePage({ address }: AddressConsumingProps) {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [displayedType, setDisplayedType] = useState(DisplayType.DRC20)

  const [activeTab, setActiveTab] = useState<string>(queryParams.get('activeTab') || AssetTransferTab.Drc20)
  const [drc20Array, setDrc20Array] = useState<Drc20[]>([])
  const [transferInscriptions, setTransferInscriptions] = useState<TransferInscription[]>([])
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()

  const [searchValue, setSearchValue] = useState<string>('')

  const refreshInscriptions = useCallback(async (address: string) => {
    await postRefreshInscriptions(address)
  }, [])

  const fetchDrc20Balance = useCallback(async () => {
    const drc20BalanceResponseList = await getDrc20Balance(address)

    setTransferInscriptions([])
    setDrc20Array(
      await Promise.all(
        drc20BalanceResponseList.map(async (balance: Drc20Response) => ({
          name: balance.tick,
          available: +balance.available,
          transferable: +balance.transferable,
          verified: await drc20TrustLevel(balance.tick),
        }))
      )
    )
  }, [address])

  const fetchTokenTransferableList = async () => {
    let transferInscriptionArray: TransferInscription[] = []
    for (const drc20 of drc20Array.filter((drc20) => drc20.transferable !== 0)) {
      const drc20TransferInscriptionResponseList = await getDrc20TransferInscriptions(address, drc20.name)

      const getDrc20OfferListResponse = await getDrc20OfferList(drc20.name, 0, 1000, 'asc', 'unitPrice', 'unlisted')
      const unlistedOffers = getDrc20OfferListResponse.offers
      const unlistedOffersFormatted = (unlistedOffers || []).map((offer: Drc20Offer) => offer.inscriptionId) as string[]
      const unlistedOffersSet = new Set(unlistedOffersFormatted)

      const transferInscriptionList = await Promise.all(
        drc20TransferInscriptionResponseList.map(async (transferInscription: TransferInscriptionResponse) => ({
          tick: transferInscription.ticker,
          amount: +transferInscription.amount,
          inscriptionId: transferInscription.inscriptionId,
          inscriptionNumber: transferInscription.inscriptionNumber,
          listingPrice: await resolveListingPrice(transferInscription.inscriptionId),
          verified: drc20.verified,
          unlisted: unlistedOffersSet.has(transferInscription.inscriptionId),
        }))
      )
      transferInscriptionArray.push(...transferInscriptionList)
    }
    setTransferInscriptions(transferInscriptionArray)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (address !== '') {
        await fetchDrc20Balance()
        setIsLoading(false)
      }
    }
    fetchData()
  }, [address, fetchDrc20Balance])

  useEffect(() => {
    if (drc20Array.length > 0) {
      fetchTokenTransferableList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drc20Array])

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

  // @todo refactor this to use useCallback
  const handleRefreshButtonClick = async () => {
    if (address !== '') {
      await refreshInscriptions(address)
      if (activeTab === AssetTransferTab.Drc20) {
        await fetchDrc20Balance()
        await fetchTokenTransferableList()
      }
    }
  }

  return (
    <PageBase>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <AccountInfo address={address} />
          <div>
            <p className="text-3xl text-left mb-8">
              <strong>Clear PSDTs</strong>
            </p>
          </div>
          <div className="flex w-full mb-4">
            <TypeFilter displayedType={displayedType} setDisplayedType={setDisplayedType} />
            <div className="border-b-2 border-[#EFF2F5] w-full flex flex-row justify-end items-center pb-3 gap-2">
              <RefreshButton refetchData={handleRefreshButtonClick} setIsSorting={() => {}} />
              <Search searchValue={searchValue} setSearchValue={setSearchValue} displayedType={displayedType} />
            </div>
          </div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center mt-5">
              <LoadingView />
            </div>
          ) : displayedType === DisplayType.DRC20 ? (
            <RevokeDrc20Overview
              address={address}
              transferInscriptions={transferInscriptions}
              searchValue={searchValue}
              itemsPerPage={ITEMS_PER_PAGE}
              dogecoinPriceInUsd={dogecoinPriceInUsd!}
            ></RevokeDrc20Overview>
          ) : (
            <RevokeDogeNftOverview
              address={address}
              dogecoinPriceInUsd={dogecoinPriceInUsd!}
              searchValue={searchValue}
            ></RevokeDogeNftOverview>
          )}
        </div>
      </div>
    </PageBase>
  )
}

export default RevokePage
