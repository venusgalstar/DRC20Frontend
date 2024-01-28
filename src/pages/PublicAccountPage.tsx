import { useCallback, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import DogeNftOverview from '@/components/account/DogeNftOverview'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { DisplayType } from '@/components/marketplace/Trending'
import TypeFilter from '@/components/marketplace/TypeFilter'
import RefreshButton from '@/components/RefreshButton'
import { usePendingD20Balances } from '@/hooks/usePendingD20Balance'
import { Drc20, Drc20Response } from '@/types/drc20'
import { TransferInscription, TransferInscriptionResponse } from '@/types/transferInscriptions'

import {
  drc20TrustLevel,
  getDogecoinPriceInUsd,
  getDrc20Balance,
  getDrc20TransferInscriptions,
  postRefreshInscriptions,
  resolveListingPrice,
} from '../api'
import PublicDrc20Overview from '../components/PublicDrc20Overview'
import Search from '../components/Search'
import PageBase from './_base'

const ITEMS_PER_PAGE = 5

function PublicAccountPage() {
  const { pathname } = useLocation()
  const address = pathname.split('/')[3] || pathname.split('/')[2]
  const [displayedType, setDisplayedType] = useState(DisplayType.DRC20)

  const [drc20Array, setDrc20Array] = useState<Drc20[]>([])
  const [transferInscriptions, setTransferInscriptions] = useState<TransferInscription[]>([])
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const [searchValue, setSearchValue] = useState<string>('')
  //const [isDrc20TabSelected, setIsDrc20TabSelected] = useState<boolean>(false)

  const refreshInscriptions = useCallback(async (address: string) => {
    await postRefreshInscriptions(address)
  }, [])

  const fetchDrc20Balance = useCallback(async () => {
    setIsLoading(true)
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
    setIsLoading(false)
  }, [address])

  const fetchTokenTransferableList = async () => {
    let transferInscriptionArray: TransferInscription[] = []
    for (const drc20 of drc20Array.filter((drc20) => drc20.transferable !== 0)) {
      const drc20TransferInscriptionResponseList = await getDrc20TransferInscriptions(address, drc20.name)

      const transferInscriptionList = await Promise.all(
        drc20TransferInscriptionResponseList.map(async (transferInscription: TransferInscriptionResponse) => ({
          tick: transferInscription.ticker,
          amount: +transferInscription.amount,
          inscriptionId: transferInscription.inscriptionId,
          inscriptionNumber: transferInscription.inscriptionNumber,
          listingPrice: await resolveListingPrice(transferInscription.inscriptionId),
          verified: drc20.verified,
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

  const handleRefreshButtonClick = async () => {
    if (address !== '') {
      await refreshInscriptions(address)
      if (displayedType === DisplayType.DRC20) {
        await fetchDrc20Balance()
        await fetchTokenTransferableList()
      }
    }
  }

  const { pendingD20Balances } = usePendingD20Balances({ address })

  return (
    <PageBase>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 border-account-page-default pb-12 lg:mb-2">
            <h1 className="text-3xl font-bold">Inscriptions for:</h1>
            <h2 className="md:text-lg text-selected-color break-words">{address}</h2>
          </div>
          <div className="flex w-full mb-4">
            <TypeFilter displayedType={displayedType} setDisplayedType={setDisplayedType} />
            <div className="flex flex-row justify-end items-center pb-3 gap-2">
              <RefreshButton refetchData={handleRefreshButtonClick} setIsSorting={() => {}} />
              <Search searchValue={searchValue} setSearchValue={setSearchValue} displayedType={displayedType} />
            </div>
          </div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center mt-5">
              <LoadingView />
            </div>
          ) : displayedType === DisplayType.DRC20 ? (
            <PublicDrc20Overview
              drc20Array={drc20Array}
              transferInscriptions={transferInscriptions}
              searchValue={searchValue}
              itemsPerPage={ITEMS_PER_PAGE}
              dogecoinPriceInUsd={dogecoinPriceInUsd!}
              pendingD20Balances={pendingD20Balances}
            ></PublicDrc20Overview>
          ) : (
            <DogeNftOverview dogecoinPriceInUsd={dogecoinPriceInUsd!} searchValue={searchValue}></DogeNftOverview>
          )}
        </div>
      </div>
    </PageBase>
  )
}

export default PublicAccountPage
