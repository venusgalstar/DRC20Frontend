import { Button, Tooltip } from 'antd'
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Table, Tbody, Td, Th, Thead, Tr } from 'react-super-responsive-table'
import { useLocalStorage } from 'usehooks-ts'

import InputField from '../../components/InputField'
import ServiceContentContainer from '../../components/ServiceContentContainer'
import PageBase from '../_base'

import '../index.css'

interface BalanceInfo {
  available: string
  transferable: string
}

interface GetBalancesReturnObject {
  balanceData: {
    [key: string]: BalanceInfo
  }
}

interface BalanceInfoData extends BalanceInfo {
  tick: string
}

const Balances = () => {
  const navigator = useNavigate()
  const { walletAddress } = useParams<{ walletAddress: string }>()
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])
  const [data, setData] = useState<GetBalancesReturnObject | null>(null)

  const [inputData, setInputData] = useState<string>('')
  const searchButtonDisabled = inputData.length < 10

  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletAddress || walletAddress.length < 10) {
        return
      }
      const url = `${
        import.meta.env.VITE_API_ENDPOINT_URL || 'https://thedragontest.com/api'
      }/balances/${walletAddress}`

      try {
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      } catch (err) {
        console.error('error fetching balances', err)
      }
    }
    fetchBalances() // Run on initial render.

    const intervalId = setInterval(fetchBalances, 10000) // Run every 10 seconds.

    // Clean up the interval on unmount.
    return () => clearInterval(intervalId)
  }, [walletAddress])

  let balanceInfoData: BalanceInfoData[] = []
  if (data && data.balanceData) {
    // @ts-ignore
    balanceInfoData = Object.entries(data?.balanceData).map(([tick, balanceStr]) => ({
      tick,
      ...balanceStr,
    }))
  }

  const handleInput = (inputData: string) => {
    setInputData(inputData)
  }

  const handleSearch = () => {
    setSearchHistory(
      // @ts-ignore
      [inputData, ...searchHistory.filter((item) => item.trim() !== inputData.trim() && item.length > 10)].slice(0, 10)
    )
    navigator(`/wallet/balances/${inputData}`)
  }

  const stickyHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: '#000',
    color:'#fff',
    zIndex: 3,
  }

  const [hoveredText, setHoveredText] = useState('')

  function getUtf8Codes(str: string) {
    const encoder = new TextEncoder()
    const utf8Bytes = encoder.encode(str)

    return utf8Bytes.join(' ')
  }

  function handleMouseEnter(name: string) {
    const codes = getUtf8Codes(name)
    setHoveredText(`ID: ${codes}`)
  }

  function handleMouseLeave() {
    setHoveredText('')
  }

  return (
    <PageBase>
      {walletAddress && walletAddress.length > 0 ? (
        <div
          style={{
            position: 'relative',
            margin: 'auto',
            marginBottom: '64px',
            width: '100%',
          }}
        >
          <h1>
            <span
              style={{
                display: 'inline-block',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              Wallet Balance
            </span>
          </h1>
          <h2 className="mb-24" style={{ color: '#feb628', fontSize: '12px' }}>
            {walletAddress}
          </h2>
          <div
            style={{
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <Table
              id="balancesTable"
              className="drc20Table w-100%"
              style={{
                minWidth: '1000px',
              }}
            >
              <Thead>
                <Tr
                  style={{
                    // background: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    lineHeight: '60px',
                    width: '100%',
                  }}
                >
                  <Th style={{ textAlign: 'left', paddingLeft: '8px', ...stickyHeaderStyle }}>Name</Th>
                  <Th style={{ textAlign: 'right', ...stickyHeaderStyle }}>Available</Th>
                  <Th style={{ textAlign: 'right', ...stickyHeaderStyle }}>Transferable</Th>
                  <Th style={{ textAlign: 'right', ...stickyHeaderStyle }}>Balance</Th>
                  {/*<Th style={{ textAlign: 'center' }}>Mint</Th>*/}
                </Tr>
              </Thead>
              <Tbody>
                {balanceInfoData?.map((balance: BalanceInfoData, _index: number) => (
                  <Tr
                    style={{
                      background: '#000',
                      color:'#fff',
                      borderBottom: '1px solid #f2f2f2',
                      fontSize: '16px',
                      lineHeight: '80px',
                    }}
                  >
                    <Td
                      className="table-cell-shadow-right"
                      style={{ textAlign: 'left', paddingLeft: '8px' }}
                      onMouseEnter={() => handleMouseEnter(balance.tick)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Tooltip title={hoveredText}>{balance.tick}</Tooltip>
                    </Td>
                    <Td style={{ textAlign: 'right' }}>{balance.available}</Td>
                    <Td style={{ textAlign: 'right' }}>{balance.transferable}</Td>
                    <Td style={{ textAlign: 'right', color: '#d98e29', fontWeight: 'bold' }}>
                      {parseInt(balance.available) + parseInt(balance.transferable)}
                    </Td>
                    {false && (
                      <Td>
                        <Button
                          style={{
                            background: '#feb628',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                          onClick={() => {}} // location.href = `/service/mint/${balanceInfoData[index]['Name / Symbol']}/${balanceInfoData[index]['Limit per mint']}`)
                        >
                          Mint
                        </Button>
                      </Td>
                    )}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
          {!data && (
            <span
              style={{
                display: 'block',
                fontSize: '16px',
                lineHeight: '48px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              Scraping for your tokens can take up to 5 minutes. Please wait a little longer.
            </span>
          )}
        </div>
      ) : (
        <ServiceContentContainer
          title="Check your balance"
          description="Enter your wallet address and get the balances of all your drc-20 tokens."
        >
          <InputField
            label="Wallet address"
            description="Insert the wallet address you want to check the drc-20 token balance for."
            placeholder="Wallet address holding Doginals"
            onChange={(event) => handleInput(event.target.value)}
          />
          <div className="ml-4">
            <h4 className="text-sm font-bold text-black mt-8 text-left">Search History</h4>
            {searchHistory.length === 0 && <p className="text-sm text-gray-400 text-left">No search history yet.</p>}
            {searchHistory.map((address: string) => (
              <a
                onClick={() => navigator(`/wallet/balances/${address}`)}
                style={{ color: '#feb628', display: 'block', textAlign: 'left' }}
              >
                {address}
              </a>
            ))}
          </div>
          <Button
            disabled={searchButtonDisabled}
            onClick={handleSearch}
            style={{
              background: '#feb628',
              border: 'none',
              borderRadius: '16px',
              color: 'white',
              fontWeight: 'bold',
              height: '48px',
              marginRight: '8px',
              marginTop: '128px',
              width: '90%',
            }}
          >
            Load Balance
          </Button>
        </ServiceContentContainer>
      )}
    </PageBase>
  )
}

export default Balances
