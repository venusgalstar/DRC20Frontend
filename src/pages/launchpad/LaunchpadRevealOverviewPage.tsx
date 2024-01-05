//import React from 'react'

import { Collection } from '@/components/doginalpacks/collection'
import { CollectionProvider } from '@/provider/collectionProvider/collectionProvider'

import PageBase from '../_base'

const LaunchpadRevealOverviewPage = () => {
  return (
    <CollectionProvider>
      <PageBase>
        <Collection isActive={true} />
      </PageBase>
    </CollectionProvider>
  )
}

export default LaunchpadRevealOverviewPage
