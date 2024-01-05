import React, { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import { Collection } from '@/components/doginalpacks/collection'
import { Packs } from '@/components/doginalpacks/packs'
import SwitchButton from '@/components/doginalpacks/SwitchButton'
import { CollectionProvider } from '@/provider/collectionProvider/collectionProvider'

import PageBase from '../_base'

const Doginals = () => {
  const [isActive, setIsActive] = useState<boolean>(false)

  return (
    <CollectionProvider>
      <PageBase>
        <SwitchButton isActive={isActive} setIsActive={setIsActive} />
        {!isActive ? (
          <div className="mt-15">
            <Packs />
          </div>
        ) : (
          <div>
            <Collection isActive={isActive} />
          </div>
        )}
      </PageBase>
    </CollectionProvider>
  )
}

export default Doginals
