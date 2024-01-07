import { useFetch } from 'usehooks-ts'
import { useMemo } from 'react';
import { TokenInfo } from '@/types/tokenInfo'

type TokenProps = {
  tokenSymbol: string
}

export type AFetchResult = {
  added: string
  deploymentShibescription: string
  holders: number
  limitPerMint: number
  minted: number
  mintingTransactions: number
  supply: number
  tick: string
  trustLevel: number
  volume7d: number
  volume24h: number
  rank: number
  _id: string
}

const useTokenInfo = ({ tokenSymbol }: TokenProps) => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const aUrl = `${baseUrl}/ticks/byName/${tokenSymbol}`
  let { data: aData, error: aError } = useFetch<AFetchResult>(aUrl)

  const data: TokenInfo = useMemo(() => {
    const percentage = aData && aData.minted && aData.supply ? Math.ceil((aData.minted / aData.supply) * 100) : 0
    return {
      inscription: aData?.deploymentShibescription,
      supply: aData?.supply,
      minted: aData?.minted,
      limitPerMint: aData?.limitPerMint,
      holders: aData?.holders,
      percentage: percentage,
      status: percentage === 100 ? 'completed' : 'minting',
      // data below still needs to be provided by the API
      decimal: undefined,
      deployBy: undefined,
      deployTime: undefined,
      completedTime: undefined,
      inscriptionNumberStart: undefined,
      inscriptionNumberEnd: undefined,
      totalTransactions: undefined,
      rank: aData?.rank,
    }
  }, [aData])

  const error = useMemo(() => aError, [aError])

  return { data, error }
}

export default useTokenInfo
