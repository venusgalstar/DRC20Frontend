import { Image } from 'antd'
import { createContext, useCallback, useMemo, useRef, useState, useEffect } from 'react'

import { getDoginalCollectionInfo } from '@/api'
import LaunchpadCollectionCard, { LaunchpadCollectionCardProps } from '@/components/launchpad/LaunchpadCollectionCard'
import { MintingPageContainer } from '@/components/launchpad/MintingPageContainer'
import { championsTcgCollectionSymbols } from '@/pages/service/championsTCG'

import styles from './packs.module.scss'

export function Packs() {
  const [doginalCollectionsList, setDoginalCollectionsList] = useState<any>([])

  const fetchCollectionsData = useCallback(async () => {
    const doginalsList = await Promise.all(
      championsTcgCollectionSymbols.map(async (symbol: string) => {
        try {
          const collectionResult = await getDoginalCollectionInfo(symbol)
          return collectionResult.collection
        } catch (err) {
          console.error(`Failed to fetch info for collection: ${symbol}`, err)
          return null
        }
      })
    )
    setDoginalCollectionsList(doginalsList)
  }, [])

  useEffect(() => {
    fetchCollectionsData()
  }, [fetchCollectionsData])

  // Filter out null values
  const filteredDoginalCollectionsList = doginalCollectionsList.filter(
    (doginalCollection: any) => doginalCollection !== null
  )

  let collections: LaunchpadCollectionCardProps[] = []
  if (filteredDoginalCollectionsList) {
    console.log('filteredDoginalCollectionsList', filteredDoginalCollectionsList)
    collections = filteredDoginalCollectionsList.map(
      (collection: any) =>
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
          isActive: true,
          launchpadEndTimestamp: new Date(collection.launchpadEndDate),
        } as unknown as LaunchpadCollectionCardProps)
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-white text-left">
        Champions TCG{' '}
        <span className="text-xxs">
          powered by{' '}
          <a href="/" target="_self" rel="noopener noreferrer">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={24}
              height={24}
              preview={false}
              style={{ marginTop: '8px', marginLeft: '4px' }}
            />
          </a>
        </span>
      </h1>
      <MintingPageContainer>
        {collections.map((collection, index): any => (
          <div className="self-start" key={`${collection}${index}`}>
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
              highlightColor="#1B4DCF"
            />
          </div>
        ))}
      </MintingPageContainer>
      <div className="flex-col flex items-start mb-12">
        <h1 className="text-xl font-bold mb-4 text-white">What is Champions TCG?</h1>
        <div className="flex-col flex items-start justify-start text-white">
          <p className="text-left">
            Champions TCG is an online card game where players can buy, sell, collect, or trade their cards!
          </p>
          <p className="mt-4 text-left">Cards have been released on multiple blockchains BTC, BSV, and now DOGE!</p>
          <p className="mt-4 text-left">
            Players can combine cards from multiple blockchains to build a deck and compete against other players in our
            "Ranked Ladder'. <br />
            We also run free to enter tournaments daily with prizes varying from $75 to $500 + limited edition
            tournament cards.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 items-start md:grid-cols-2 lg:grid-cols-3 mt-24">
          <div>
            <Image
              src="/images/championsTCG/championstcg-gen1.png"
              alt="1st Generation"
              width="100%"
              preview={false}
              style={{ marginTop: '8px', marginLeft: '4px' }}
            />
            <h1 className="text-xl font-bold mb-4 text-white">1st Generation</h1>
            <p className=" text-white px-16">151 different champions, total of 10,000 cards</p>
          </div>
          <div>
            <Image
              src="/images/championsTCG/championstcg-gen2.png"
              alt="2nd Generation"
              width="100%"
              preview={false}
              style={{ marginTop: '8px', marginLeft: '4px' }}
            />
            <h1 className="text-xl font-bold mb-4 text-white">2nd Generation</h1>
            <p className=" text-white px-16">
              149 different trading cards, total of 100,000 cards - sale live soon after gen 1
            </p>
          </div>
          <div>
            <Image
              src="/images/championsTCG/championstcg-tournament.png"
              alt="Tournament Editions"
              width="100%"
              preview={false}
              style={{ marginTop: '8px', marginLeft: '4px' }}
            />
            <h1 className="text-xl font-bold mb-4 text-white">Tournament Editions</h1>
            <p className=" text-white px-16">
              Win these cards as a prize by participating in our free to enter daily Tournaments
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
