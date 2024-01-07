import { Button, MenuProps } from 'antd'
import { useFetch } from 'usehooks-ts'
import { useEffect, useState, useMemo } from 'react';

import { ReloadIcon } from '@/assets/icons/reload'
import { Listing } from '@/types/listing'
import { toTimestamp } from '@/utils'

import ErrorSection from './ErrorSection'
import FilterTooltip from './FilterTooltip'
import InputField from './InputField'
import ListingCard from './ListingCard'
import LoadingSection from './LoadingSection'
import { Pagination } from './Pagination'

type ListingsProps = {
  filter: string | null
  onChangeFilter: (filter: string | null) => void
  sortingOptions: MenuProps['items']
  onChangeSorting: (sorting: number) => void
  sorting: number
}

const Listings = ({ filter, onChangeFilter, sorting = 1, sortingOptions, onChangeSorting }: ListingsProps) => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const url = `${baseUrl}/trading/listings?size=10000&page=0&status=listed`

  let { data: fetchedData, error: fetchedError } = useFetch<Listing[]>(url)
  const [data, setData] = useState<Listing[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isLoading = useMemo(() => !error && !data, [error, data])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(20)
  setItemsPerPage(20)

  const refetch = async () => {
    setData(null)
    setError(null)
    try {
      const response = await fetch(url)
      const responseData = await response.json()
      if (response.ok) {
        setData(responseData)
      }
    } catch (error) {
      setError('Could not fetch listings.')
    }
  }

  const sortList = (toSort: any[], sorting: number) => {
    switch (sorting) {
      case 1:
        return toSort.sort((a, b) => b.dogePerToken - a.dogePerToken)
      case 2:
        return toSort.sort((a, b) => a.dogePerToken - b.dogePerToken)
      case 3:
        return toSort.sort((a, b) => toTimestamp(b.listedAt) - toTimestamp(a.listedAt))
      case 4:
        return toSort.sort((a, b) => toTimestamp(a.listedAt) - toTimestamp(b.listedAt))
      default:
        return toSort
    }
  }

  const filteredData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return null
    let filtered = sortList(data, sorting)

    if (filter) {
      filtered = filtered.filter(
        (item) =>
          item.tokenName.toLowerCase().includes(filter.toLowerCase()) ||
          item.tokenSymbol.toLowerCase().includes(filter.toLowerCase())
      )
    }
    return filtered
  }, [data, filter, sorting])

  const totalPageCount = useMemo(
    () => (filteredData?.length ? Math.ceil(filteredData.length / itemsPerPage) : 1),
    [filteredData, itemsPerPage]
  )

  const currentPageItems = useMemo(() => {
    if (!filteredData || filteredData.length < 1) return null

    return sortList(filteredData, sorting)?.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage, sorting])

  useEffect(() => {
    isLoading && setIsLoadingMore(false)
  }, [isLoading])

  useEffect(() => {
    if (filter && filter.length > 0) {
      setCurrentPage(0)
    }
  }, [totalPageCount, currentPageItems, filter])

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData)
    }
    if (fetchedError) {
      setError('Could not fetch listings.')
    }
  }, [fetchedData, fetchedError])

  return (
    <div className="flex-col-start">
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <FilterTooltip
          disabled={isLoading}
          // @ts-ignore
          activeItem={sortingOptions.find((item) => Number(item.key) === Number(sorting)) ?? sortingOptions[0]}
          items={sortingOptions}
          onClick={(d) => {
            const options = [1, 2, 3, 4]
            const newSorting = Number(d.key)
            options.includes(newSorting) && onChangeSorting(newSorting)
          }}
          style={{ width: '240px', margin: '0 0 0 24px', fontWeight: 'bold' }}
        />
        <Button
          onClick={() => {
            setIsLoadingMore(isLoadingMore ? false : true)
            refetch()
            setCurrentPage(0)
          }}
          disabled={isLoading}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid #F6F6F6',
            borderRadius: '16px',
            marginLeft: '24px',
          }}
        >
          <ReloadIcon className={isLoadingMore && `rotating`} />
        </Button>
      </div>
      <div style={{ width: '320px', marginBlockStart: '24px' }}>
        <InputField
          disabled={isLoading}
          label="Search"
          value={filter ?? ''}
          onChange={(event) => {
            onChangeFilter(event.target.value)
          }}
          placeholder="Search..."
        />
      </div>
      {error && <ErrorSection refetch={refetch} />}
      {isLoading && <LoadingSection />}
      <div
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 300px)',
          gridGap: '1rem',
          justifyContent: 'space-between',
        }}
        id="listingsTable"
      >
        {!error && currentPageItems?.map((item) => <ListingCard {...item} />)}
      </div>
      {!error && currentPageItems && (
        <Pagination
          id="listingsTable"
          nextPage={() => setCurrentPage(currentPage + 1)}
          canNextPage={currentPage < totalPageCount - 1}
          canPreviousPage={currentPage > 0}
          previousPage={() => setCurrentPage(currentPage - 1)}
          gotoPage={(page) => setCurrentPage(page)}
          pageIndex={currentPage}
          pageCount={totalPageCount}
          bottomBorder="none"
        />
      )}
    </div>
  )
}

export default Listings
