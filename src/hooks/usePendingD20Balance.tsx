import { useCallback, useEffect, useState } from 'react'

import { PendingBalanceDatas, pendingD20Balances as fetchPendingD20Balances } from '@/api'

export const usePendingD20Balances = ({ address }: { address: string | undefined }) => {
  const [pendingD20Balances, setPendingD20Balances] = useState<PendingBalanceDatas>({})
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!address) return
    try {
      const result = await fetchPendingD20Balances(address)
      setPendingD20Balances(result.balances)
    } catch (error: any) {
      setError(error)
    }
  }, [address])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Refetch every 10 seconds
    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [fetchData])

  return { pendingD20Balances, error, refetch: fetchData }
}
