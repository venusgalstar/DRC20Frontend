import { ReRollContext } from '@/provider/reRollProvider/reRollProvider'
import { useContext } from 'react';

export function useReRollData() {
  const reRollData = useContext(ReRollContext)

  if (!reRollData) {
    throw new Error('useReRollData must be used within a ReRollProvider')
  }

  return reRollData
}
