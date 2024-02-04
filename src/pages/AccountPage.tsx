import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  drc20TrustLevel,
  getDogecoinPriceInUsd,
  getDrc20Balance,
  getDrc20TransferInscriptions,
  postRefreshInscriptions,
  resolveListingPrice,
} from '@/api'
import Drc20Overview from '@/components/account/Drc20Overview'
import BaseButton from '@/components/BaseButton'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { DisplayType } from '@/components/marketplace/Trending'
import TypeFilter from '@/components/marketplace/TypeFilter'
import RefreshButton from '@/components/RefreshButton'
import { usePendingD20Balances } from '@/hooks/usePendingD20Balance'
import { AddressConsumingProps } from '@/types/common'
import { Drc20, Drc20Response } from '@/types/drc20'
import { TransferInscription, TransferInscriptionResponse } from '@/types/transferInscriptions'

import AccountInfo from '../components/account/AccountInfo'
import DogeNftOverview from '../components/account/DogeNftOverview'
import Search from '../components/Search'
import PageBase from './_base'

const noop = () => {}

const ITEMS_PER_PAGE = 20

export enum AssetTransferTab {
  Doginals = 'transferDoginals',
  Drc20 = 'transferDrc20s',
}

const getDisplayTabBySearchParams = (searchParams: URLSearchParams) => {
  const tab = searchParams.get('tab')
  if (tab === 'nfts') {
    return DisplayType.DOGINALS
  } else {
    return DisplayType.DRC20
  }
}

function AccountPage({ address }: AddressConsumingProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [queryParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [displayedType, setDisplayedType] = useState(getDisplayTabBySearchParams(queryParams))

  const [drc20Array, setDrc20Array] = useState<Drc20[]>([])
  const [transferInscriptions, setTransferInscriptions] = useState<TransferInscription[]>([])
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()

  const [searchValue, setSearchValue] = useState<string>('')

  const refreshInscriptions = useCallback(async (address: string) => {
    await postRefreshInscriptions(address)
  }, [])

  const fetchDrc20Balance = useCallback(async () => {
    const drc20BalanceResponseList = await getDrc20Balance(address)
    console.log("balances",drc20BalanceResponseList);
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

  const fetchTokenTransferableList = useCallback(async () => {
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
  }, [address, drc20Array])

  useEffect(() => {
    const fetchData = async () => {
      if (address !== '') {
        await fetchDrc20Balance()
        setIsLoading(false)
        // fetchIsWhitelistAddress()
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

  const handleRefreshButtonClick = useCallback(async () => {
    if (address !== '') {
      await refreshInscriptions(address)
      if (displayedType === DisplayType.DRC20) {
        await fetchDrc20Balance()
        await fetchTokenTransferableList()
      }
    }
  }, [address, displayedType, fetchDrc20Balance, fetchTokenTransferableList, refreshInscriptions])

  const onClearClick = useCallback(() => {
    navigate(`/clear`)
  }, [navigate])

  const onSetDisplayedType = useCallback(
    (type: DisplayType) => {
      setDisplayedType(type)
      // set the tab to the query string
      queryParams.set('tab', type === DisplayType.DOGINALS ? 'nfts' : 'drc-20')
      navigate(`${location.pathname}?${queryParams.toString()}`)
    },
    [navigate, location.pathname, queryParams]
  )

  const { pendingD20Balances } = usePendingD20Balances({ address })

  return (
    <PageBase>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <AccountInfo address={address} />
          <div className="text-end mb-8">
            <BaseButton onClick={onClearClick} style={{ height: '32px', marginLeft: '24px', marginBottom: '3x' }}>
              Clear PSDTs
            </BaseButton>
          </div>
          <div className="flex w-full mb-4">
            <TypeFilter displayedType={displayedType} setDisplayedType={onSetDisplayedType} />
            <div className="flex flex-row justify-end items-center pb-3 gap-2">
              <RefreshButton refetchData={handleRefreshButtonClick} setIsSorting={noop} />
              <Search searchValue={searchValue} setSearchValue={setSearchValue} displayedType={displayedType} />
            </div>
          </div>
          {isLoading ? (
            <div className="w-full flex justify-center items-center mt-5">
              <LoadingView />
            </div>
          ) : displayedType === DisplayType.DRC20 ? (
            <Drc20Overview
              address={address}
              drc20Array={drc20Array}
              transferInscriptions={transferInscriptions}
              searchValue={searchValue}
              itemsPerPage={ITEMS_PER_PAGE}
              dogecoinPriceInUsd={dogecoinPriceInUsd!}
              pendingD20Balances={pendingD20Balances}
            />
          ) : (
            <DogeNftOverview address={address} dogecoinPriceInUsd={dogecoinPriceInUsd!} searchValue={searchValue} />
          )}
        </div>
      </div>
    </PageBase>
  )
}

export default AccountPage
