import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import { OverviewCard } from '@/components/labradoge'
import { LoadingView } from '@/components/labradoge/loadingView/loadingView'
import WalletConnect from '@/components/WalletConnect'
import { useCollectionData } from '@/hooks/useCollectionData'
import { useWalletContext } from '@/WalletContext'

export interface CollectionProps {
  isActive: boolean
  revealCollections?: string[]
  emptyMessage?: string
  containerStyle?: any
}

// const revealCollectionNames = ['lab-pack', 'ballz', 'investor-pack', 'unleash-doginal']
export const revealCollectionNames = ['lab-pack', 'investor-pack', 'unleash-doginal']

export function Collection({
  isActive,
  revealCollections,
  emptyMessage = "You don't have any Labradoge Doginals yet.",
  containerStyle,
}: CollectionProps) {
  isActive;
  const { connected } = useWalletContext()
  const navigator = useNavigate()
  const { setCollections, doginals, collectionLoadingStatus } = useCollectionData()

  useEffect(() => {
    if (connected) {
      setCollections(revealCollections || revealCollectionNames)
    }
  })
  return (
    <div
      className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center"
      style={containerStyle}
    >
      {!connected && (
        <div className="col-span-full mt-10 flex justify-center items-center gap-6">
          <WalletConnect />
        </div>
      )}
      {connected && collectionLoadingStatus?.completed && doginals.length === 0 && (
        <div className="col-span-full mt-10 flex justify-center items-center gap-6">
          <p className="text-xl font-bold">{emptyMessage}</p>
        </div>
      )}
      {connected && collectionLoadingStatus?.loading && (
        <div className="col-span-full mt-10 flex justify-center items-center gap-6">
          <div className="h-[3rem] w-[3rem] text-gray-600 fill-amber-500">
            <LoadingView />
          </div>
        </div>
      )}
      {
        connected &&
        collectionLoadingStatus?.completed &&
        doginals &&
        doginals.length > 0 &&/* @ts-ignore */
        doginals.map((doginal, index) => (
          <div className="flex flex-col mt-10" key={`${doginal.id}-${index}-container`}>
            <OverviewCard
              key={`${doginal.id}-${index}-card`}
              cleanHeadline={`${doginal.name}`}
              subHeadline={`#${doginal.id}`}
              imageSrc={doginal.image}
              isBig={false}
              buttonConfig={[
                {
                  label: 'Reveal',
                  isDisabled: true,
                  onClick: () => {
                    doginal.inscriptionId && navigator(`/labradoges/reveal/${doginal.inscriptionId}`)
                  },
                },
              ]}
              onHoverButtonClick={() => console.log(doginal)}
              onHoverButtonLabel={{ label: 'Details', disabled: true }}
            />
          </div>
        ))}
    </div>
  )
}
