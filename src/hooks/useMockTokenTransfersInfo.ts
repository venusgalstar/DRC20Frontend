import { useCallback, useState, useEffect } from 'react'

import { TokenTransfersInfo } from '@/types/tokenTransfersInfo'

const mockData: TokenTransfersInfo[] = [
  {
    number: 1,
    method: 'Transfer',
    quantity: 818,
    balance: null,
    from: 'D6aPHgCv4HPMS4dqivbmXstSoPfsB8xZFA',
    to: 'D9bS1JXcVc9KuyvZm1pYtbGFCR9NnATsWx',
    dateTime: 'unconfirmed',
    status: 'pending',
  },
  {
    number: 2,
    method: 'Transfer',
    quantity: 100,
    balance: null,
    from: 'D6aPHgCv4HPMS4dqivbmXstSoPfsB8xZFA',
    to: 'D9bS1JXcVc9KuyvZm1pYtbGFCR9NnATsWx',
    dateTime: '2022-11-11 14:43:02',
    status: 'valid',
  },
  {
    number: 3,
    method: 'Transfer',
    quantity: 7603,
    balance: null,
    from: 'D6aPHgCv4HPMS4dqivbmXstSoPfsB8xZFA',
    to: 'D9bS1JXcVc9KuyvZm1pYtbGFCR9NnATsWx',
    dateTime: '2023-01-11 14:43:02',
    status: 'invalid',
  },
  {
    number: 4,
    method: 'Inscribe-Transfer',
    quantity: 5,
    balance: 15,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: '2022-03-01 02:43:02',
    status: 'pending',
  },
  {
    number: 5,
    method: 'Inscribe-Transfer',
    quantity: 35.5,
    balance: 0.0,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: '2022-08-03 20:00:02',
    status: 'valid',
  },
  {
    number: 6,
    method: 'Inscribe-Transfer',
    quantity: 2500,
    balance: 1150,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: 'unconfirmed',
    status: 'invalid',
  },
  {
    number: 7,
    method: 'Inscribe-Mint',
    quantity: 1000,
    balance: 1000,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: '2021-03-12 07:43:02',
    status: 'valid',
  },
  {
    number: 8,
    method: 'Inscribe-Mint',
    quantity: 1,
    balance: 0,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: 'unconfirmed',
    status: 'pending',
  },
  {
    number: 9,
    method: 'Inscribe-Mint',
    quantity: 2500,
    balance: 50,
    from: null,
    to: 'D8pE8sCZzgprJqsMExQH6Dx4Rtrg5TmBDh',
    dateTime: '2022-08-03 20:00:02',
    status: 'invalid',
  },
]
type useMockTokenTransfersInfoProps = {
  tokenSymbol: string
}

const useMockTokenTransfersInfo = ({ tokenSymbol }: useMockTokenTransfersInfoProps) => {
  const [data, setData] = useState<null | TokenTransfersInfo[]>(null)
  const [error, setError] = useState<null | string>(null)

  const fetchData = useCallback(() => {
    const delay = Math.random() < 0.9 ? 2000 : 0 // 90% success rate with 3-second delay

    setTimeout(() => {
      if (!delay || !tokenSymbol) {
        setError('sorrey') // 20% failure rate
      } else {
        setData(mockData) // Successful response
      }
    }, delay)
  }, [tokenSymbol])

  const refetch = () => {
    setError(null)
    setData(null)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, error, refetch }
}

export default useMockTokenTransfersInfo
