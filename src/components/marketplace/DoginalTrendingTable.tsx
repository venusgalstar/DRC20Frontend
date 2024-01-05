import { useCallback, useMemo, useState } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'

import { LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE } from '@/utils/constants'

import { DoginalsCollection } from '../../types/dogeNft'
import LoadingSpinnerIcon from '../LoadingSpinnerIcon'
import DoginalTrendingTableRow from './DoginalTrendingTableRow'
import { SortByTypes } from './Trending'

type DoginalTrendingTableProps = {
  collections: DoginalsCollection[]
  selectedSortType: SortByTypes
  dogePrice: number
  isSorting: boolean
  setIsSorting: (isSorting: boolean) => void
  currentDogeNftPage: number
  totalDogeNftPages: number
  setCurrentDogeNftPage: React.Dispatch<React.SetStateAction<number>>
}

const DoginalTrendingTable = ({
  collections,
  selectedSortType,
  dogePrice,
  isSorting,
  setIsSorting,
  currentDogeNftPage,
  totalDogeNftPages,
  setCurrentDogeNftPage,
}: DoginalTrendingTableProps) => {
  // const [sortedCollections, setSortedCollections] = useState<DoginalsCollection[]>(collections)

  // const handleSorting = useCallback(() => {
  //   switch (selectedSortType) {
  //     case SortByTypes.VolumeDescending:
  //       return setSortedCollections(
  //         collections.sort((c1: any, c2: any) => Number(c2.totalVolume) - Number(c1.totalVolume))
  //       )
  //     case SortByTypes.VolumeAscending:
  //       return setSortedCollections(
  //         collections.sort((c1: any, c2: any) => Number(c1.totalVolume) - Number(c2.totalVolume))
  //       )
  //     case SortByTypes.PriceAscending:
  //       return setSortedCollections(
  //         collections.sort((c1: any, c2: any) => Number(c1.floorPrice) - Number(c2.floorPrice))
  //       )
  //     case SortByTypes.PriceDescending:
  //       return setSortedCollections(
  //         collections.sort((c1: any, c2: any) => Number(c2.floorPrice) - Number(c1.floorPrice))
  //       )
  //   }

  //   const _ensureAllCasesCovered: never = selectedSortType
  // }, [collections, selectedSortType])

  // useMemo(() => {
  //   if (collections) {
  //     setIsSorting(true)
  //     handleSorting()
  //   }
  //   setIsSorting(false)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [handleSorting])

  const handlePageChange = (page: number) => {
    setIsSorting(true)
    setCurrentDogeNftPage(page)
    setIsSorting(false)
  }

  return (
    <div className="flex flex-col">
      {(() => {
        if (isSorting) {
          return (
            <div className="flex flex-col mt-10 justify-center items-center">
              <h2 className="text-[2rem] font-bold mb-2">Sorting table...</h2>
              <div className="h-[3rem] w-[3rem] text-gray-600 fill-amber-500">
                <LoadingSpinnerIcon />
              </div>
            </div>
          )
        } else {
          return (
            <table className="w-full min-w-[1000px]">
              <thead className="border-b-2 border-[#EFF2F5] w-full">
                <tr>
                  <th colSpan={1} className="font-normal py-5 text-left sticky left-0 bg-default-background">
                    #
                  </th>
                  <th
                    colSpan={1}
                    className="font-normal py-5 text-left sticky table-cell-shadow-right left-5 bg-default-background"
                  >
                    Collection
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Floor Price
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Volume
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Listed
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Sales
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Holders
                  </th>
                  <th colSpan={1} className="font-normal py-5 text-left">
                    Supply
                  </th>
                </tr>
              </thead>
              <tbody className="[&>tr>*:nth-child(1)]:w-[2%] [&>tr>*:nth-child(2)]:w-[100%] [&>tr>*:nth-child(3)]:w-[15%] [&>tr>*:nth-child(4)]:w-[18%] [&>tr>*:nth-child(5)]:w-[15%] [&>tr>*:nth-child(6)]:w-[15%] [&>tr>*:nth-child(7)]:w-[15%]">
                {collections &&
                  collections.map((collection, index) => (
                    <DoginalTrendingTableRow
                      key={
                        currentDogeNftPage === 1
                          ? index
                          : (currentDogeNftPage - 1) * LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE + index
                      }
                      index={
                        currentDogeNftPage === 1
                          ? index + 1
                          : (currentDogeNftPage - 1) * LANDING_PAGE_DOGE_NFT_ITEMS_PER_PAGE + index + 1
                      }
                      imageURI={collection.imageURI}
                      name={collection.name}
                      symbol={collection.symbol}
                      floorPrice={collection.floorPrice}
                      volume={collection.totalVolume}
                      sales={collection.sales}
                      holders={collection.holders}
                      supply={collection.supply}
                      dogePrice={dogePrice}
                      totalListed={collection.totalListed}
                      visible={collection.visible}
                    />
                  ))}
              </tbody>
            </table>
          )
        }
      })()}

      <div className="flex mt-8 w-full justify-center">
        <nav className="flex items-center justify-between">
          <div className="flex items-center justify-between gap-2">
            <div>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentDogeNftPage === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-r-0 border-gray-300 rounded-l-md cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDogeNftPage === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardDoubleArrowLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentDogeNftPage - 1)}
                disabled={currentDogeNftPage === 1}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDogeNftPage === 1 ? '#EFF2F5' : '' }}
              >
                <MdKeyboardArrowLeft />
              </button>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Page {currentDogeNftPage} of {totalDogeNftPages}
              </p>
            </div>
            <div>
              <button
                onClick={() => handlePageChange(currentDogeNftPage + 1)}
                disabled={currentDogeNftPage === totalDogeNftPages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-gray-300 cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDogeNftPage === totalDogeNftPages ? '#EFF2F5' : '' }}
              >
                <MdKeyboardArrowRight />
              </button>
              <button
                onClick={() => handlePageChange(totalDogeNftPages)}
                disabled={currentDogeNftPage === totalDogeNftPages}
                className="px-2 py-2 text-base font-medium text-gray-500 border border-l-0 border-gray-300 rounded-r-md cursor-pointer hover:bg-account-page-default"
                style={{ backgroundColor: currentDogeNftPage === totalDogeNftPages ? '#EFF2F5' : '' }}
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

export default DoginalTrendingTable
