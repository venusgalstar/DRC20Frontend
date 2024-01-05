import { tennisBallContext } from '@/provider/tennisBallProvider/tennisBallProvider'

export function useTennisBallData() {
  const context = useContext(tennisBallContext)

  if (!context) {
    throw new Error('useTennisBallData must be used within a TennisBallProvider')
  }

  return context
}
