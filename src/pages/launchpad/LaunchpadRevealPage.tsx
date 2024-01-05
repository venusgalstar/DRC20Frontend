//import React from 'react'
//import { useLocation } from 'react-router-dom'

import { RevealContent } from '@/components/doginalpacks/reveal/revealContent'
import { RevealProvider } from '@/provider/revealProvider/revealProvider'

import PageBase from '../_base'

const LaunchpadRevealPage = () => {
  return (
    <RevealProvider>
      <PageBase>
        <RevealContent />
      </PageBase>
    </RevealProvider>
  )
}

export default LaunchpadRevealPage
