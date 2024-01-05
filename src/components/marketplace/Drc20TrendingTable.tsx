import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'

import { LANDING_PAGE_DRC20_ITEMS_PER_PAGE } from '@/utils/constants'

import { Drc20Data } from '../../types/drc20'
import { LoadingView } from '../labradoge/loadingView/loadingView'
import Drc20TrendingTableRow from './Drc20TrendingTableRow'
import { SortByTypes } from './Trending'

type Drc20TrendingTableProps = {
  drc20List: Drc20Data[]
  selectedSortType: SortByTypes
  dogePrice: number
  isSorting: boolean
  setIsSorting: (isSorting: boolean) => void
  currentDrc20Page: number
  totalDrc20Pages: number
  setCurrentDrc20Page: React.Dispatch<React.SetStateAction<number>>
}

const Drc20TrendingTable = ({
  drc20List,
  selectedSortType,
  dogePrice,
  isSorting,
  setIsSorting,
  currentDrc20Page,
  totalDrc20Pages,
  setCurrentDrc20Page,
}: Drc20TrendingTableProps) => {
  const [sortedDrc20Data, setSortedDrc20Data] = useState<Drc20Data[]>(drc20List)

  const handleSorting = useCallback(() => {
    const copiedArray = [...drc20List]
    switch (selectedSortType) {
      case SortByTypes.VolumeDescending:
        const newSortedDrc20DataVolDesc = copiedArray.sort((d1: any, d2: any) => Number(d2.volume) - Number(d1.volume))
        return setSortedDrc20Data(newSortedDrc20DataVolDesc)
      case SortByTypes.VolumeAscending:
        const newSortedDrc20DataVolAsc = copiedArray.sort((d1: any, d2: any) => Number(d1.volume) - Number(d2.volume))
        return setSortedDrc20Data(newSortedDrc20DataVolAsc)
      case SortByTypes.PriceAscending:
        const newSortedDrc20DataPriceAsc = copiedArray.sort(
          (d1: any, d2: any) => Number(d1.floorPrice) - Number(d2.floorPrice)
        )
        return setSortedDrc20Data(newSortedDrc20DataPriceAsc)
      case SortByTypes.PriceDescending:
        const newSortedDrc20DataPriceDesc = copiedArray.sort(
          (d1: any, d2: any) => Number(d2.floorPrice) - Number(d1.floorPrice)
        )
        return setSortedDrc20Data(newSortedDrc20DataPriceDesc)
    }

    const _ensureAllCasesCovered: never = selectedSortType
  }, [selectedSortType, drc20List])

  useEffect(() => {
    setIsSorting(true)
    if (drc20List) {
      handleSorting()
    }
    setIsSorting(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drc20List, selectedSortType])

  const handlePageChange = (page: number) => {
    setIsSorting(true)
    setCurrentDrc20Page(page)
    setIsSorting(false)
  }

  return (
    <div>
      <div className="flex flex-col overflow-y-hidden overflox-x-scroll">
        {(() => {
          if (isSorting || !sortedDrc20Data) {
            return (
              <div className="h-64 flex">
                <LoadingView />
              </div>
            )
          } else {
            return (
              <table className="w-full min-w-[1000px]">
                <thead className="border-b-2 border-[#EFF2F5] w-full xxs:[&>tr>*:nth-child(1)]:w-[10%] xs:[&>tr>*:nth-child(1)]:w-[12%] [&>tr>*:nth-child(2)]:w-[16%] [&>tr>*:nth-child(3)]:w-[18%] [&>tr>*:nth-child(4)]:w-[13%] [&>tr>*:nth-child(5)]:w-[12%] [&>tr>*:nth-child(6)]:w-[12%]">
                  <tr>
                    <th
                      colSpan={1}
                      className="font-normal py-5 text-left sticky left-0 marketplace-table-cell-shadow-right xxs:bg-similar-to-bg-color tableScrollBreakpoint:bg-inherit z-10"
                    >
                      <span className="pr-4">#</span>Tick
                    </th>
                    {/* <th
                      colSpan={1}
                      className="font-normal py-5 text-left sticky table-cell-shadow-right left-6 bg-default-background z-10"
                    ></th> */}
                    <th colSpan={1} className="font-normal py-5 text-left pl-5">
                      Price
                    </th>
                    <th colSpan={1} className="font-normal py-5 text-left">
                      Volume
                    </th>
                    <th colSpan={1} className="font-normal py-5 text-left">
                      24h %
                    </th>
                    <th colSpan={1} className="font-normal py-5 text-left">
                      Market Cap
                    </th>
                    <th colSpan={1} className="font-normal py-5 text-left">
                      Holders
                    </th>
                    <th colSpan={1} className="font-normal py-5 text-left">
                      Circulating Supply
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full xxs:[&>tr>*:nth-child(1)]:w-[10%] xs:[&>tr>*:nth-child(1)]:w-[12%] [&>tr>*:nth-child(2)]:w-[16%] [&>tr>*:nth-child(3)]:w-[18%] [&>tr>*:nth-child(4)]:w-[13%] [&>tr>*:nth-child(5)]:w-[12%] [&>tr>*:nth-child(6)]:w-[12%] [&>tr>*:nth-child(7)]:w-[12%]">
                  {sortedDrc20Data &&
                    sortedDrc20Data.map((drc20, index) => (
                      <Drc20TrendingTableRow
                        key={
                          currentDrc20Page === 1
                            ? index
                            : (currentDrc20Page - 1) * LANDING_PAGE_DRC20_ITEMS_PER_PAGE + index
                        }
                        index={
                          currentDrc20Page === 1
                            ? index + 1
                            : (currentDrc20Page - 1) * LANDING_PAGE_DRC20_ITEMS_PER_PAGE + index + 1
                        }
                        tick={drc20.tick}
                        price={drc20.floorPrice}
                        volume={drc20.volume}
                        percentPriceChange={drc20.changePercent}
                        // transactions={drc20.sales}
                        holders={drc20.holders}
                        currentSupply={Number(drc20.currentSupply)}
                        maxSupply={Number(drc20.maxSupply)}
                        dogePrice={dogePrice}
                      />
                    ))}
                </tbody>
              </table>
            )
          }
        })()}
      </div>

      <div className="flex mt-8 w-full justify-center">
        <nav className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-2">
            <div>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentDrc20Page === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-r-0 border-gray-300 rounded-l-md cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDrc20Page === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentDrc20Page - 1)}
                disabled={currentDrc20Page === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDrc20Page === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardArrowLeft />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Page {currentDrc20Page} of {totalDrc20Pages}
              </p>
            </div>
            <div>
              <button
                onClick={() => handlePageChange(currentDrc20Page + 1)}
                disabled={currentDrc20Page === totalDrc20Pages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDrc20Page === totalDrc20Pages ? '#EFF2F5' : '' }}
              >
                <MdKeyboardArrowRight />
              </button>
              <button
                onClick={() => handlePageChange(totalDrc20Pages)}
                disabled={currentDrc20Page === totalDrc20Pages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDrc20Page === totalDrc20Pages ? '#EFF2F5' : '' }}
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

export default Drc20TrendingTable
