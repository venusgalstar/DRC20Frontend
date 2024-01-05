import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { getImageInscriptions } from '@/api'
import { ImageInscriptionResponse } from '@/types/dogeNft'

type CollectionDataProps = {
  address: string
  connected: boolean
}

export const useGetInscriptionsByAddress = ({
  address,
  connected,
}: CollectionDataProps): {
  completed: boolean
  error: Error | null
  loading: boolean
  collectionInformation: Array<ImageInscriptionResponse> | undefined
} => {
  const [collectionInformation, setCollectionInformation] = useState<ImageInscriptionResponse[] | undefined>(undefined)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const fetchData = async (): Promise<ImageInscriptionResponse[] | undefined> => {
      if (connected && address) {
        setLoading(true)
        return (await getImageInscriptions({ address, cursor: 0, size: 100 })).list
      }
    }

    fetchData()
      .then((collectionInfos) => {
        setCollectionInformation(collectionInfos)
        setCompleted(true)
        setError(null)
        setLoading(false)
      })
      .catch((e) => {
        setCompleted(false)
        setError(e)
        setLoading(false)
      })
  }, [connected, address])

  return {
    completed,
    error,
    loading,
    collectionInformation,
  }
}
