import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import SwitchButton from '@/components/doginalpacks/SwitchButton'
import Hero from '@/components/hero/Hero'
import { CollectionProvider } from '@/provider/collectionProvider/collectionProvider'

import { Feature, getFeatures } from '../../api'
import { LaunchpadLive } from '../../components/launchpad/LaunchpadLive'
import { LaunchpadPast } from '../../components/launchpad/LaunchpadPast'
import { Mintpad } from '../../components/launchpad/Mintpad'
import { MintpadPast } from '../../components/launchpad/MintpadPast'
import PageBase from '../_base'

const LaunchpadLandingPage = ({ activeTab = 'launchpad' }) => {
  const [isActive, setIsActive] = useState<boolean>(activeTab !== 'launchpad')
  const [features, setFeatures] = useState<Feature[]>([])

  const fetchFeatures = async (visible?: boolean) => {
    const features = await getFeatures(visible)
    if (features) {
      setFeatures(features)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchFeatures(true)
    }
    fetchData()
  }, [])

  return (
    <CollectionProvider>
      <PageBase>
        {features && false && <Hero features={features} />}
        <div className="md:mt-14">
          <SwitchButton isActive={isActive} setIsActive={setIsActive} leftText="Launchpad" rightText="Mintpad" />
          {!isActive ? (
            <div className="mt-15">
              <h1 className="text-3xl font-bold text-left my-12">Live & Upcoming</h1>
              <LaunchpadLive />
              <h1 className="text-3xl font-bold text-left my-12">Past</h1>
              <LaunchpadPast />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-left my-12">Live & Upcoming</h1>
              <Mintpad />
              <h1 className="text-3xl font-bold text-left my-12">Past</h1>
              <MintpadPast />
            </div>
          )}
        </div>
      </PageBase>
    </CollectionProvider>
  )
}

export default LaunchpadLandingPage
