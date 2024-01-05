import axios from 'axios'
import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import { getDoginalInfo } from '@/api'
import { useGetInscriptionsByAddress } from '@/hooks/useGetInscriptionsByAddress'
import { ImageInscriptionResponse } from '@/types/dogeNft'
import { Labradoge } from '@/types/labradoge'

export const transformToLabradoge = (data: any): Labradoge => {
  return {
    image: data.imageURI,
    name: data.name,
    collectionSymbol: data.collectionSymbol,
    id: data.inscriptionNumber,
    inscriptionId: data.inscriptionId,
    // attributes: data.metadata,
    // rarity: 0,
  }
}

export const sendBurnInfo = async (
  inscriptionId: string,
  txHash: string,
  address: string,
  collectionSymbol: string,
  attempt = 1
) => {
  try {
    const url = `${import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api.dogeord.io'}/doginals/burnInfo`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need to send
      },
      body: JSON.stringify({
        address,
        txHash,
        inscriptionId,
        collectionSymbol,
      }),
    })

    if (!response.ok) throw new Error('Fetch failed')
    // Handle your response here
  } catch (error) {
    console.error(`Attempt ${attempt} failed with error: ${error}`)
    if (attempt < 20) {
      const delay = 5 * attempt
      console.log(`Retrying in ${delay} seconds...`)
      setTimeout(() => sendBurnInfo(inscriptionId, txHash, address, collectionSymbol, attempt + 1), delay * 1000)
    } else {
      console.error('All attempts to send burn Info failed.')
    }
  }
}

export const fetchDoginals = async (
  collectionInformation: ImageInscriptionResponse[],
  filterCollectionNames: string[] | null | undefined
): Promise<Labradoge[] | null> => {
  try {
    const doginalsList = await Promise.all(
      collectionInformation.map(async (imageInscription: ImageInscriptionResponse) => {
        try {
          const doginalData = await getDoginalInfo(imageInscription.inscriptionId)
          return transformToLabradoge(doginalData)
        } catch (err) {
          console.error(`Failed to fetch info for inscriptionId: ${imageInscription.inscriptionId}`, err)
          return null
        }
      })
    )

    // Filter out null values
    const filteredDoginalsList = doginalsList.filter((doginal): doginal is Labradoge => doginal !== null)

    return filteredDoginalsList.filter((doginal) => {
      const doginalCollectionSymbol = doginal?.collectionSymbol || ''
      return (
        doginal &&
        (filterCollectionNames && Array.isArray(filterCollectionNames)
          ? (filterCollectionNames as string[]).includes(doginalCollectionSymbol)
          : true)
      )
    })
  } catch (err) {
    console.error('Failed to fetch doginals', err)
    return []
  }
}

export const useGetLabradogesData = (address: string, connected: boolean, filterCollectionNames?: null | string[]) => {
  const [doginals, setDoginals] = useState<Labradoge[]>([])
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState<Error | unknown | null>(null)

  const { collectionInformation } = useGetInscriptionsByAddress({
    address,
    connected,
  })

  useEffect(() => {
    if (collectionInformation && filterCollectionNames) {
      const fetchDoginalInformation = async () => {
        try {
          setLoading(true)
          const filteredDoginals = await fetchDoginals(collectionInformation, filterCollectionNames)
          setDoginals(filteredDoginals as Labradoge[])
          setComplete(true)
        } catch (err) {
          setError(err)
        } finally {
          setLoading(false)
        }
      }

      fetchDoginalInformation().then()
    }
  }, [collectionInformation, filterCollectionNames])

  return { doginals, loading, complete, error }
}
