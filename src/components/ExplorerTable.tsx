import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  // getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Popover, Progress } from 'antd'
import debounce from 'lodash.debounce'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useFetch, useWindowSize } from 'usehooks-ts'

import PercentValue from '@/components/PercentValue'
import TicksVerifiedAndImage from '@/components/TicksVerifiedAndImage'
import { FetchResult } from '@/types/IExplorer'
import { currencyFormatter, numberFormatter } from '@/utils/numberFormatter'

import InputField from './InputField'
import { Pagination } from './Pagination'

const DEFAULT_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE_MOBILE = 100

export const featuredTicks = ['fiwb']
export const Table = ({
  baseUrl,
  columns,
  hasSearch = true,
  tableId,
  rowHeight = 60,
}: {
  extTableData?: any[]
  baseUrl: string
  columns: any[]
  hasSearch?: boolean
  tableId: string
  rowHeight?: number
}) => {
  const { width } = useWindowSize()
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageCount, setPageCount] = useState(-1)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: width < 768 ? DEFAULT_PAGE_SIZE_MOBILE : DEFAULT_PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  let { data, error } = useFetch<FetchResult>(
    `${baseUrl}?size=${pageSize}&page=${pageIndex + 1}&filterByTick=${globalFilter}`
  )
  /* @ts-ignore */
  const tableData = (data?.data || []).sort((a, b) => {
    if (featuredTicks.includes(a.tick)) return -1
    if (featuredTicks.includes(b.tick)) return 1
    return 0
  })

  const [searchFieldValue, setSearchFieldValue] = useState('')
  const setGlobalFilterDebounced = useRef(debounce(setGlobalFilter, 500)).current

  const onSearchInputChange = (event: any) => {
    setSearchFieldValue(event.target.value)
    if (event.target.value.length >= 2) {
      setGlobalFilterDebounced(event.target.value)
      setPagination({ pageIndex: 0, pageSize })
      setPageCount(1)
    } else {
      setGlobalFilter('')
      data?.totalPages && setPageCount(data.totalPages)
    }
  }

  const table = useReactTable({
    columns,
    data: tableData,
    initialState: {
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount,
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
  })

  useEffect(() => {
    if (data?.totalPages && globalFilter.length < 2) {
      setPageCount(data.totalPages)
    }
  }, [globalFilter, setPageCount, data])

  return (
    <div
      style={{
        margin: 'auto',
        marginBottom: '64px',
        width: '100%',
      }}
    >
      {error && <p>There is an error loading data.</p>}
      {!error && !data && <p>Loading...</p>}
      {data && hasSearch && (
        <div style={{ width: '320px' }}>
          <InputField label="Search" value={searchFieldValue} onChange={onSearchInputChange} placeholder="Search..." />
        </div>
      )}
      {data && (
        <div
          className="drc20Table-responsive"
          style={{
            position: 'relative',
            borderTop: '2px solid #f5f5f5',
            borderLeft: '0',
            borderRight: '0',
            // overflow: 'scroll',
            width: '100%',
          }}
        >
          <table
            id={tableId}
            className="drc20Table w-100%"
            style={{
              minWidth: '1000px',
              position: 'relative',
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    lineHeight: width < 768 ? '40px' : '60px',
                    width: '100%',
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        position: 'sticky',
                        top: 0,
                        backgroundColor: '#feffff',
                        zIndex: 3,
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    fontSize: '14px',
                    lineHeight: width < 768 ? '60px' : `${rowHeight}px`,
                    borderBottom: '2px solid #f5f5f5',
                    backgroundColor: '#feffff',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && (
        <Pagination
          id={tableId}
          nextPage={() => table.nextPage()}
          canNextPage={table.getCanNextPage()}
          canPreviousPage={table.getCanPreviousPage()}
          previousPage={() => table.previousPage()}
          gotoPage={(page) => table.setPageIndex(page)}
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
        />
      )}
    </div>
  )
}

export const BaseColumns = {
  tick: () => ({
    id: 'tick',
    header: (cellContent: any) => (
      <div className="text-left pl-4" style={{ minWidth: '100px' }}>
        Name
      </div>
    ),
    accessorFn: (row: any) => row.tick,
    cell: ({ row }: { row: any }) => {
      return (
        <TicksVerifiedAndImage
          tick={row?.original?.tick}
          trustLevel={row?.original?.trustLevel}
          featured={row?.original?.featured}
          featuredTicks={featuredTicks}
        />
      )
    },
    enableColumnFilter: true,
    enableGlobalFilter: true,
  }),
  price: () => ({
    id: 'price',
    header: () => (
      <div className="text-right" style={{ minWidth: '65px' }}>
        Price
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '65px' }}>
          <div>{currencyFormatter(row.original.price, true)}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  change24h: () => ({
    id: 'change24h',
    header: () => (
      <div className="text-right" style={{ minWidth: '65px' }}>
        24h %
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '65px' }}>
          <div>
            <PercentValue value={row.original.change24h || 0} />
          </div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  change7d: () => ({
    id: 'change7d',
    header: () => (
      <div className="text-right" style={{ minWidth: '65px' }}>
        7d %
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '65px' }}>
          <div>
            <PercentValue value={row.original.change7d || 0} />
          </div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  marketCap: () => ({
    id: 'marketCap',
    header: () => (
      <div className="text-right" style={{ minWidth: '85px' }}>
        Market Cap
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '85px' }}>
          <div>{currencyFormatter(row.original.marketCap)}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  volume24h: () => ({
    id: 'volume24h',
    header: () => (
      <div className="text-right" style={{ minWidth: '85px' }}>
        Volume 24h
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '85px' }}>
          <div>{currencyFormatter(row.original.volume24h)}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  supply: () => ({
    id: 'supply',
    header: () => <div className="text-center pl-8">Circulating Supply</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex flex-col pl-8">
          <div className="flex flex-row" style={{ lineHeight: '24px', justifyContent: 'space-between' }}>
            <div>{row.original.minted < row.original.supply && numberFormatter(row.original.minted, true, true)}</div>
            <div>{numberFormatter(row.original.supply, true, true)}</div>
          </div>
          <div className="w-100%" style={{ lineHeight: '24px', alignSelf: 'end' }}>
            <Popover
              content={<div>{parseFloat(((row.original.minted / row.original.supply) * 100).toFixed(2))}%</div>}
              trigger="hover"
              placement="bottom"
            >
              <Progress
                percent={parseFloat(((row.original.minted / row.original.supply) * 100).toFixed(2))}
                strokeColor="#c9d0df"
                showInfo={false}
              />
            </Popover>
          </div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  holders: () => ({
    id: 'holders',
    header: () => (
      <div className="text-right" style={{ minWidth: '120px' }}>
        Holders
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '120px' }}>
          <div>{numberFormatter(row.original.holders, false, true)}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  limitPerMint: () => ({
    id: 'limitPerMint',
    header: () => (
      <div className="text-right" style={{ minWidth: '100px' }}>
        Limit per mint
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '100px' }}>
          <div>{numberFormatter(row.original.limitPerMint, false, true)}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  mintingTransactions: () => ({
    id: 'mintingTransactions',
    header: () => (
      <div className="text-right" style={{ minWidth: '100px' }}>
        Minting Transactions
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-end" style={{ minWidth: '100px' }}>
          <div>
            {numberFormatter(
              row.original.mintingTransactions > 0
                ? row.original.mintingTransactions
                : row.original.minted / row.original.limitPerMint,
              false,
              true
            )}
          </div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  added: () => ({
    id: 'added',
    header: () => (
      <div className="text-center" style={{ minWidth: '80px' }}>
        Added
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center" style={{ minWidth: '80px' }}>
          <div>{new Date(row.original.added).toLocaleDateString()}</div>
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
  actionButtons: () => ({
    id: 'actionButtons',
    header: () => (
      <div className="text-center" style={{ minWidth: '72px' }}>
        Actions
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center" style={{ minWidth: '72px' }}>
          {row.original.minted >= row.original.supply ? (
            <Button
              onClick={() => (location.href = `/marketplace/drc20/${row.original.tick}`)}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #feb628',
                color: '#feb628',
                fontWeight: 'bold',
                width: '72px',
              }}
            >
              Trade
            </Button>
          ) : (
            <Button
              onClick={() => (location.href = `/service/inscribe/${row.original.tick}/${row.original.limitPerMint}`)}
              disabled={row.original.minted >= row.original.supply}
              style={{
                backgroundColor: row.original.minted >= row.original.supply ? '#c9d0df' : '#feb628',
                border: '0',
                color: '#fff',
                fontWeight: 'bold',
                width: '72px',
              }}
            >
              Mint
            </Button>
          )}
        </div>
      )
    },
    enableGlobalFilter: false,
  }),
}
