import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import { DiscordIcon } from '@/assets/icons/discord'
import { AssetTransferTab } from '@/pages/AccountPage'
import { DoginalsCollection } from '@/types/dogeNft'

import DoginalsCollectionInfo from './DoginalsInfo'

type DoginalsCollectionHeaderProps = {
  doginalsCollectionInfo: DoginalsCollection
  supply: number
}

const DoginalsCollectionHeader = ({ doginalsCollectionInfo, supply }: DoginalsCollectionHeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-8 border-2 border-account-page-background rounded-lg bg-account-info-background px-3 py-8 md:px-6 lg:px-10 lg:py-14">
      <div className="w-full flex xxs:justify-between lg:justify-start lg:gap-8">
        <img className="w-28 h-28 rounded-full" src={doginalsCollectionInfo.imageURI} />
        <div className="xxs:hidden lg:flex lg:min-w-lg" style={{color:'#000'}}>
          <DoginalsCollectionInfo doginalsCollectionInfo={doginalsCollectionInfo} supply={supply} />
        </div>
        <div className="flex flex-row flex-start text-xl">
          {doginalsCollectionInfo.websiteLink && (
            <a
              href={doginalsCollectionInfo.websiteLink}
              target="_blank"
              rel="noreferrer"
              style={{ lineHeight: '48px', padding: '0 8px' }}
            >
              <GlobalOutlined />
            </a>
          )}
          {doginalsCollectionInfo.twitterLink && (
            <a
              href={doginalsCollectionInfo.twitterLink}
              target="_blank"
              rel="noreferrer"
              style={{ lineHeight: '48px', padding: '0 8px' }}
            >
              <TwitterOutlined />
            </a>
          )}
          {doginalsCollectionInfo.discordLink && (
            <a
              href={doginalsCollectionInfo.discordLink}
              target="_blank"
              rel="noreferrer"
              style={{ lineHeight: '48px', padding: '0 8px' }}
            >
              <DiscordIcon />
            </a>
          )}
        </div>
        <div className="w-full flex justify-end items-center lg:pt-4">
          <Link to={`/account?activeTab=${AssetTransferTab.Doginals}`}>
            <button className="bg-selected-color xxs:px-2 xs:px-6 py-2 rounded-lg text-white font-semibold xs:whitespace-nowrap">
              LIST FOR SALE
            </button>
          </Link>
        </div>
      </div>
      <div className="lg:hidden w-full">
        <DoginalsCollectionInfo doginalsCollectionInfo={doginalsCollectionInfo} supply={supply} />
      </div>
    </div>
  )
}

export default DoginalsCollectionHeader
