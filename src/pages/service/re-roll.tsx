import { ReRollContent } from '@/components/reRoll/reRollContent/reRollContent'
import PageBase from '@/pages/_base'
import { ReRollProvider } from '@/provider/reRollProvider/reRollProvider'

export default function ReRoll() {
  return (
    <ReRollProvider>
      <PageBase>
        <ReRollContent />
      </PageBase>
    </ReRollProvider>
  )
}
