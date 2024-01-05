import { RevealContext } from '@/provider/revealProvider/revealProvider'
import { useContext } from 'react'

export function useRevealData() {
  const revealData = useContext(RevealContext)

  if (!revealData) {
    console.error('Error: useRevealData must be used within a RevealProvider')
  }

  return revealData
}
