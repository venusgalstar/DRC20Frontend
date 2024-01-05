import { RevealedOverview } from '@/components/doginalpacks/reveal/revealedOverview/revealedOverview'
import { RevealOverview } from '@/components/doginalpacks/reveal/revealOverview/revealOverview'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { useRevealData } from '@/hooks/useRevealData'

export function RevealContent() {
  const { isRevealing, revealedLabradoges } = useRevealData()
  return revealedLabradoges ? <RevealedOverview /> : isRevealing ? <LoadingView /> : <RevealOverview />
}
