import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import { TennisBallMintedOverview } from '@/components/tennisBall/tennisBallMintedOverview/tennisBallMintedOverview'
import { TennisBallMintOverview } from '@/components/tennisBall/tennisBallMintOverview/tennisBallMintOverview'
import { useTennisBallData } from '@/hooks/useTennisBallData'

export function TennisBallMintContent() {
  const { isMinting, mintedTennisBalls } = useTennisBallData()

  return mintedTennisBalls?.length ? (
    <TennisBallMintedOverview />
  ) : isMinting ? (
    <LoadingView />
  ) : (
    <TennisBallMintOverview />
  )
}
