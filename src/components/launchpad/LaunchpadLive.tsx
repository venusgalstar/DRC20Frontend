import { useState, useEffect } from 'react'
import { useFetch } from 'usehooks-ts'

import { getDoginalCollectionsWhitelist } from '@/api'
import LaunchpadCollectionCard, { LaunchpadCollectionCardProps } from '@/components/launchpad/LaunchpadCollectionCard'
import { LaunchpadFetchResult } from '@/types/ILaunchpad'
import { useWalletContext } from '@/WalletContext'

import { MintingPageContainer } from './MintingPageContainer'

export function LaunchpadLive() {
  const { address } = useWalletContext()
  const [launchpadEarlyAccessWhitelistCollections, setLaunchpadEarlyAccessWhitelistCollections] = useState<string[]>([])

  const baseUrl = import.meta.env.VITE_MARKETPLACE_BACKEND_API || 'https://marketplace-api.dogeord.io/'
  const currentLaunchpadActiveUrl = `${baseUrl}launchpad/list/active`
  let { data, error } = useFetch<LaunchpadFetchResult>(
    `${currentLaunchpadActiveUrl}?limit=100&offset=0&sortParam=launchpadEndDate&sortOrder=asc`
  )

  useEffect(() => {
    const fetchWhitelist = async () => {
      if (address) {
        const whitelistedCollections = await getDoginalCollectionsWhitelist(address)
        setLaunchpadEarlyAccessWhitelistCollections(whitelistedCollections)
      }
    }
    fetchWhitelist()
  }, [address])

  let collections: LaunchpadCollectionCardProps[] = []
  if (data) {
    collections = data!.collections.map(/* @ts-ignore */
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
            whitelistedForEarlyAccess: launchpadEarlyAccessWhitelistCollections.includes(collection.symbol),
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
          isActive: true,
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
              : 'There are no active collections at the moment. Please check back later.'}
          </h1>
        </div>
      ) : (
        collections.map((collection): any => (
          <div className="self-start" key={`LaunchpadCollectionCard-${collection.symbol}`}>
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
              launchpadEarlyAccessMinutes={collection.launchpadEarlyAccessMinutes}
              launchpadMintedSupply={collection.launchpadMintedSupply}
            />
          </div>
        ))
      )}
    </MintingPageContainer>
  )
}
