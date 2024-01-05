import axios, { AxiosError } from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import {
  drc20TrustLevel,
  getDogecoinPriceInUsd,
  getDrc20Offer,
  getInscriptionContent,
  getPsdtFromOfferId,
  refreshDrc20OfferStatus,
} from '@/api'
import CustomToastContainer from '@/components/CustomToastContainer'
import DetailsAccordion from '@/components/DetailsAccordion'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import ShowTxModal from '@/components/ShowTxModal'
import useToast from '@/hooks/useToast'
import PageBase from '@/pages/_base'
import { Drc20Offer } from '@/types/drc20'
import { MINER_FEE, ONE_DOGE_IN_SHIBES, SERVICE_FEE, TrustLevel } from '@/utils/constants'
import { getDummyUtxoValueFromSellerPsdt } from '@/utils/helpers'
import { useWalletContext } from '@/WalletContext'

function isAxiosError(error: any): error is AxiosError {
  return error && typeof error.isAxiosError === 'boolean' && error.isAxiosError
}

type Drc20DetailsPageProps = {
  address: string
}

const Drc20DetailsPage = ({ address }: Drc20DetailsPageProps) => {
  const { pathname } = useLocation()
  const inscriptionId = pathname.split('/')[4]
  const navigator = useNavigate()

  const [content, setContent] = useState<string>('')
  const [trustLevel, setTrustLevel] = useState<TrustLevel>(TrustLevel.NORMAL)
  const [offer, setOffer] = useState<Drc20Offer>()
  const [listingTimestamp, setListingTimestamp] = useState<string>()
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>(0)
  const [showTxModalVisible, setShowTxModalVisible] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  const { balance } = useWalletContext()
  const toast = useToast()

  useEffect(() => {
    const fetchContent = async () => {
      const { res, err } = await getInscriptionContent(inscriptionId)

      if (err) {
        console.log(err)
        return
      }

      return setContent(JSON.stringify(res!.data, null, 2))
    }

    fetchContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchDogecoinPrice = async () => {
      const { res, err } = await getDogecoinPriceInUsd()

      if (err) {
        console.log(err)
        return
      }

      return setDogecoinPriceInUsd(res!.data.dogePriceInUsd)
    }

    fetchDogecoinPrice()
  })

  useEffect(() => {
    const fetchOffer = async () => {
      const { res, err } = await refreshDrc20OfferStatus(inscriptionId)

      if (err || !res?.data.valid) {
        console.log(err?.message)
        toast.showErrorToast(
          'This offer is no longer valid. You will be redirected back to the Marketplace. Thank you for your patience!'
        )

        return setTimeout(() => {
          navigator(-1)
        }, 3000)
      }

      const { res: drc20OfferRes, err: drc20OfferErr } = await getDrc20Offer(inscriptionId)

      if (drc20OfferErr) {
        console.log(drc20OfferErr)
        return
      }

      setOffer(drc20OfferRes!.data.offer)
      setListingTimestamp(drc20OfferRes!.data.timestamp)
    }

    fetchOffer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscriptionId])

  useEffect(() => {
    if (offer) {
      const fetchDrc20TrustLevel = async () => {
        const trustLevel = await drc20TrustLevel(offer.tick)

        return setTrustLevel(trustLevel)
      }

      fetchDrc20TrustLevel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer])

  const handleBuyClick = async () => {
    if (offer) {
      if (balance.total <= Number(offer.price)) {
        toast.showErrorToast('Unable to purchase: Insufficient balance')
        return
      }
      try {
        const sellerPsdtHex = await getPsdtFromOfferId(offer.offerId, 'drc20')

        // Create 3 outputs required for purchasing the offer
        const unsignedBuyerPrePurchaseTx = await (window as any).dogeLabs.createPurchaseOfferInputs(sellerPsdtHex)
        const signedBuyerPrePurchaseTx = await (window as any).dogeLabs.signPsbt(unsignedBuyerPrePurchaseTx)
        const { rawTx } = await (window as any).dogeLabs.pushPsbt(signedBuyerPrePurchaseTx, [], true)

        const buyerPsdtHex = await (window as any).dogeLabs.createBuyerPsdt(sellerPsdtHex, rawTx)
        const signedPsdtHex = await (window as any).dogeLabs.signPsbt(buyerPsdtHex)
        const data = await (window as any).dogeLabs.buyDrc20Offer(offer.offerId, signedPsdtHex, address)

        setTxHash(data.txHash)
        setShowTxModalVisible(true)
      } catch (e) {
        if (e instanceof Error) {
          toast.showErrorToast(`Unable to make a purchase: ${e.message}`, { autoClose: 5000 })
        }
      }
    }
  }

  if (!offer || !listingTimestamp) {
    return (
      <div className="flex w-[100vw] h-[100vh] items-center justify-center">
        <CustomToastContainer />
        <div className="h-[3rem] w-[3rem] text-gray-600 fill-amber-500">
          <LoadingView />
        </div>
      </div>
    )
  }

  return (
    <PageBase>
      <CustomToastContainer />
      <ShowTxModal
        visible={showTxModalVisible}
        setVisible={setShowTxModalVisible}
        txHash={txHash}
        tick={offer.tick}
      ></ShowTxModal>
      <div className="flex xxs:flex-col lg:flex-row w-full items-center lg:items-start gap-4 lg:gap-8 break-words lg:min-h-[60vh]">
        <div className="border-2 border-account-page-background rounded-lg bg-white xxs:w-full md:w-[50vw] px-10 py-20 flex justify-center items-center text-left lg:py-[137px]">
          <span className="md:text-lg" style={{ whiteSpace: 'pre-line' }}>
            {content}
          </span>
        </div>
        <div className="flex flex-col items-center gap-4 xxs:w-full md:w-[50vw]">
          <div className="flex flex-row gap-2 items-center w-full">
            <img
              className="w-10 rounded-full"
              src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${offer.tick.toLowerCase()}.png`}
              alt={`${offer.tick}`}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = '/ticks/noicon.png')
              }
            />
            <div className="flex flex-col">
              <span className="whitespace-nowrap font-semibold">
                {offer.amount} {offer.tick} (#{offer.inscriptionNumber})
              </span>
              <span className="flex items-center text-xs text-selected-color">
                <a href={`/marketplace/drc20/${offer.tick}`} target="_blank">
                  {offer.tick}
                </a>
                {trustLevel === TrustLevel.TRUSTWORTHY && (
                  <img src={'/ticks/verify.png'} alt="verified" className="w-4" />
                )}
                {trustLevel === TrustLevel.UNTRUSTWORTHY && (
                  <img src={'/ticks/caution.png'} alt="caution" className="w-4" />
                )}
              </span>
            </div>
          </div>
          <div className="border-2 border-account-page-background rounded-lg flex flex-col items-start w-full">
            <div className="flex flex-col text-left p-4">
              <span className="text-xxs text-gray-500">Price</span>
              <h1 className="font-semibold text-xl">
                {(offer.price / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{' '}
                DOGE
              </h1>
              <span className="text-xxs text-gray-500 pb-4 tracking-tighter">
                ~$
                {((offer.price / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              <button
                className={`${
                  address ? 'bg-selected-color' : 'bg-gray-200'
                } rounded-xl text-white text-base font-bold p-2`}
                onClick={async () => await handleBuyClick()}
                disabled={address ? false : true}
              >
                {address ? 'Buy now' : 'Connect Wallet'}
              </button>
              <span className="pt-4">
                By clicking “Buy now”, you confirm the accuracy of the input data and agree to the{' '}
                <a href="/legal/terms" target="_blank" rel="noreferrer" className="underline">
                  Terms of Use
                </a>
                .
              </span>
            </div>
          </div>
          <DetailsAccordion
            inscriptionId={offer.inscriptionId}
            owner={offer.address}
            content={`https://wonky-ord.dogeord.io/content/${inscriptionId}`}
            createdAt={listingTimestamp!}
          />
        </div>
      </div>
    </PageBase>
  )
}

export default Drc20DetailsPage
