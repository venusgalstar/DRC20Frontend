import { AlignLeftOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import React from 'react'

import CollectionMintingCard, {
  CollectionMintingCardProps,
} from '@/components/doginalpacks/collection/CollectionMintingCard'
import ImageCarousel from '@/components/doginalpacks/collection/ImageCarousel'
import { MintingPageContainer } from '@/components/launchpad/MintingPageContainer'

import styles from './packs.module.scss'

const { Panel } = Collapse

const INVESTOR_PACKS_MAX_MINTS_PER_WALLET: number = 1000
const LABS_PACKS_MAX_MINTS_PER_WALLET: number = 1000
const MACHINE_MAX_MINTS_PER_WALLET: number = 1000

const INVESTOR_PACKS_DOGE_PER_MINT: number = 495
const LABS_PACKS_DOGE_PER_MINT: number = 195
const MACHINE_DOGE_PER_MINT: number = 15

const FIX_FUNDING_WALLET_INVESTOR_PACK: string = 'DFGDWtM28mhgFBQXV7RJiKy8M6eLzjqM2z'
const FIX_FUNDING_WALLET_LAB_PACK: string = 'D6mNxLfceUTxKRdhvLFv98WiKiKXSyVbqJ'

const honorariesImages = [
  '/images/doginals/honoraries/img_1.png',
  '/images/doginals/honoraries/img_2.png',
  '/images/doginals/honoraries/img_3.png',
  '/images/doginals/honoraries/img_4.png',
  '/images/doginals/honoraries/img_5.png',
  '/images/doginals/honoraries/img_6.png',
  '/images/doginals/honoraries/img_7.png',
  '/images/doginals/honoraries/img_8.png',
  '/images/doginals/honoraries/img_9.png',
  '/images/doginals/honoraries/img_10.png',
  '/images/doginals/honoraries/img_11.png',
  '/images/doginals/honoraries/img_12.png',
  '/images/doginals/honoraries/img_13.png',
  '/images/doginals/honoraries/img_14.png',
  '/images/doginals/honoraries/img_15.png',
  '/images/doginals/honoraries/img_16.png',
  '/images/doginals/honoraries/img_17.png',
  '/images/doginals/honoraries/img_18.png',
  '/images/doginals/honoraries/img_19.png',
  '/images/doginals/honoraries/img_20.png',
  '/images/doginals/honoraries/img_21.png',
]

const labradogesImages = [
  '/images/doginals/labradoges/img_1.png',
  '/images/doginals/labradoges/img_2.png',
  '/images/doginals/labradoges/img_3.png',
  '/images/doginals/labradoges/img_4.png',
  '/images/doginals/labradoges/img_5.png',
  '/images/doginals/labradoges/img_6.png',
  '/images/doginals/labradoges/img_7.png',
]

const firsteditionsImages = [
  '/images/doginals/firsteditions/img_1.png',
  '/images/doginals/firsteditions/img_2.png',
  '/images/doginals/firsteditions/img_3.png',
  '/images/doginals/firsteditions/img_4.png',
  '/images/doginals/firsteditions/img_5.png',
  '/images/doginals/firsteditions/img_6.png',
  '/images/doginals/firsteditions/img_7.png',
]

const collections: CollectionMintingCardProps[] = [
  {
    name: 'investor-packs',
    imgSrc: '/images/investor-pack.png',
    altText: 'Investor Packs',
    mintingConfig: {
      maxMintsPerWallet: INVESTOR_PACKS_MAX_MINTS_PER_WALLET,
      dogePerMint: INVESTOR_PACKS_DOGE_PER_MINT,
      fixedMinters: 420,
      showStatus: true,
      isSoldOut: true,
      fundingWalletAddress: FIX_FUNDING_WALLET_INVESTOR_PACK,
      imgSrcSoldOut: '/images/investor-pack-sold-out.png',
      progressPercent: 100,
      totalSupply: 7644,
      currentSupply: 7644,
    },
    steps: [
      {
        label: 'Investor Packs',
        description: 'The magnus opus of Doge Labs and the Doginals movement. ',
      },
      {
        label: 'Thank you!',
        description: 'Just thank you.',
      },
    ],
    description:
      'The magnus opus of Doge Labs and the Doginals movement. Investor Packs reveal one 1st-Edition Labradoge each, which uniquely display the iconic Doge Labs background. All other Labradoge traits are randomized, and may include any of the 21 one-of-one honoraries within the collection. \n' +
      '\n' +
      '1st-Edition Labradoges may be ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ (as well as their 1st-Edition benefits). Once gone, they will never be inscribed again. Own your own piece of Doginals history and cement your status as an early Dogecoin Ordinals super-adopter.\n' +
      '\n' +
      'Unique benefits of holding a 1st-Edition Labradoge include:\n' +
      '✅ Automatic 50% discount on Doge Lab marketplace fees.\n' +
      '✅ Early access to new features.\n' +
      '✅ Official recognition as a co-developer of the first automated market in Dogecoin history. Toss it on your resumé - seriously.\n' +
      '✅ Earn limited edition, tradeable NFT badges denoting your early status in Doginals (Supporter = 1+, Sponsor = 2+, Contributor = 6+, Angel Investor = 10).\n' +
      '✅ Highlighted on Discord with a special, limited-edition forever role.\n' +
      '✅ All of the benefits of a regular Labradoge.',
    isActive: true,
  },
  {
    name: 'labs-packs',
    imgSrc: '/images/lab-pack.png',
    altText: 'Lab Packs',
    mintingConfig: {
      maxMintsPerWallet: LABS_PACKS_MAX_MINTS_PER_WALLET,
      dogePerMint: LABS_PACKS_DOGE_PER_MINT,
      fixedMinters: 10,
      showStatus: true,
      isSoldOut: true,
      imgSrcSoldOut: '/images/lab-pack-sold-out.png',
      fundingWalletAddress: FIX_FUNDING_WALLET_LAB_PACK,
      progressPercent: 100,
      totalSupply: 2356,
      currentSupply: 2356,
    },
    steps: [
      {
        label: 'Lab Packs',
        description: 'Perfect solution for individuals who want to get in early.',
      },
      {
        label: 'Thank you!',
        description: 'Just thank you.',
      },
    ],
    description:
      'Want to join in on the fun with your very own limited-edition Dogecoin identity? Lab Packs are the perfect solution for individuals who want to get in early and own their own digital ID but don’t require the additional benefits of an Investor Pack.\n' +
      '\n' +
      'Each Lab Pack opens to reveal one randomized Labradoge NFT with six varying traits, which can be used as your personal Doginals identity. Labradoges may be ▇▇▇▇ at the Dog Park in conjunction with Ballz NFTs, and may include any of the 21 one-of-one honoraries listed within the collection. Once gone, Labradoges will never be inscribed again.\n' +
      '\n' +
      'Benefits of holding a Labradoge include:\n' +
      '✅ Your very own unique, on-chain Dogecoin Identity.\n' +
      '✅ ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇\n' +
      '✅ Chance to pull any of the 21 one-of-one honoraries listed within the Labradoge collection.\n' +
      '✅ Prove your status as an early adopter.\n' +
      '✅ Support Doge Labs and the Dogecoin Ordinals ecosystem.',
    isActive: true,
  },
  {
    name: 'machine',
    imgSrc: '/images/myterious.png',
    altText: '▇▇▇▇ Machine',
    mintingConfig: {
      maxMintsPerWallet: MACHINE_MAX_MINTS_PER_WALLET,
      dogePerMint: MACHINE_DOGE_PER_MINT,
      fixedMinters: 0,
      showStatus: false,
      isSoldOut: false,
      fundingWalletAddress: FIX_FUNDING_WALLET_LAB_PACK,
    },
    steps: [
      {
        label: '▇▇▇▇ Machine',
        description: '▇▇▇▇',
      },
      {
        label: 'Thank you!',
        description: 'Just thank you.',
      },
    ],
    description: '',
    isActive: false,
  },
]

export function Packs() {
  return (
    <>
      <MintingPageContainer>
        {collections.map((collection, index): any => (
          <div className="self-start" key={`${collection}${index}`}>
            <CollectionMintingCard
              isActive={collection.isActive}
              name={collection.name}
              steps={collection.steps}
              altText={collection.altText}
              imgSrc={collection.imgSrc}
              mintingConfig={collection.mintingConfig}
            />
          </div>
        ))}
      </MintingPageContainer>
      <div className="flex-col flex items-start mb-12">
        <h1 className="text-xl font-bold mb-4">What are Doge Lab Packs?</h1>
        <div className="flex-col flex items-start justify-start">
          <p className="text-left">
            The first on-chain web3 identities have arrived - and they’re built entirely on Dogecoin! A revolution in
            NFTs, Doge Labs Packs are your gateway into both Dogecoin Ordinals and Doge Labs. Each pack opens to contain
            one Labradoge, fully equipped with six categories of randomized traits. Owning them is accompanied with a
            variety of benefits across the Doginals ecosystem.
          </p>
          <p className="mt-4 text-left">
            An attestation to the limits and prowess of the Dogecoin blockchain, there are over 5,000,000 unique
            Labradoge combinations in total. However, only 10,000 Labradoges are available in the collection at any
            given time. Labradoge may be ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ at the Dog Park.
          </p>
          <p className="mt-4 text-left">
            Featuring an incredibly diverse <strong>21 one-of-one honorary designs</strong> used to signify, represent,
            and honor the history of NFTs and Ordinals at large, the Labradoge collection is unlike any seen on Dogecoin
            or within the broader cryptocurrency ecosystem to date.
          </p>
          <p className="mt-4 text-left">
            Own a piece of Dogecoin history with your very own Labradoge. Max supply of 10,000 (split between
            1st-Editions and regular Labs).
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-start items-left">
        <span className="text-left font-bold text-xs mb-2">Investor Packs: First Editions</span>
        <ImageCarousel images={firsteditionsImages} />
      </div>
      <div className="flex flex-col justify-start items-left">
        <span className="text-left font-bold text-xs mb-2">Lab Packs: Labradoges</span>
        <ImageCarousel images={labradogesImages} />
      </div>
      <div className="flex flex-col justify-start items-left">
        <span className="text-left font-bold text-xs mb-2">Investor & Lab Packs: Honararies</span>
        <ImageCarousel images={honorariesImages} />
      </div>
      {collections.map((collection, index): any => (
        <Collapse
          key={`collapse-${collection}${index}`}
          className="w-full mt-6 overflow-y-auto"
          // style={{ maxHeight: '400px' }}
          // activeKey={`${index + 1}`}
          defaultActiveKey={[1]}
          expandIcon={() => <AlignLeftOutlined style={{ color: '#feb628' }} />}
        >
          <Panel header={collection.altText} key={`${index + 1}`}>
            {collection.description &&
              collection.description.split('\n').map((text, idx) => (
                <span key={idx} className="text-left block">
                  {text}
                  <br />
                </span>
              ))}
          </Panel>
        </Collapse>
      ))}
    </>
  )
}
