//import React from 'react'
import { useFetch } from 'usehooks-ts'

import LaunchpadCollectionCard, { LaunchpadCollectionCardProps } from '@/components/launchpad/LaunchpadCollectionCard'
import { LaunchpadFetchResult } from '@/types/ILaunchpad'

//import styles from './LaunchpadLive.module.scss'
import { MintingPageContainer } from './MintingPageContainer'

export function LaunchpadPast() {
  const baseUrl = import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
  const currentLaunchpadActiveUrl = `${baseUrl}launchpad/list/past`
  let { data, error } = useFetch<LaunchpadFetchResult>(
    `${currentLaunchpadActiveUrl}?limit=100&offset=0&sortParam=launchpadEndDate&sortOrder=desc`
  )

  let collections: LaunchpadCollectionCardProps[] = []
  if (data) {
    collections = data!.collections.map( // @ts-ignore
      (collection) =>
        ({
          ...collection,
          imgSrc: collection.imageURI,
          altText: collection.name,
          mintingConfig: {
            maxMintsPerWallet: collection.launchpadMaxMintsPerWallet,
            dogePerMint: collection.launchpadPriceInDoge,
            fixedMinters: 1,
            showStatus: true,
            fundingWalletAddress: collection.launchpadFundingWallet,
            supply: collection.launchpadSupply,
          },
          steps: [
            {
              label: collection.name,
            },
            {
              label: 'Thank you!',
            },
          ],
          info: collection.description,
          isActive: false,
          launchpadEndTimestamp: new Date(collection.launchpadEndDate),
        } as unknown as LaunchpadCollectionCardProps)
    )
  }

  return (
    <MintingPageContainer>
      {collections.length === 0 ? (
        <div className="col-span-full mt-12 mb-18 flex justify-center items-center gap-6">
          <h1 className="text-xl text-left">
            {error
              ? `An unexpected error occured: ${JSON.stringify(error)}`
              : !data
              ? 'Loading'
              : 'There are no expired launchpad collections yet.'}
          </h1>
        </div>
      ) : (
        collections.map((collection /*, index*/): any => (
          <div className="self-start" key={`LaunchpadCollectionCardPast-${collection.symbol}`}>
            <LaunchpadCollectionCard
              isActive={collection.isActive}
              name={collection.name}
              symbol={collection.symbol}
              steps={collection.steps}
              altText={collection.altText}
              imgSrc={collection.imgSrc}
              mintingConfig={collection.mintingConfig}
              description={collection.description}
              twitterLink={collection.twitterLink}
              websiteLink={collection.websiteLink}
              launchpadEndTimestamp={collection.launchpadEndTimestamp}
              launchpadMintedSupply={collection.launchpadMintedSupply}
            />
          </div>
        ))
      )}
    </MintingPageContainer>
  )
}
