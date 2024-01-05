import { MintingContent } from '@/components/labradoge/mintingContent/MintingContent'
import { LabradogeProvider } from '@/provider/labradogeProvider/labradogeProvider'
import { AddressConsumingProps } from '@/types/common'

import PageBase from '../_base'

export default function Labradoge({ address }: AddressConsumingProps) {
  return (
    <LabradogeProvider>
      <PageBase>
        <MintingContent />
      </PageBase>
    </LabradogeProvider>
  )
}
