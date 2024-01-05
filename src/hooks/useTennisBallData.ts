import { tennisBallContext } from '@/provider/tennisBallProvider/tennisBallProvider'
import { useContext } from 'react';

export function useTennisBallData() {
  const context = useContext(tennisBallContext)

  if (!context) {
    throw new Error('useTennisBallData must be used within a TennisBallProvider')
  }

  return context
}
