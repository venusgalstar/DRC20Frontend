import React from 'react'

import { Packs } from '@/components/championsTcg/packs'
import { Collection } from '@/components/doginalpacks/collection'
import SwitchButton from '@/components/doginalpacks/SwitchButton'
import { CollectionProvider } from '@/provider/collectionProvider/collectionProvider'

import PageBaseChampionsTCG from '../_baseChampionsTCG'

export const championsTcgCollectionSymbols = ['tcg-packs-gen1']

const ChampionsTCG = () => {
  const [isActive, setIsActive] = useState<boolean>(false)

  return (
    <CollectionProvider>
      <PageBaseChampionsTCG>
        <SwitchButton isActive={isActive} setIsActive={setIsActive} highlightColor="#1B4DCF" />
        {!isActive ? (
          <div className="mt-15">
            <Packs />
          </div>
        ) : (
          <div>
            <Collection
              isActive={isActive}
              revealCollections={championsTcgCollectionSymbols}
              emptyMessage="You don't have any Champions TCG Doginals yet!"
              containerStyle={{ color: '#FFFFFF' }}
            />
          </div>
        )}
      </PageBaseChampionsTCG>
    </CollectionProvider>
  )
}

export default ChampionsTCG
