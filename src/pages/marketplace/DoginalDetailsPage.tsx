import { AxiosError } from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  getDogecoinPriceInUsd,
  getDoginalCollectionInfo,
  getDoginalInfo,
  getDoginalOffer,
  refreshDoginalOfferStatus,
} from '@/api'
import CustomToastContainer from '@/components/CustomToastContainer'
import DoginalsAbout from '@/components/doginals/DoginalAbout'
import DoginalAttributes from '@/components/doginals/DoginalAttributes'
import DoginalBuy from '@/components/doginals/DoginalBuy'
import DoginalDetails from '@/components/doginals/DoginalDetails'
import DoginalShowTxModal from '@/components/doginals/DoginalShowTxModal'
import LoadingSpinnerIcon from '@/components/LoadingSpinnerIcon'
import useToast from '@/hooks/useToast'
import { Doginal, DoginalOffer, DoginalsCollection } from '@/types/dogeNft'
import React, { useState, useEffect } from 'react'

import PageBase from '../_base'

//function isAxiosError(error: any): error is AxiosError {
//  return error && typeof error.isAxiosError === 'boolean' && error.isAxiosError
//}

const DoginalDetailsPage = () => {
  const { pathname } = useLocation()
  const inscriptionId = pathname.split('/')[4]
  const symbol = pathname.split('/')[3]
  const navigate = useNavigate()

  const [offer, setOffer] = useState<DoginalOffer>()
  const [doginalInfo, setDoginalInfo] = useState<Doginal>()
  const [listingTimestamp, setListingTimestamp] = useState<string>()
  const [dogecoinPriceInUsd, setDogecoinPriceInUsd] = useState<number>()
  const toast = useToast()
  const [showTxModalVisible, setShowTxModalVisible] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')

  listingTimestamp;
  // useEffect(() => {
  //   const fetchContent = async () => {
  //     const { res, err } = await getInscriptionContent(inscriptionId)

  //     if (err) {
  //       console.log(err)
  //       return
  //     }

  //     return setContent(JSON.stringify(res!.data, null, 2))
  //   }

  //   fetchContent()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

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

  const [doginalsCollectionInfo, setDoginalsCollectionInfo] = useState<DoginalsCollection | null>(null)

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
  const fetchDoginalInfo = async (inscriptionId: string) => {
    const token = await getDoginalInfo(inscriptionId)

    setDoginalInfo(token)
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchCollectionInfo(symbol)
      await fetchDoginalInfo(inscriptionId)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscriptionId, symbol])

  // useEffect(() => {
  //   if (offer) {
  //     const fetchDrc20TrustLevel = async () => {
  //       const trustLevel = await drc20TrustLevel(offer.tick)

  //       if (!trustLevel) {
  //         return
  //       }

  //       return setVerifiedLevel(trustLevel)
  //     }

  //     fetchDrc20TrustLevel()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [offer])

  const fetchOffer = async (inscriptionId: string) => {
    const response = await refreshDoginalOfferStatus(inscriptionId)
    if (doginalInfo?.listed === true && !response.res?.data.valid) {
      toast.showWarningToast('This listing is no longer active')

      const { offer, timestamp } = await getDoginalOffer(inscriptionId)

      setOffer(offer)
      setListingTimestamp(timestamp)
    } else {
      const { offer, timestamp } = await getDoginalOffer(inscriptionId)

      setOffer(offer)
      setListingTimestamp(timestamp)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchOffer(inscriptionId)
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inscriptionId])

  if (!doginalInfo) {
    return (
      <div className="flex w-[100vw] h-[100vh] items-center justify-center">
        <div className="h-[3rem] w-[3rem] text-gray-600 fill-amber-500">
          <LoadingSpinnerIcon />
        </div>
      </div>
    )
  }

  return (
    <PageBase>
      <CustomToastContainer />
      {offer && (
        <DoginalShowTxModal
          visible={showTxModalVisible}
          setVisible={setShowTxModalVisible}
          txHash={txHash}
          collectionSymbol={offer.collectionSymbol}
        />
      )}
      <div className="w-full">
        <div className="p-4 flex justify-around">
          <div className="max-w-lg">
            <img
              className="w-[480px] rounded-lg"
              src={
                doginalInfo.imageURI
                  ? doginalInfo.imageURI
                  : `https://wonky-ord.dogeord.io/content/${doginalInfo.inscriptionId}`
              }
              alt={`${doginalInfo.name}`}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = '/ticks/noicon.png')
              }
            />
          </div>
          <div className="flex flex-col w-1/2">
            <div className="flex flex-row gap-2 items-center w-full mb-2">
              <img
                className="w-8 rounded-full"
                src={doginalsCollectionInfo?.imageURI}
                alt="doginal"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                  (e.currentTarget.src = '/ticks/noicon.png')
                }
              />
              <div className="flex flex-col">
                <span className="whitespace-nowrap text-sm font-semibold text-left mb-1">
                  {doginalInfo.name ? doginalInfo.name : `#${doginalInfo.inscriptionNumber}`}
                </span>
                <span className="flex items-center text-xs text-selected-color">
                  <a href={`/marketplace/doginals/${doginalInfo.collectionSymbol}`} target="_blank">
                    {doginalsCollectionInfo?.name}
                  </a>
                  <img src={'/ticks/verify.png'} alt="verified" className="w-4" />
                  {/* {verifiedLevel === 0 && <img src={'/ticks/caution.png'} alt="caution" className="w-4" />} */}
                </span>
              </div>
            </div>
            {offer && offer.status === 'listed' && (
              <DoginalBuy
                offer={offer}
                dogecoinPriceInUsd={dogecoinPriceInUsd!}
                setShowTxModalVisible={setShowTxModalVisible}
                setTxHash={setTxHash}
              />
            )}
            {doginalsCollectionInfo && <DoginalsAbout doginalsDescription={doginalsCollectionInfo?.description} />}
            {doginalInfo.metadata && <DoginalAttributes doginal={doginalInfo} />}
            <DoginalDetails
              inscriptionId={doginalInfo.inscriptionId}
              owner={doginalInfo.owner}
              content={`https://wonky-ord.dogeord.io/content/${inscriptionId}`}
              createdAt={doginalInfo.timestamp}
            />
          </div>
        </div>
      </div>
    </PageBase>
  )
}

export default DoginalDetailsPage
