import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Doginal } from '@/types/dogeNft'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

import CustomToastContainer from '../CustomToastContainer'
import { LoadingView } from '../labradoge/loadingView/loadingView'

const ITEMS_PER_PAGE = 20

type DoginalCardProps = {
  doginalsData: Doginal[]
  doginalsImage?: string
  filterOpen: boolean
  showCollectionOffers: boolean
}

const DoginalCards = ({ doginalsData, filterOpen, showCollectionOffers }: DoginalCardProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentItems, setCurrentItems] = useState<Doginal[]>()
  const navigator = useNavigate()

  useEffect(() => {
    if (doginalsData) {
      const totalPages = Math.ceil(doginalsData.length / ITEMS_PER_PAGE)
      setTotalPages(totalPages)
      setCurrentPage(1)
      setCurrentItems(doginalsData.slice(0, ITEMS_PER_PAGE))
    }
  }, [doginalsData])

  const handleDetailsClick = async (doginal: Doginal) => {
    navigator(`/marketplace/doginals/${doginal.collectionSymbol}/${doginal.inscriptionId}`)
  }

  return (
    <div className="w-full">
      <CustomToastContainer />
      <div
        className={`justify-items-center grid gap-8 ${
          filterOpen ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {currentItems &&
          currentItems.map((doginal, index) => (
            <div
              key={index}
              className="rounded-lg w-40 h-[250px] md:w-52 md:h-[298px] lg:w-60 lg:h-[330px] flex flex-col items-center justify-start border-2 border-account-page-default"
            >
              <img
                onClick={() => handleDetailsClick(doginal)}
                className="w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60 rounded-md cursor-pointer"
                src={
                  doginal.imageURI ? doginal.imageURI : `https://wonky-ord.dogeord.io/content/${doginal.inscriptionId}`
                }
                alt="Doginal"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                  (e.currentTarget.src = '/ticks/noicon.png')
                }
              />
              <div className="flex justify-start mt-1.5 w-36 md:w-48 lg:w-52">
                <div className="flex flex-col items-start">
                  {doginal.name ? (
                    <>
                      <p className="text-left text-xs md:text-sm font-semibold w-36 lg:w-44 truncate">{doginal.name}</p>
                      <p className="text-left text-xxs md:text-xs w-32 md:w-36 lg:w-40 truncate">
                        #{doginal.inscriptionNumber}
                      </p>
                    </>
                  ) : (
                    <p className="text-left text-xs md:text-sm font-semibold w-36 md:w-44 truncate">
                      #{doginal.inscriptionNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-36 md:w-48 lg:w-56 flex justify-between mt-3 md:mt-2 px-2">
                <div className="flex items-center">
                  <img
                    src={'/images/dogecoin.svg'}
                    alt="doge"
                    width={20}
                    height={20}
                    className="w-4 h-4 md:h-5 md:w-5"
                  />
                  <p className="ml-1 font-semibold text-sm md:text-base">
                    {!doginal.listed
                      ? '-'
                      : (doginal.price / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                  </p>
                </div>
                <button
                  onClick={() => handleDetailsClick(doginal)}
                  disabled={!doginal.listed}
                  className={`rounded-xl text-white ${
                    doginal.listed ? 'bg-selected-color' : 'bg-gray-200'
                  } px-1 py-0.5 md:px-3 md:py-1 text-center text-xs md:text-sm font-bold`}
                >
                  {doginal.listed ? 'Buy' : 'Unlisted'}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default DoginalCards
