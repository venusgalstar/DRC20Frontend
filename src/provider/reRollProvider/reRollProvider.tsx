import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import Slider from 'react-slick'

import { mockLabradoge } from '@/provider/labradogeProvider/mockData'
import { ReRollApi, ReRollProviderProps, SelectionModalTypes } from '@/provider/reRollProvider/reRollProvider.types'
import { Labradoge } from '@/types/labradoge'
import { TennisBall } from '@/types/reRoll'

import tennisBall from '../../assets/images/tennisBall.svg'

const defaultContext: ReRollApi = {
  labradogeAmount: 0,
  tennisBallsNeeded: 0,
  tennisBallsAmount: 0,
  selectedLabradoge: undefined,
  labradoges: [],
  tennisBalls: [],
  unselectedTennisBalls: [],
  isReRolling: false,
  isKeepingLabradoge: false,
  isReRollButtonDisabled: false,
  isModalOpen: null,
  reRolledLabradoge: null,
  slider: null,
  selectedTennisBalls: [],
  onClickSelect: () => undefined,
  setIsModalOpen: () => undefined,
  setIsKeepingLabradoge: () => undefined,
  handleLabradogeSelection: () => undefined,
  handleTennisBallSelection: () => undefined,
  setSelectedTennisBalls: () => undefined,
  onReRoll: async () => undefined,
}

export const ReRollContext = createContext(defaultContext)

export function ReRollProvider({ children }: ReRollProviderProps) {
  const [selectedLabradoge, setSelectedLabradoge] = useState<Labradoge | undefined>()
  const [selectedTennisBalls, setSelectedTennisBalls] = useState<TennisBall[]>([])
  const [isModalOpen, setIsModalOpen] = useState<SelectionModalTypes | null>(null)
  const [isReRolling, setIsReRolling] = useState(false)
  const [isKeepingLabradoge, setIsKeepingLabradoge] = useState(false)
  const [reRolledLabradoge, setReRolledLabradoge] = useState<Labradoge | null>(null)
  const slider = useRef<Slider>(null)
  const labradoges: Labradoge[] = Array(5).fill(mockLabradoge)
  const tennisBalls: TennisBall[] = Array(5).fill({ imageSrc: tennisBall, id: Math.floor(Math.random() * 10000) })

  const unselectedTennisBalls = useMemo(
    () =>
      tennisBalls.filter(
        (ball) => !selectedTennisBalls.find((selectedTennisBall) => selectedTennisBall.id !== ball.id)
      ),
    [selectedTennisBalls, tennisBalls]
  )

  const labradogeAmount = useMemo(() => {
    return labradoges.length
  }, [labradoges.length])

  const tennisBallsAmount = useMemo(() => {
    return tennisBalls.length
  }, [tennisBalls.length])

  const tennisBallsNeeded = 1

  const isReRollButtonDisabled = useMemo(() => {
    if (!selectedLabradoge) return true
    return !selectedTennisBalls.length || selectedTennisBalls.length < tennisBallsNeeded
  }, [selectedLabradoge, selectedTennisBalls.length])

  const onReRoll = useCallback(async () => {
    setIsReRolling(true)
    setTimeout(() => {
      setReRolledLabradoge(mockLabradoge)
      setIsReRolling(false)
    }, 3000)
  }, [])

  const handleLabradogeSelection = useCallback((labradoge: Labradoge) => {
    setSelectedLabradoge(labradoge)
    setIsModalOpen(null)
  }, [])

  const handleTennisBallSelection = useCallback(
    (tennisBall: TennisBall) => {
      setSelectedTennisBalls([...selectedTennisBalls, tennisBall])
      setIsModalOpen(null)
    },
    [selectedTennisBalls]
  )

  const onClickSelect = useCallback(() => {
    slider?.current?.slickNext()
  }, [])

  const api: ReRollApi = useMemo(
    () => ({
      labradoges,
      isModalOpen,
      isKeepingLabradoge,
      isReRolling,
      isReRollButtonDisabled,
      setIsModalOpen,
      setIsKeepingLabradoge,
      labradogeAmount,
      reRolledLabradoge,
      onClickSelect,
      onReRoll,
      tennisBallsAmount,
      tennisBallsNeeded,
      tennisBalls,
      unselectedTennisBalls,
      selectedTennisBalls,
      selectedLabradoge,
      slider,
      handleLabradogeSelection,
      handleTennisBallSelection,
      setSelectedTennisBalls,
    }),
    [
      labradoges,
      isModalOpen,
      isKeepingLabradoge,
      isReRolling,
      isReRollButtonDisabled,
      labradogeAmount,
      reRolledLabradoge,
      onClickSelect,
      onReRoll,
      tennisBallsAmount,
      tennisBalls,
      unselectedTennisBalls,
      selectedTennisBalls,
      selectedLabradoge,
      handleLabradogeSelection,
      handleTennisBallSelection,
    ]
  )

  return <ReRollContext.Provider value={api}>{children}</ReRollContext.Provider>
}
