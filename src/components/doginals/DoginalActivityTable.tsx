import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
  } from 'react-icons/md'
  import { useNavigate } from 'react-router'
  import React, { useEffect, useState, useMemo, useCallback } from 'react';  
  import { getDoginalOfferActivity, getDrc20Activity } from '@/api'
  import { ActivitySortTypes, ActivitySortTypeToActivity } from '@/types/common'
  import { truncateAddress } from '@/utils'
  import { ONE_DOGE_IN_SHIBES } from '@/utils/constants'
  
  const ITEMS_PER_PAGE = 20
  
  type ActivityTableProps = {
    collectionSymbol: string
    searchValue: string
    dogecoinPriceInUsd: number
    activityType?: ActivitySortTypes
    handleRefresh: () => void
  }
  
  type DoginalOfferActivity = {
    collectionSymbol: string
    doginalName: string
    inscriptionNumber: number
    inscriptionId: string
    type: string
    price: number
    from: string
    to: string
    createdAt: string
  }
  
  type Activity = {
    collectionSymbol: string
    doginalName: string
    inscriptionNumber: string
    inscriptionId: string
    type: string
    price: string
    total: string
    fromAddress: string
    toAddress: string
    time: string
  }
  
  enum Columns {
    Inscription = 'inscriptionNumber',
    Type = 'type',
    Price = 'price',
    TotalPrice = 'total',
    From = 'fromAddress',
    To = 'toAddress',
    Time = 'time',
  }
  
  const ActivityTable = ({
    collectionSymbol,
    searchValue,
    dogecoinPriceInUsd,
    activityType,
    handleRefresh,
  }: ActivityTableProps) => {
    const navigate = useNavigate()
    const [activityTable, setActivityTable] = useState<Activity[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [currentItems, setCurrentItems] = useState<Activity[]>()
    const [sortedItems, setSortedItems] = useState<Activity[]>()
    const [sortBy, setSortBy] = useState({
      column: Columns.Time,
      ascending: false,
    })
  
    useEffect(() => {
      const fetchActivityData = async () => {
        const action: 'sale' | 'list' | 'unlist' | undefined = activityType && ActivitySortTypeToActivity[activityType]
        const doginalActivities = await getDoginalOfferActivity(collectionSymbol, action)
  
        if (doginalActivities && doginalActivities.length > 0) {
          const activityTable = doginalActivities.map((doginalActivity: DoginalOfferActivity) => ({
            collectionSymbol: doginalActivity.collectionSymbol,
            doginalName: doginalActivity.doginalName,
            inscriptionNumber: doginalActivity.inscriptionNumber.toString(),
            inscriptionId: doginalActivity.inscriptionId,
            type: doginalActivity.type,
            price: doginalActivity.price.toString(),
            total: doginalActivity.price.toString(),
            fromAddress: doginalActivity.from,
            toAddress: doginalActivity.to,
            time: doginalActivity.createdAt,
          }))
          setActivityTable(activityTable)
        }
      }
      fetchActivityData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityType, handleRefresh])
  
    useEffect(() => {
      if (activityTable) {
        const currentItems = activityTable.slice(
          currentPage === 1 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
        )
  
        const totalPages = activityTable.length === 0 ? 1 : Math.ceil(activityTable.length / ITEMS_PER_PAGE)
  
        setCurrentItems(currentItems)
        setSortedItems(currentItems)
        setTotalPages(totalPages)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activityTable, currentPage])
  
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
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="w-full min-w-[1000px] table-fixed">
            <thead className="border-b-2 border-account-page-default w-full">
              <tr className="text-xs">
                <th
                  className="font-normal py-5 text-left sticky left-0 table-cell-shadow-right bg-[#ffffff]"
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
                      <td className="py-5 text-left sticky left-0 bg-[#ffffff] table-cell-shadow-right">
                        <div
                          className="flex justify-start items-center cursor-pointer"
                          onClick={() =>
                            navigate(`/marketplace/doginals/${activity.collectionSymbol}/${activity.inscriptionId}`)
                          }
                        >
                          <img
                            src={`https://wonky-ord.dogeord.io/content/${activity.inscriptionId}`}
                            alt="doginal"
                            className="w-8 h-8"
                          />
                          <div className="flex flex-col">
                            <span className="ml-1">{activity.doginalName}</span>
                            <span className="ml-1">(#{activity.inscriptionNumber})</span>
                          </div>
                        </div>
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
  