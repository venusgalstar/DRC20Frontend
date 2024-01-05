import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { ReRolledOverview } from '@/components/reRoll/reRolledOverview/reRolledOverview'
import { ReRollOverview } from '@/components/reRoll/reRollOverview/reRollOverview'
import { useReRollData } from '@/hooks/useReRollData'

export function ReRollContent() {
  const { isReRolling, reRolledLabradoge } = useReRollData()
  return reRolledLabradoge ? <ReRolledOverview /> : isReRolling ? <LoadingView /> : <ReRollOverview />
}
