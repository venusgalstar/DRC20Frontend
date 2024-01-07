import { Button } from 'antd'
import { useFetch } from 'usehooks-ts'
import React, { useEffect, useState, useMemo } from 'react';

import { ReloadIcon } from '@/assets/icons/reload'
import BaseButton from '@/components/BaseButton'
import Table from '@/components/Table'
import { Listing } from '@/types/listing'
import { truncateAddress, trustLevelBadge } from '@/utils'
import { formatTimestamp } from '@/utils/numberFormatter'

import FilterTooltip from './FilterTooltip'
import TokenNameWithTrustLevel from './TokenNameWithTrustLevel'

const sortingOptions = [
  { key: 1, label: 'All Events' },
  { key: 2, label: 'Listed' },
  { key: 3, label: 'Sold' },
  { key: 4, label: 'Unlisted' },
]

const Orders = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [sorting, setSorting] = useState<number>(1)
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const url = useMemo(() => {
    switch (sorting) {
      case 1:
        return `${baseUrl}/trading/listings?size=10000&page=0`
      case 2:
        return `${baseUrl}/trading/listings?size=10000&page=0&status=listed`
      case 3:
        return `${baseUrl}/trading/listings?size=10000&page=0&status=sold`
      case 4:
        return `${baseUrl}/trading/listings?size=10000&page=0&status=unlisted`
      default:
        return `${baseUrl}/trading/listings?size=10000&page=0`
    }
  }, [baseUrl, sorting])
  let { data: fetchedData, error: fetchedError } = useFetch<Listing[]>(url)
  const [data, setData] = useState<Listing[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isLoading = useMemo(() => !error && !data, [error, data])

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
  const columns = [
    {
      id: 'token',
      header: ({ row }: { row: any }) => (
        <div className="text-center pl-4" style={{ minWidth: '70px' }}>
          Token
        </div>
      ),
      accessorFn: (row: any) => row.tokenName,
      cell: ({ row }: { row: any }) => {
        const { tokenName } = row.original

        return (
          <div
            className="flex flex-row justify-center pl-4 table-cell-shadow-right"
            style={{ minWidth: '70px', fontWeight: 'bold' }}
          >
            <a href={`/drc20/${tokenName.toLowerCase()}`} target="_blank" rel="noopener noreferrer">
              <span style={{ fontWeight: 'bold', textAlign: 'left', color: '#000', textDecoration: 'none' }}>
                {tokenName.toLowerCase()}
              </span>
            </a>
            <TokenNameWithTrustLevel tokenName={tokenName} />
          </div>
        )
      },
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      id: 'event',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          Event
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        const lastEvent = row.original.history[row.original.history.length - 1]
        const eventColor = lastEvent.status == 'listed' ? '#4da474' : lastEvent.status == 'sold' ? '#bf3f4d' : '#000'

        return (
          <div className="flex-center" style={{ minWidth: '65px', width: '100%' }}>
            <span style={{ display: 'inline-block', color: eventColor, textTransform: 'capitalize' }}>
              {lastEvent.status}
            </span>
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'price',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          Price
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div
            style={{
              minWidth: '65px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ display: 'inline-block', lineHeight: 'normal' }}>
                <span style={{ marginInlineEnd: '6px' }}>{row.original.dogePerToken}</span>
                <span
                  style={{ color: '#8a8a8a' }}
                  className="text-xs"
                >{`doge/${row.original.tokenSymbol.toLowerCase()}`}</span>
              </span>
              <span className="text-xs" style={{ display: 'inline-block' }}>
                {`$ ${Number(row.original.dogePerToken * row.original.tokenAmount.toFixed(2)).toLocaleString()}`}
              </span>
            </div>
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'quantity',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          Quantity
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="flex-center" style={{ minWidth: '65px' }}>
            <div>{row.original.tokenAmount.toLocaleString()} </div>
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'value',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          Value
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div style={{ minWidth: '65px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ display: 'inline-block', lineHeight: 'normal' }}>
                <span style={{ marginInlineEnd: '6px' }}>
                  {(row.original.dogePerToken * row.original.tokenAmount).toLocaleString()}
                </span>
                <span className="text-xs" style={{ color: '#8a8a8a' }}>
                  doge
                </span>
              </span>
              <span className="text-xs" style={{ display: 'inline-block' }}>{`$ ${(
                row.original.dogePerToken *
                row.original.tokenAmount *
                row.original.dogeDollarPrice
              ).toLocaleString()}`}</span>
            </div>
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'from',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          From
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center" style={{ minWidth: '65px' }}>
            {truncateAddress(row.original.from)}
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'To',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          To
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center" style={{ minWidth: '65px' }}>
            {row.original.to ? truncateAddress(row.original.to) : '-'}
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'Time',
      header: () => (
        <div className="text-center" style={{ minWidth: '65px' }}>
          Time
        </div>
      ),
      cell: ({ row }: { row: any }) => {
        return (
          <div className="text-center" style={{ minWidth: '65px' }}>
            {formatTimestamp(row.original.history[row.original.history.length - 1].timestamp)}
          </div>
        )
      },
      enableGlobalFilter: false,
    },
  ]

  useEffect(() => {
    isLoading && setIsLoadingMore(false)
  }, [isLoading])

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
          activeItem={sortingOptions.find((item) => Number(item.key) === Number(sorting)) ?? sortingOptions[0]}
          items={sortingOptions}
          onClick={(d) => {
            const options = [1, 2, 3, 4]
            const newSorting = Number(d.key)
            options.includes(newSorting) && setSorting(newSorting)
          }}
          style={{ width: '120px', margin: '0 0 0 24px', fontWeight: 'bold' }}
        />
        <Button
          onClick={() => {
            setIsLoadingMore(isLoadingMore ? false : true)
            refetch()
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
      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p>There is an error loading data.</p>
          <BaseButton onClick={refetch}>Try again</BaseButton>
        </div>
      )}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <p className="inline-block" style={{ padding: '16px' }}>
            Loading...
          </p>
        </div>
      )}
      {!error && data && (
        <div
          style={{
            width: '100%',
            margin: '24px 0px 8px',
          }}
        >
          <Table data={data} columns={columns} tableId="ordersTable" />
        </div>
      )}
    </div>
  )
}
export default Orders
