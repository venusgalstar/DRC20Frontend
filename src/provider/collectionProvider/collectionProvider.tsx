import { createContext, useState, useMemo } from 'react'
import { useGetLabradogesData } from '@/hooks/useGetLabradogesData'
import { useWallet } from '@/hooks/useWallet'
import { CollectionApi, CollectionProviderProps } from '@/provider/collectionProvider/collectionProvider.types'
import { Labradoge } from '@/types/labradoge'

const defaultContext: CollectionApi = {
  setCollections: ([]) => undefined,
  doginals: [],
  selectedDoginal: undefined,
  setSelectedDoginal: () => undefined,
  collectionLoadingStatus: undefined,
}

export const CollectionContext = createContext(defaultContext)

export const CollectionProvider = ({ children }: CollectionProviderProps) => {
  const { address, connected } = useWallet()
  const [selectedDoginal, setSelectedDoginal] = useState<Labradoge | undefined>(undefined)
  const [collections, setCollections] = useState<null | string[]>(null)

  const { doginals, error, loading, complete } = useGetLabradogesData(address, connected, collections)

  const collectionLoadingStatus = useMemo(
    () => ({
      error,
      loading,
      completed: complete,
    }),
    [error, loading, complete]
  )

  const api: CollectionApi = useMemo(
    () => ({
      setCollections,
      selectedDoginal,
      doginals,
      setSelectedDoginal,
      collectionLoadingStatus,
    }),
    [setCollections, selectedDoginal, doginals, collectionLoadingStatus, setSelectedDoginal]
  )
  return <CollectionContext.Provider value={api}>{children}</CollectionContext.Provider>
}
