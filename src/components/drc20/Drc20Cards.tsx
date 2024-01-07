import React, { useRef } from 'react';
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

//import { getDrc20OfferList } from '@/api'
//import { ITEMS_PER_PAGE } from '@/types/common'
import { truncateAddress } from '@/utils'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

type Drc20CardProps = {
  tick: string
  searchValue: string
  dogecoinPriceInUsd: number
  drc20Cards: Drc20Card[]
  currentPage: number
  setCurrentPage: (currentPage: number) => void
  totalPages: number
  totalOffers: number
  fetchDrc20Offers: (currentPage: number, ITEMS_PER_PAGE: number) => void
  setTotalPages: (totalPages: number) => void
}

export type Drc20Card = {
  price: string
  total: string
  amount: string
  address: string
  inscriptionNumber: string
  offerId: string
  inscriptionId: string
}

export type Drc20Offer = {
  offerId: string
  address: string
  inscriptionId: string
  inscriptionNumber: number
  tick: string
  amount: number
  marketType: string
  calcUnitPrice: number
  unitPrice: number
  price: number
  status: string
}

const Drc20Cards = ({
  tick,
  searchValue,
  dogecoinPriceInUsd,
  fetchDrc20Offers,
  currentPage,
  setCurrentPage,
  totalOffers,
  totalPages,
  drc20Cards,
  setTotalPages,
}: Drc20CardProps) => {
  fetchDrc20Offers;
  totalOffers;
  setTotalPages;

  const navigator = useNavigate()
  const ref = useRef<null | HTMLDivElement>(null)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    ref.current?.scrollIntoView({ behavior: 'auto' })
  }

  const handleDrc20BuyClick = async (drc20Card: Drc20Card) => {
    navigator(`/marketplace/drc20/purchase/${drc20Card.inscriptionId}`)
  }

  return (
    <div>
      <div ref={ref} className="w-full grid xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxs:gap-4 md:gap-8 lg:gap-20">
        {drc20Cards &&
          drc20Cards
            .filter(
              (drc20Card) =>
                drc20Card.amount.includes(searchValue) ||
                drc20Card.address.includes(searchValue) ||
                drc20Card.inscriptionNumber.includes(searchValue) ||
                drc20Card.price?.toString().includes(searchValue) ||
                drc20Card.total.includes(searchValue)
            )
            .map((drc20Card, index) => (
              <div
                key={index}
                className="px-2 py-2 rounded-lg flex flex-col justify-evenly gap-4 items-center border-2 border-account-page-default"
              >
                <div className="w-full">
                  <div className="w-full flex justify-between xxs:text-xxxs sm:text-xxs">
                    <span className="inline-flex gap-x-1 items-center">
                      <img
                        className="w-5 h-5 rounded-full"
                        src={`https://drc-20-icons.s3.eu-central-1.amazonaws.com/${tick.toLowerCase()}.png`}
                        alt="Drc20"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                          (e.currentTarget.src = '/ticks/noicon.png')
                        }
                      />
                      <span>{tick}</span>
                    </span>
                    <span className="bg-account-page-default rounded-lg p-1">
                      <a
                        href={`https://wonky-ord.dogeord.io/shibescription/${drc20Card.inscriptionId}`}
                        target="_blank"
                      >
                        #{drc20Card.inscriptionNumber}
                      </a>
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-selected-color font-semibold xxs:text-base md:text-lg">
                      {Number(drc20Card.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </h1>
                    <p className="xxs:text-xxs md:text-xs">{`(at $${(
                      (Number(drc20Card.price) / ONE_DOGE_IN_SHIBES) *
                      dogecoinPriceInUsd
                    ).toLocaleString('en-US', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: Number(drc20Card.price) / ONE_DOGE_IN_SHIBES < 1 ? 12 : 5,
                    })})`}</p>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between items-center w-full bg-account-page-default rounded-md p-2 xxs:text-xxxs sm:text-xxs">
                    <span className="font-medium">PRICE:</span>
                    <span>
                      {Number(drc20Card.price) / ONE_DOGE_IN_SHIBES < 0.00001
                        ? '< 0.00001'
                        : (Number(drc20Card.price) / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 5,
                          })}{' '}
                      DOGE /
                      {(Number(drc20Card.price) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd < 0.00001
                        ? ' < $0.00001'
                        : ` $ ${((Number(drc20Card.price) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 5,
                            }
                          )}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full bg-account-page-default rounded-md p-2 xxs:text-xxxs sm:text-xxs">
                    <span className="font-medium">TOTAL:</span>
                    <span className="">
                      {(Number(drc20Card.total) / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{' '}
                      DOGE / $
                      {((Number(drc20Card.total) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full xxs:text-xxxs sm:text-xxs p-2">
                    <span className="font-medium">FROM:</span>
                    <a href={`/account/${drc20Card.address}`} target="_blank">
                      {truncateAddress(drc20Card.address)}
                    </a>
                  </div>
                  <div className="flex justify-center w-full pb-3">
                    <button
                      className="w-[90%] rounded-xl text-white bg-selected-color py-[6px] xxs:text-xs sm:text-sm font-bold"
                      onClick={() => handleDrc20BuyClick(drc20Card)}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
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
  )
}

export default Drc20Cards
