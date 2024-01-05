import { createContext, useCallback, useMemo, useState } from 'react'

import { LabradogeApi, LabradogeProviderProps } from '@/provider/labradogeProvider/labradogeProvider.types'
import { mockLabradoge } from '@/provider/labradogeProvider/mockData'
import { Labradoge } from '@/types/labradoge'

const defaultContext: LabradogeApi = {
  selectedMintAmount: 0,
  unleashDoginalsAmount: 0,
  mintedLabradoges: [],
  isMinting: false,
  isModalOpen: false,
  selectedLabradoge: undefined,
  setIsMinting: () => undefined,
  setSelectedMintAmount: () => undefined,
  onMint: async () => undefined,
  onOpenDetailModal: () => undefined,
  onCloseDetailModal: () => undefined,
}

export const LabradogeContext = createContext(defaultContext)

export function LabradogeProvider({ children }: LabradogeProviderProps) {
  const [selectedMintAmount, setSelectedMintAmount] = useState(0)
  const [isMinting, setIsMinting] = useState(false)
  const [selectedLabradoge, setSelectedLabradoge] = useState<Labradoge | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mintedLabradoges, setMintedLabradoges] = useState<Labradoge[]>([])

  const unleashDoginalsAmount = useMemo(() => {
    //TODO: Add fetcher for balance
    return 0
  }, [])

  const onMint = useCallback(async () => {
    setIsMinting(true)
    setTimeout(() => {
      setMintedLabradoges(Array(selectedMintAmount).fill(mockLabradoge))
      setIsMinting(false)
    }, 3000)
  }, [selectedMintAmount])

  const onOpenDetailModal = useCallback((labradoge: Labradoge) => {
    setSelectedLabradoge(labradoge)
    setIsModalOpen(true)
  }, [])

  const onCloseDetailModal = useCallback(() => {
    setSelectedLabradoge(undefined)
    setIsModalOpen(false)
  }, [])

  const api: LabradogeApi = useMemo(
    () => ({
      isMinting,
      isModalOpen,
      setIsMinting,
      selectedLabradoge,
      selectedMintAmount,
      setSelectedMintAmount,
      mintedLabradoges,
      unleashDoginalsAmount,
      onMint,
      onOpenDetailModal,
      onCloseDetailModal,
    }),
    [
      isMinting,
      isModalOpen,
      setIsMinting,
      selectedLabradoge,
      selectedMintAmount,
      mintedLabradoges,
      setSelectedMintAmount,
      unleashDoginalsAmount,
      onMint,
      onOpenDetailModal,
      onCloseDetailModal,
    ]
  )
  return <LabradogeContext.Provider value={api}>{children}</LabradogeContext.Provider>
}
