import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router'

import { getDoginalCollectionSymbol, getDoginalsOffersList, getImageInscriptions } from '@/api'
import useToast from '@/hooks/useToast'
import { DogeNft, DoginalOffer } from '@/types/dogeNft'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

import CustomToastContainer from '../CustomToastContainer'
import DoginalCancelModal from '../doginals/DoginalCancelModal'
import DoginalListForSaleModal from '../doginals/DoginalListForSaleModal'

type DogeNftOverviewProps = {
  address?: string
  searchValue?: string
  dogecoinPriceInUsd: number
}

const ITEMS_PER_PAGE = 100

const RevokeDogeNftOverview = ({ address: propAddress, dogecoinPriceInUsd, searchValue }: DogeNftOverviewProps) => {
  const { pathname } = useLocation()

  const pathnameSplit = pathname.split('/')
  const address = propAddress || pathnameSplit[pathnameSplit.length - 1]

  const navigator = useNavigate()
  const toast = useToast()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const [doginalListForSaleModalVisible, setDoginalListForSaleModalVisible] = useState<boolean>(false)
  const [doginalCancelModalVisible, setDoginalCancelModalVisible] = useState<boolean>(false)
  const [listedUserDoginals, setListedUserDoginals] = useState<Record<string, DoginalOffer> | undefined>(undefined)
  const [dogeNftArray, setDogeNftArray] = useState<Array<DogeNft & { listed: boolean; unlisted: boolean }>>([])

  const [selectedDoginal, setSelectedDoginal] = useState<DogeNft & { listed: boolean; unlisted: boolean }>({
    name: '',
    id: '',
    content: '',
    inscriptionNumber: 0,
    inscriptionId: '',
    floorPrice: 0,
    listingPrice: 0,
    listed: false,
    unlisted: false,
  })

  const updateDoginalState = (doginal: DogeNft & { listed: boolean }) => {
    setDogeNftArray((prevArray) => {
      return (prevArray || []).map((nft) => {
        if (nft.id === doginal.inscriptionId) {
          return { ...nft, listed: !nft.listed, unlisted: !nft.unlisted }
        }

        return nft
      })
    })
    window.location.reload()
  }

  const fetchUserListedDoginals = useCallback(
    async (address: string) => {
      const { list = [], total } = await getImageInscriptions({
        address,
        cursor: (currentPage - 1) * ITEMS_PER_PAGE,
        size: ITEMS_PER_PAGE,
      })

      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE))

      const listedOffers = await getDoginalsOffersList(undefined, address, 'listed')
      const listedOffersFormatted = (listedOffers || []).map((offer: DoginalOffer) => offer.inscriptionId) as string[]
      const listedOffersSet = new Set(listedOffersFormatted)

      const listedDoginals = (listedOffers || []).reduce(
        (offerObject: object, offer: DoginalOffer) => ({ ...offerObject, [offer.inscriptionId]: offer }),
        {}
      )

      const unlistedOffers = await getDoginalsOffersList(undefined, address, 'unlisted')
      const unlistedOffersFormatted = (unlistedOffers || []).map(
        (offer: DoginalOffer) => offer.inscriptionId
      ) as string[]
      const unlistedOffersSet = new Set(unlistedOffersFormatted)

      const dogeArray = (list || [])
        .map((nft: any) => ({
          ...nft,
          name: '',
          id: '',
          floorPrice: listedDoginals[nft.inscriptionId]?.floorPrice,
          listingPrice: listedDoginals[nft.inscriptionId]?.listingPrice,
          listed: listedOffersSet.has(nft.inscriptionId),
          unlisted: unlistedOffersSet.has(nft.inscriptionId),
        }))
        .sort((dogeNftA: any, dogeNftB: any) => {
          if (dogeNftA.unlisted && dogeNftB.unlisted) {
            if (dogeNftA.listed && !dogeNftB.listed) {
              return 1
            } else if (!dogeNftA.listed && dogeNftB.listed) {
              return -1
            }
            return 0
          } else if (dogeNftA.unlisted && !dogeNftB.unlisted) {
            return -1
          } else if (!dogeNftA.unlisted && dogeNftB.unlisted) {
            return 1
          } else if (dogeNftA.listed && !dogeNftB.listed) {
            return -1
          } else if (!dogeNftA.listed && dogeNftB.listed) {
            return 1
          }
          return 0
        })

      setDogeNftArray(dogeArray)
      setListedUserDoginals(listedDoginals)
    },
    [currentPage]
  )

  useEffect(() => {
    fetchUserListedDoginals(address)
  }, [address, fetchUserListedDoginals])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const showDoginalCancelModal = (dogeNft: DogeNft & { listed: boolean; unlisted: boolean }) => {
    setSelectedDoginal(dogeNft)
    setDoginalCancelModalVisible(true)
  }

  return (
    <>
      <CustomToastContainer />
      {propAddress && (
        <DoginalCancelModal
          visible={doginalCancelModalVisible}
          setVisible={setDoginalCancelModalVisible}
          doginal={selectedDoginal}
          address={address}
          onSuccess={updateDoginalState}
        />
      )}
      <div className="overflow-x-auto">
        <table className="max-w-7xl table-fixed min-w-full">
          <thead className="w-full border-solid border-b-2">
            <tr className="w-full">
              <th className="whitespace-nowrap py-4 w-1/2 text-xxs text-start">Item</th>
              <th className="whitespace-nowrap px-8 py-4 text-center w-1/6 text-xxs">Floor Price</th>
              <th className="whitespace-nowrap px-8 py-4 text-center w-1/6 text-xxs">Listing Price</th>
              {propAddress && <th className="whitespace-nowrap px-8 py-4 text-xxs text-center w-1/6">Clear</th>}
            </tr>
          </thead>
          <tbody className="">
            {dogeNftArray &&
              listedUserDoginals &&
              dogeNftArray
                .filter((dogeNFT) => dogeNFT.inscriptionNumber.toString().includes(searchValue || ''))
                .map((dogeNft) => (
                  <tr className="" key={dogeNft.inscriptionId}>
                    <td
                      className="whitespace-nowrap md:pr-8 md:pl-1 pl-3 pt-4 text-xs flex items-center hover:cursor-pointer"
                      onClick={async () => {
                        try {
                          const collectionSymbol = await getDoginalCollectionSymbol(dogeNft.inscriptionId)
                          navigator(`/marketplace/doginals/${collectionSymbol}/${dogeNft.inscriptionId}`)
                        } catch (e) {
                          toast.showErrorToast("Doginal doesn't belong to any collection")
                        }
                      }}
                    >
                      <img className="h-7 w-7" src={dogeNft.content} alt="dogenft" />
                      <div className="flex flex-col ml-2">
                        <div className="font-medium ml-0.5">
                          {dogeNft.name + dogeNft.name !== ''
                            ? ' #'
                            : '' + dogeNft.id + ' (#' + dogeNft.inscriptionNumber + ')'}
                        </div>
                        <div className="text-light-dark">{dogeNft.name}</div>
                      </div>
                    </td>
                    <td className="px-8 pt-4 text-center text-xxs">{dogeNft.floorPrice}</td>
                    <td className="px-8 pt-4 text-center text-xxs">
                      {dogeNft.listed && listedUserDoginals[dogeNft.inscriptionId] ? (
                        <div className="flex items-center justify-center">
                          <span>
                            {(listedUserDoginals[dogeNft.inscriptionId].price / ONE_DOGE_IN_SHIBES).toLocaleString(
                              'en-US',
                              {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                          <img className="ml-1 h-4 w-4 object-cover" src={'/images/dogecoin.svg'} alt="Drc20 Icon" />
                        </div>
                      ) : (
                        'No listing data available'
                      )}
                    </td>
                    {propAddress && (
                      <td className="px-8 pt-4 text-xxs">
                        <div className="flex items-center justify-center">
                          {
                            dogeNft.listed ? (
                              <button
                                className="bg-red-button text-red-text font-semibold rounded-base w-16 px-3 py-[5px]"
                                onClick={() => showDoginalCancelModal(dogeNft)}
                                title="Unlist"
                              >
                                Unlist
                              </button>
                            ) : dogeNft.unlisted ? (
                              <button
                                className="bg-red-button text-red-text font-semibold rounded-base w-16 px-3 py-[5px]"
                                onClick={() => showDoginalCancelModal(dogeNft)}
                                title="Clear"
                              >
                                Clear
                              </button>
                            ) : null /*(
                          <button
                            className="bg-gray-200 font-semibold rounded-base w-16 px-3 py-[5px]"
                            onClick={() => showDoginalCancelModal(dogeNft)}
                            title="Clear"
                          >
                            Clear
                          </button>
                        )*/
                          }
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
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
      </div>
    </>
  )
}

export default RevokeDogeNftOverview
