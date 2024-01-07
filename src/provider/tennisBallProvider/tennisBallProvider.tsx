import { createContext, useCallback, useMemo, useState } from 'react'

import { TennisBallApi, TennisBallProviderProps } from '@/provider/tennisBallProvider/tennisBallProvider.types'
import { TennisBall } from '@/types/reRoll'

import tennisBall from '../../assets/images/tennisBall.svg'

const defaultContext: TennisBallApi = {
  fiwbBalance: 0,
  mintAmount: 0,
  mintPrice: 0,
  isMintButtonDisabled: false,
  isMinting: false,
  mintedTennisBalls: [],
  setMintAmount: () => undefined,
  onMint: async () => undefined,
}

export const tennisBallContext = createContext(defaultContext)

export function TennisBallProvider({ children }: TennisBallProviderProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [mintAmount, setMintAmount] = useState(0)
  const [mintedTennisBalls, setMintedTennisBalls] = useState<TennisBall[]>([])

  const fiwbBalance = useMemo(() => {
    return 2000000
  }, [])

  const mintPrice = useMemo(() => {
    return 2000
  }, [])

  const isMintButtonDisabled = useMemo(() => {
    return !mintAmount || mintPrice * mintAmount > fiwbBalance
  }, [fiwbBalance, mintAmount, mintPrice])

  const onMint = useCallback(async () => {
    setIsMinting(true)
    setTimeout(() => {
      setMintedTennisBalls(Array(mintAmount).fill({ imageSrc: tennisBall, id: Math.floor(Math.random() * 10000) }))
      setIsMinting(false)
    }, 3000)
  }, [mintAmount])

  const api: TennisBallApi = useMemo(
    () => ({
      mintedTennisBalls,
      setMintAmount,
      mintAmount,
      mintPrice,
      isMintButtonDisabled,
      onMint,
      isMinting,
      fiwbBalance,
    }),
    [fiwbBalance, isMintButtonDisabled, isMinting, mintAmount, mintPrice, mintedTennisBalls, onMint]
  )

  return <tennisBallContext.Provider value={api}>{children}</tennisBallContext.Provider>
}
