import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  // getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Button, Popover, Progress } from 'antd'
import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useWindowSize } from 'usehooks-ts'

import PercentValue from '@/components/PercentValue'
import TicksVerifiedAndImage from '@/components/TicksVerifiedAndImage'
import { currencyFormatter, numberFormatter } from '@/utils/numberFormatter'

import InputField from './InputField'
import { Pagination } from './Pagination'

export const featuredTicks = ['fiwb']
export const Table = ({
  data,
  columns,
  hasSearch = true,
  tableId,
  rowHeight = 60,
}: {
  data: any[]
  columns: any[]
  hasSearch?: boolean
  tableId: string
  rowHeight?: number
}) => {
  const { width } = useWindowSize()
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    columns,
    data,
    initialState: {
      pagination: {
        pageSize: 100,
      },
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    // debugTable: true,
  })

  useEffect(() => {
    table.setPageSize(width < 768 ? 10 : 100)
  }, [table, width])

  return (
    <div
      style={{
        margin: 'auto',
        marginBottom: '64px',
        width: '100%',
      }}
    >
      {hasSearch && (
        <div style={{ width: '320px' }}>
          <InputField
            label="Search"
            value={globalFilter ?? ''}
            onChange={(event) => {
              setGlobalFilter(event.target.value)
            }}
            placeholder="Search..."
          />
        </div>
      )}
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
    </div>
  )
}

export default Table

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
            <a href="https://discord.gg/mskxdtmJzT" target="_blank" rel="noreferrer">
              <Button
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
            </a>
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
