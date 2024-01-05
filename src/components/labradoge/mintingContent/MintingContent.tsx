import { MintOverview } from '@/components/labradoge'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { MintedOverview } from '@/components/labradoge/mintedOverview'
import { useLabradogeData } from '@/hooks/useLabradogeData'

export function MintingContent() {
  const { isMinting, mintedLabradoges } = useLabradogeData()

  return mintedLabradoges.length ? <MintedOverview /> : isMinting ? <LoadingView /> : <MintOverview />
}
