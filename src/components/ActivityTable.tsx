import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react';

import { ActionTypeKeys, getDrc20Activity } from '@/api'
import { ActivitySortTypes, ActivitySortTypeToActivity } from '@/types/common'
import { truncateAddress } from '@/utils'
import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'

const ITEMS_PER_PAGE = 20

type ActivityTableProps = {
  tick: string
  searchValue: string
  dogecoinPriceInUsd: number
  activityType?: ActivitySortTypes
  handleRefresh: () => void
}

type Drc20Activity = {
  tick: string
  inscriptionNumber: number
  inscriptionId: string
  type: string
  price: number
  totalPrice: number
  amount: number
  from: string
  to: string
  createdAt: string
}

type Activity = {
  inscriptionNumber: string
  inscriptionId: string
  type: string
  price: string
  total: string
  amount: string
  fromAddress: string
  toAddress: string
  time: string
}

enum Columns {
  Inscription = 'inscriptionNumber',
  Type = 'type',
  Price = 'price',
  TotalPrice = 'total',
  Quantity = 'amount',
  From = 'fromAddress',
  To = 'toAddress',
  Time = 'time',
}

const ActivityTable = ({ tick, searchValue, dogecoinPriceInUsd, activityType, handleRefresh }: ActivityTableProps) => {
  searchValue;
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [currentItems, setCurrentItems] = useState<Activity[]>()
  const [sortedItems, setSortedItems] = useState<Activity[]>()
  const [sortBy, setSortBy] = useState({
    column: Columns.Time,
    ascending: false,
  })

  useEffect(() => {
    const fetchActivityData = async () => {
      const action: ActionTypeKeys | undefined = activityType && ActivitySortTypeToActivity[activityType]
      const drc20Activities = await getDrc20Activity({
        tick,
        action,
        limit: ITEMS_PER_PAGE.toString(),
        offset: (currentPage - 1).toString(),
      })

      const currentItems = drc20Activities.activities.map((drc20Activity: Drc20Activity) => ({
        inscriptionNumber: drc20Activity.inscriptionNumber?.toString(),
        type: drc20Activity.type,
        price: drc20Activity.price?.toString(),
        total: drc20Activity.totalPrice?.toString(),
        amount: drc20Activity.amount?.toString(),
        fromAddress: drc20Activity.from,
        toAddress: drc20Activity.to,
        time: drc20Activity.createdAt,
        inscriptionId: drc20Activity.inscriptionId,
      }))

      setTotalPages(Math.ceil(drc20Activities.total / ITEMS_PER_PAGE))
      setCurrentItems(currentItems)
      setSortedItems(currentItems)
    }
    fetchActivityData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityType, handleRefresh, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleActionTypeStyling = (actionType: string) => {
    if (actionType === 'sale') {
      return 'bg-[#23D581] bg-opacity-20 text-[#23D581]'
    } else if (actionType === 'list') {
      return 'bg-[#0E61FF] bg-opacity-20 text-[#0E61FF]'
    } else {
      return 'bg-[#E82C44] bg-opacity-20 text-[#E82C44]'
    }
  }

  const handleHeaderClick = (column: Columns) => {
    if (column === sortBy.column) {
      setSortBy({ column, ascending: !sortBy.ascending })
    } else {
      setSortBy({ column, ascending: true })
    }
  }

  useEffect(() => {
    if (currentItems) {
      const newCurrentItems = [...currentItems!]
      const newSortedItems = newCurrentItems!.sort((a, b) => {
        const valueA = a[sortBy.column]
        const valueB = b[sortBy.column]

        const isNumeric = !isNaN(Number(valueA)) && !isNaN(Number(valueB))

        if (isNumeric) {
          const numericA = parseFloat(valueA)
          const numericB = parseFloat(valueB)
          return sortBy.ascending ? numericA - numericB : numericB - numericA
        } else {
          const order = sortBy.ascending ? 1 : -1
          return valueA.localeCompare(valueB) * order
        }
      })

      return setSortedItems(newSortedItems)
    }
  }, [currentItems, sortBy])

  const getMaximumFractionDigits = (num: number) => {
    const parts = num.toString().split('.')
    let maximumFractionDigits = 2
    if (!parts[1]) return maximumFractionDigits

    if (num < 1) {
      // Iterate through the string to find the first non-zero digit after the decimal point
      for (let i = 0; i < parts[1].length; i++) {
        if (parts[1][i] !== '0') {
          // Determine the number of decimal places needed
          maximumFractionDigits = i + 3
          break
        }
      }
    }

    return maximumFractionDigits
  }

  return (
    <div>
      <div className="w-full overflow-x-scroll overflow-y-hidden">
        <table className="w-full min-w-[1000px] table-fixed">
          <thead className="border-b-2 border-account-page-default w-full">
            <tr className="text-xs">
              <th
                className="font-normal py-5 text-left sticky left-0 table-cell-shadow-right bg-[#000]"
                onClick={() => handleHeaderClick(Columns.Inscription)}
              >
                <button className="focus:outline-none">
                  Inscription {sortBy.column === Columns.Inscription ? (sortBy.ascending ? '▼' : '▲') : ''}
                </button>
              </th>
              <th className="font-normal py-5 pl-4 md:pl-2 text-left">Type</th>
              <th className="font-normal py-5 text-left" onClick={() => handleHeaderClick(Columns.Price)}>
                <button className="focus:outline-none">
                  Price {sortBy.column === Columns.Price ? (sortBy.ascending ? '▼' : '▲') : ''}
                </button>
              </th>
              <th className="font-normal py-5 text-left" onClick={() => handleHeaderClick(Columns.TotalPrice)}>
                <button className="focus:outline-none">
                  Total Price {sortBy.column === Columns.TotalPrice ? (sortBy.ascending ? '▼' : '▲') : ''}
                </button>
              </th>
              <th className="font-normal py-5 text-left" onClick={() => handleHeaderClick(Columns.Quantity)}>
                <button className="focus:outline-none">
                  Quantity {sortBy.column === Columns.Quantity ? (sortBy.ascending ? '▼' : '▲') : ''}
                </button>
              </th>
              <th className="font-normal py-5 text-left">From</th>
              <th className="font-normal py-5 text-left">To</th>
              <th className="font-normal py-5 text-left" onClick={() => handleHeaderClick(Columns.Time)}>
                <button className="focus:outline-none">
                  Time {sortBy.column === Columns.Time ? (sortBy.ascending ? '▼' : '▲') : ''}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="[&>tr>*:nth-child(1)]:w-[10%] [&>tr>*:nth-child(2)]:w-[10%] [&>tr>*:nth-child(3)]:w-[10%] [&>tr>*:nth-child(4)]:w-[15%] [&>tr>*:nth-child(5)]:w-[10%] [&>tr>*:nth-child(6)]:w-[15%] [&>tr>*:nth-child(7)]:w-[15%] [&>tr>*:nth-child(8)]:w-[15%]">
            {sortedItems &&
              sortedItems
                // .filter(
                //   (activity: Activity) =>
                //     activity.amount.includes(searchValue) ||
                //     activity.fromAddress.includes(searchValue) ||
                //     activity.toAddress.includes(searchValue) ||
                //     activity.inscriptionNumber.includes(searchValue) ||
                //     activity.price.includes(searchValue) ||
                //     activity.time.includes(searchValue) ||
                //     activity.total.includes(searchValue) ||
                //     activity.type.includes(searchValue)
                // )
                .map((activity: Activity, index) => (
                  <tr key={index} className="text-xxs">
                    <td className="py-5 text-left sticky left-0 bg-[#000] table-cell-shadow-right" style={{color:'#fff'}}>
                      <a
                        href={`https://wonky-ord.dogeord.io/shibescription/${activity.inscriptionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="">#{activity.inscriptionNumber}</span>
                      </a>
                    </td>
                    <td className="py-5 pl-4 md:pl-2 text-left pr-6 w-full">
                      <div
                        className={`text-center w-16 py-[1px] rounded-[3px] ${handleActionTypeStyling(activity.type)}`}
                      >
                        {activity.type.charAt(0).toUpperCase() + activity.type?.slice(1)}
                      </div>
                    </td>
                    <td className="py-5 text-left">
                      <div className="flex flex-col whitespace-nowrap">
                        <span>
                          {(Number(activity.price) / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: getMaximumFractionDigits(
                              Number(activity.price) / ONE_DOGE_IN_SHIBES
                            ),
                          })}{' '}
                          DOGE
                        </span>
                        <span className="text-slate-500 text-xxxs">
                          $
                          {((Number(activity.price) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: getMaximumFractionDigits(
                                (Number(activity.price) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd
                              ),
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-left">
                      <div className="flex flex-col whitespace-nowrap">
                        <span>
                          {(Number(activity.total) / ONE_DOGE_IN_SHIBES).toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: getMaximumFractionDigits(
                              Number(activity.total) / ONE_DOGE_IN_SHIBES
                            ),
                          })}{' '}
                          DOGE
                        </span>
                        <span className="text-slate-500 text-xxxs">
                          $
                          {((Number(activity.total) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd).toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: getMaximumFractionDigits(
                                (Number(activity.total) / ONE_DOGE_IN_SHIBES) * dogecoinPriceInUsd
                              ),
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-left">
                      {Number(activity.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td
                      className="py-5 text-left hover:cursor-pointer hover:underline"
                      onClick={() => navigate(`/account/${activity.fromAddress}`)}
                    >
                      {truncateAddress(activity.fromAddress)}
                    </td>
                    <td
                      className="py-5 text-left hover:cursor-pointer hover:underline"
                      onClick={() => navigate(`/account/${activity.toAddress}`)}
                    >
                      {activity.toAddress ? truncateAddress(activity.toAddress) : '-'}
                    </td>
                    <td className="py-5 text-left">
                      {activity.time &&
                        activity.time.length > 0 &&
                        new Intl.DateTimeFormat('en-GB', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          second: 'numeric',
                          hour12: false,
                          timeZone: 'UTC',
                        }).format(new Date(activity.time))}{' '}
                      (UTC)
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
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

export default ActivityTable
