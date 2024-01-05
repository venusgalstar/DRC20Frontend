import { TennisBallMintContent } from '@/components/tennisBall/tennisBallMintContent/TennisBallMintContent'
import PageBase from '@/pages/_base'
import { TennisBallProvider } from '@/provider/tennisBallProvider/tennisBallProvider'

export default function TennisBalls() {
  return (
    <TennisBallProvider>
      <PageBase>
        <TennisBallMintContent />
      </PageBase>
    </TennisBallProvider>
  )
}
