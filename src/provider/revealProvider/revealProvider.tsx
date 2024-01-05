import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import Slider from 'react-slick'

import { getImageInscriptions } from '@/api'
import { fetchDoginals, sendBurnInfo, useGetLabradogesData } from '@/hooks/useGetLabradogesData'
import { useWallet } from '@/hooks/useWallet'
import { RevealApi, RevealProviderProps } from '@/provider/revealProvider/revealProvider.types'
import { ImageInscriptionResponse } from '@/types/dogeNft'
import { Labradoge } from '@/types/labradoge'

const defaultContext: RevealApi = {
  setCollections: ([]) => undefined,
  /* @ts-ignore */
  setSelectedLabradogeRevealAmount: (int) => undefined,
  selectedLabradogeRevealAmount: 0,
  availableLabradogeAmount: 0,
  selectedLabradoge: undefined,
  labradoges: [],
  isRevealing: false,
  isKeepingLabradoge: false,
  isRevealButtonDisabled: false,
  isModalOpen: false,
  revealedLabradoges: null,
  slider: null,
  onClickSelect: () => undefined,
  onOpenDetailModal: () => undefined,
  onCloseDetailModal: () => undefined,
  setIsKeepingLabradoge: () => undefined,
  handleLabradogeSelection: () => undefined,
  onReveal: async () => undefined,
}
export const afterRevealCollectionNames = ['labradoges']
export const RevealContext = createContext(defaultContext)
const NULL_ADDRESS: string = 'DDogepartyxxxxxxxxxxxxxxxxxxw1dfzr'
export function RevealProvider({ children }: RevealProviderProps) {
  const [selectedLabradogeRevealAmount, setSelectedLabradogeRevealAmount] = useState(1)
  const [availableLabradogeAmount, setAvailableLabradogeAmount] = useState(0)
  const [selectedLabradoge, setSelectedLabradoge] = useState<Labradoge | undefined>()
  const [allDoginalsFromWallet, setAllDoginalsFromWallet] = useState<null | Labradoge[]>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [collections, setCollections] = useState<null | string[]>(null)
  const [labradoges, setLabradoges] = useState<null | Labradoge[]>(null)
  const [isKeepingLabradoge, setIsKeepingLabradoge] = useState(false)
  const [revealedLabradoges, setRevealedLabradoges] = useState<Labradoge[] | null>(null)
  const [shouldFetchNewLabradoges, setShouldFetchNewLabradoges] = useState(false)

  const slider = useRef<Slider>(null)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | number | null>(null)

  const { address, connected, sendInscription } = useWallet()
  const { doginals, complete } = useGetLabradogesData(address, connected, collections)

  const fetchData = useCallback(async (): Promise<ImageInscriptionResponse[] | undefined> => {
    if (connected && address) {
      return (await getImageInscriptions({ address, cursor: 0, size: 100 })).list
    }
  }, [connected, address])

  const triggerBurnInfoSending = useCallback(
    async (inscriptionId: string, txHash: string, collectionSymbol: string): Promise<void> => {
      if (connected && address) {
        await sendBurnInfo(inscriptionId, txHash, address, collectionSymbol)
      }
    },
    [connected, address]
  )

  // Function to fetch and store all Doginals from the wallet
  const fetchAndStoreAllDoginals = useCallback(async () => {
    const collectionInformation = await fetchData()
    if (!collectionInformation) {
      console.warn('No collection information found')
      setIsRevealing(false)
      return
    }
    const allDoginals = await fetchDoginals(collectionInformation, null)
    setAllDoginalsFromWallet(allDoginals)
  }, [fetchData])

  const fetchCollectionInformation = useCallback(async (): Promise<null | ImageInscriptionResponse[]> => {
    const collectionInformation = await fetchData()
    if (!collectionInformation) {
      return null
    }

    return collectionInformation
  }, [fetchData])

  // Function to fetch Doginals and find new ones after reveal
  const fetchAndCompareDoginals = useCallback(
    async (collectionInformation: ImageInscriptionResponse[]): Promise<null | Labradoge[]> => {
      const newlyFetchedLabradogesFromWallets = await fetchDoginals(collectionInformation, afterRevealCollectionNames)

      let newDoginals = null
      if (newlyFetchedLabradogesFromWallets && newlyFetchedLabradogesFromWallets.length > 0) {
        // Compare the new Doginals with the initial ones to find truly new Doginals
        newDoginals = newlyFetchedLabradogesFromWallets.filter(
          (newDoginal) =>
            allDoginalsFromWallet &&
            !allDoginalsFromWallet.some((initialDoginal) => initialDoginal.id === newDoginal.id)
        )
      }

      return newDoginals
    },
    [allDoginalsFromWallet]
  )

  useEffect(() => {
    let isSubscribed = true // This flag will prevent updating state if the component is unmounted

    // triggered in onReveal by shouldFetchNewLabradoges setting to true
    const fetchLoop = async () => {
      if (shouldFetchNewLabradoges && allDoginalsFromWallet) {
        try {
          const collectionInformation = await fetchCollectionInformation()
          if (!collectionInformation) {
            return
          }

          const newLabradoges = await fetchAndCompareDoginals(collectionInformation)

          if (newLabradoges && newLabradoges.length > 0) {
            setRevealedLabradoges(newLabradoges)
            setShouldFetchNewLabradoges(false) // Stop the fetch loop
          } else {
            // No new Labradoges found, set up the next fetch in the loop
            fetchTimeoutRef.current = setTimeout(fetchLoop, 5000) // Fetch again after 3 seconds
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (isSubscribed && shouldFetchNewLabradoges) {
      fetchLoop().then()
    }

    return () => {
      isSubscribed = false
      if (fetchTimeoutRef.current !== null) {
        clearTimeout(fetchTimeoutRef.current)
      }
    }
  }, [
    shouldFetchNewLabradoges,
    fetchData,
    collections,
    labradoges,
    allDoginalsFromWallet,
    fetchCollectionInformation,
    fetchAndCompareDoginals,
  ])

  useEffect(() => {
    if (complete && doginals) {
      setLabradoges(doginals)
    }

    if (selectedLabradoge && complete && doginals) {
      const filteredLabradoges = doginals?.filter(
        (doginal) => doginal.collectionSymbol === selectedLabradoge.collectionSymbol
      )
      setLabradoges(filteredLabradoges)
      setAvailableLabradogeAmount(filteredLabradoges.length)
    }
  }, [doginals, setLabradoges, complete, selectedLabradoge])

  const isRevealButtonDisabled = useMemo(() => {
    return !selectedLabradoge
  }, [selectedLabradoge])

  const onReveal = useCallback(async () => {
    if (!labradoges) {
      return
    }

    setIsRevealing(true)

    // fetch all doginals from the wallet for later comparison
    await fetchAndStoreAllDoginals()

    // get the selectedLabradogeRevealAmount of the labradoges
    const toBeRevealedLabradoges = labradoges.slice(0, selectedLabradogeRevealAmount)
    // send them to the null address
    for (const toBeRevealedLabradoge of toBeRevealedLabradoges) {
      try {
        const { collectionSymbol, inscriptionId } = toBeRevealedLabradoge
        const txHash = await sendInscription(NULL_ADDRESS, inscriptionId.toString())
        await triggerBurnInfoSending(inscriptionId.toString(), txHash, collectionSymbol)
        setShouldFetchNewLabradoges(true)
      } catch (error) {
        console.log('sendInscription Error', error)
      }
    }
  }, [fetchAndStoreAllDoginals, labradoges, selectedLabradogeRevealAmount, sendInscription, triggerBurnInfoSending])

  const handleLabradogeSelection = useCallback((labradoge: Labradoge) => {
    setSelectedLabradoge(labradoge)
  }, [])

  const onClickSelect = useCallback(() => {
    slider?.current?.slickNext()
  }, [])

  const onOpenDetailModal = useCallback((labradoge: Labradoge) => {
    setSelectedLabradoge(labradoge)
    setIsModalOpen(true)
  }, [])

  const onCloseDetailModal = useCallback(() => {
    setSelectedLabradoge(undefined)
    setIsModalOpen(false)
  }, [])

  const api: RevealApi = useMemo(
    () => ({
      selectedLabradogeRevealAmount,
      setSelectedLabradogeRevealAmount,
      availableLabradogeAmount,
      labradoges,
      isModalOpen,
      isKeepingLabradoge,
      isRevealing,
      isRevealButtonDisabled,
      setIsKeepingLabradoge,
      revealedLabradoges,
      onClickSelect,
      onOpenDetailModal,
      onCloseDetailModal,
      onReveal,
      selectedLabradoge,
      slider,
      handleLabradogeSelection,
      setCollections,
    }),
    [
      selectedLabradogeRevealAmount,
      availableLabradogeAmount,
      labradoges,
      isModalOpen,
      isKeepingLabradoge,
      isRevealing,
      isRevealButtonDisabled,
      revealedLabradoges,
      onClickSelect,
      onOpenDetailModal,
      onCloseDetailModal,
      onReveal,
      selectedLabradoge,
      handleLabradogeSelection,
    ]
  )

  return <RevealContext.Provider value={api}>{children}</RevealContext.Provider>
}
