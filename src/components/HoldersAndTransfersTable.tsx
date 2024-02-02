import { Tooltip } from 'antd'
import { useState, useMemo } from 'react';

import { CautionCircleIcon as CautionIcon } from '@/assets/icons/cautionCircleIcon'
import { QuestionCircleIcon as QuestionIcon } from '@/assets/icons/questionCircleIcon'
import Table from '@/components/Table'
import useMockTokenTransfersInfo from '@/hooks/useMockTokenTransfersInfo'
import useTokenHoldersInfo from '@/hooks/useTokenHoldersInfo'
import { TokenHolderInfo } from '@/types/tokenHolderInfo'
import { TokenTransfersInfo } from '@/types/tokenTransfersInfo'
import { truncateAddress } from '@/utils'

import ErrorSection from './ErrorSection'
import InfoContainer from './InfoContainer'
import LoadingSection from './LoadingSection'
import Progress from './Progress'

// 25.06.23 We are just showing the holders info atm, transfers subtab will be shown through "Segmented" components, once API is ready

type HoldersAndTransfersTableProps = {
  tokenSymbol: string
}
type Tab = 'Holders' | 'Transfers'
type SubTab = 'All' | 'Inscribe-Mint' | 'Inscribe-Transfer' | 'Transfer'

const HoldersAndTransfersTable = ({ tokenSymbol }: HoldersAndTransfersTableProps) => {
  const [_tab, _setTab] = useState<Tab>('Holders')
  const [subTab, _setSubTab] = useState<SubTab>('All')
  const { data: holdersData, error: holdersError } = useTokenHoldersInfo({ tokenSymbol })

  const {
    data: allTransfers,
    error: transfersError,
    refetch: _refetchTransfers,
  } = useMockTokenTransfersInfo({ tokenSymbol })

  const color = (status: TokenTransfersInfo['status'], isBorder: boolean) => {
    switch (status) {
      case 'invalid':
        return '#cd4756'
      case 'pending':
        return '#b7852a'
      default:
        return isBorder ? 'transparent' : '#000'
    }
  }
  const isLoadingHolders = useMemo(() => !holdersError && !holdersData, [holdersError, holdersData])
  const transfersData = useMemo(() => {
    switch (subTab) {
      case 'All':
        return allTransfers
      case 'Inscribe-Mint':
        return allTransfers?.filter((transfer) => transfer.method === 'Inscribe-Mint')
      case 'Inscribe-Transfer':
        return allTransfers?.filter((transfer) => transfer.method === 'Inscribe-Transfer')
      case 'Transfer':
        return allTransfers?.filter((transfer) => transfer.method === 'Transfer')
      default:
        return allTransfers
    }
  }, [allTransfers, subTab])
  const isLoadingTransfers = useMemo(() => !transfersError && !transfersData, [transfersError, transfersData])
  isLoadingTransfers;
  const warning = (status: TokenTransfersInfo['status']) => {
    switch (status) {
      case 'invalid':
        return (
          <Tooltip title={'This transaction is invalid'}>
            <CautionIcon />
          </Tooltip>
        )
      case 'pending':
        return (
          <Tooltip title={'Unconfirmed transaction may become invalid'}>
            <QuestionIcon />
          </Tooltip>
        )
      default:
        return null
    }
  }
  const holdersColumns = [
    {
      id: 'Rank',
      header: () => <div style={{ textAlign: 'left' }}>Rank</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        return (
          <div className="table-cell-shadow-right" style={{ textAlign: 'left', minWidth: '30px' }}>
            {row.original.rank}
          </div>
        )
      },
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      id: 'Address',
      header: () => <div style={{ textAlign: 'left' }}>Address</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div style={{ textAlign: 'left', textTransform: 'capitalize', width: '50px' }}>
            <a
              href={`/account/${row.original.b58Address ? row.original.b58Address : row.original.address}`}
              rel="noopener noreferrer"
              style={{ color: '#fff', textDecoration: 'underline' }}
            >
              {truncateAddress(row.original.b58Address ? row.original.b58Address : row.original.address)}
            </a>
          </div>
        )
      },
      enableGlobalFilter: false,
    },
    {
      id: 'Percentage',
      header: () => <div style={{ textAlign: 'left' }}>Percentage</div>,
      cell: ({ row }: { row: any }) => {
        return <Progress strokeColor="#feb628" percent={row.original.percentage} size="small" />
      },
      enableGlobalFilter: false,
    },
    {
      id: 'Value',
      header: () => <div style={{ textAlign: 'left' }}>Value</div>,
      cell: ({ row }: { row: any }) => {
        return (
          <div style={{ textAlign: 'left', lineHeight: '10px', marginBlockEnd: '12px' }}>
            {row.original.value.toLocaleString()}
          </div>
        )
      },
      enableGlobalFilter: false,
    },
  ]
  const transfersColumns = [
    {
      id: 'Number',
      header: () => <div>Number</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        return <div className="table-cell-shadow-right">{`#${row.original.number}`}</div>
      },
      enableColumnFilter: true,
      enableGlobalFilter: true,
    },
    {
      id: 'Method',
      header: () => <div>Method</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { status, method } = row.original
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: '#F6F6F6',
                borderRadius: '0px',
                margin: '6px',
                padding: '6px',
                border: `1px solid ${color(status, true)}`,
              }}
            >
              {method}
            </div>
          </div>
        )
      },
      enableGlobalFilter: true,
    },
    {
      id: 'Quantity',
      header: () => <div>Quantity</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { quantity } = row.original
        return <div>{quantity.toLocaleString()}</div>
      },
      enableGlobalFilter: true,
    },
    {
      id: 'Balance',
      header: () => <div>Balance</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { balance } = row.original
        return <div>{balance ? balance.toLocaleString() : '-'}</div>
      },
      enableGlobalFilter: true,
    },
    {
      id: 'From',
      header: () => <div>From</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { from } = row.original
        return <div>{from ? truncateAddress(from) : '-'}</div>
      },
      enableGlobalFilter: true,
    },
    {
      id: 'To',
      header: () => <div>To</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { to } = row.original
        return <div>{truncateAddress(to)}</div>
      },
      enableGlobalFilter: true,
    },
    {
      id: 'Date Time',
      header: () => <div>Date Time</div>,
      accessorFn: (row: any) => row.tick,
      cell: ({ row }: { row: any }) => {
        const { status, dateTime } = row.original
        return (
          <div>
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: color(status, false) }}
            >
              {dateTime} {warning(status)}
            </a>
          </div>
        )
      },
      enableGlobalFilter: true,
    },
  ]
  transfersColumns;
  
  return (
    <>
      {holdersError && <ErrorSection />}
      {isLoadingHolders && <LoadingSection />}
      {!holdersError && holdersData && (
        <InfoContainer
          head={
            <h2 style={{ fontWeight: 'bold', marginBlockEnd: '0px', textAlign: 'left' }}>Holders</h2>
            //   <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
            //     <Segmented
            //       size="large"
            //       options={['Holders', 'Transfers']}
            //       defaultValue={'Holders'}
            //       onChange={(tab) => {
            //         setTab(tab as Tab)
            //       }}
            //     />
            //   </div>
          }
          body={
            <div style={{ paddingBlockStart: '24px' }}>
              {/* {tab === 'Holders' ? ( */}

              <Table
                data={holdersData as TokenHolderInfo[]}
                columns={holdersColumns}
                hasSearch={false}
                tableId="holdersTable"
              />

              {/* ) : (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <Segmented
                    size="large"
                    options={['All', 'Inscribe-Mint', 'Inscribe-Transfer', 'Transfer']}
                    defaultValue={'All'}
                    onChange={(subTab) => {
                      setSubTab(subTab as SubTab)
                    }}
                    style={{ marginBlockEnd: '24px' }}
                  />
                  {transfersError && <ErrorSection refetch={refetchTransfers} />}
                  {isLoadingTransfers && <LoadingSection />}
                  {!transfersError && transfersData && (
                    <Table
                      rowHeight={20}
                      data={transfersData}
                      columns={transfersColumns}
                      hasSearch={false}
                      tableId="transfersTable"
                    />
                  )}
                </div>
              )} */}
            </div>
          }
        />
      )}
    </>
  )
}

export default HoldersAndTransfersTable
