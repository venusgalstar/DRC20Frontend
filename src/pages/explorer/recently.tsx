//import React from 'react'
import { Timeline } from 'react-twitter-widgets'

import DownloadWallet from '@/components/DownloadWallet'
import { BaseColumns, Table } from '@/components/ExplorerTable'
import TopCoinsByCategory from '@/components/TopCoinsByCategory'

import PageBase from '../_base'

import '../index.css'

const Recently = () => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'

  const columns = [
    BaseColumns.tick(),
    BaseColumns.limitPerMint(),
    BaseColumns.mintingTransactions(),
    BaseColumns.supply(),
    BaseColumns.holders(),
    BaseColumns.added(),
    BaseColumns.actionButtons(),
  ]

  return (
    <PageBase>
      <div className="flex flex-row justify-between space-x-8">
        <div className="topBox hide-mobile flex-grow">
          <DownloadWallet />
        </div>
        <div className="topBox hide-mobile flex-grow">
          <TopCoinsByCategory
            url={`${baseUrl}/ticks/list/ranking?size=3&page=0`}
            title="👑 &nbsp; Ranking"
            moreLink="/explorer/ranking"
          />
        </div>
        {/*<div className="topBox hide-mobile flex-grow">*/}
        {/*  <TopCoinsByCategory*/}
        {/*    url={`${baseUrl}/ticks/list/trending?size=3&page=0`}*/}
        {/*    title="🔥 &nbsp; Trending"*/}
        {/*    moreLink="/explorer/trending"*/}
        {/*  />*/}
        {/*</div>*/}
        <div
          className="topBox flex-grow"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'url(/twitter.svg)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: 'rgba(88, 102, 126, 0.08) 0px 4px 24px, rgba(88, 102, 126, 0.12) 0px 1px 2px',
            borderRadius: '12px',
            height: '200px',
            marginBottom: '1rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'verydogelabs',
            }}
            options={{
              chrome: 'noheader, nofooter, noborders, noscrollbar',
              limit: '3',
              height: '200',
            }}
          />
        </div>
      </div>
      {/*<div className="topBox show-mobile-only-flex">*/}
      {/*  <TopCoinsByCategory*/}
      {/*    url={`${baseUrl}/ticks/list/ranking?size=3&page=0`}*/}
      {/*    title="👑 &nbsp; Ranking"*/}
      {/*    moreLink="/explorer/ranking"*/}
      {/*  />*/}
      {/*</div>*/}
      <div className="mt-8" style={{ width: '100%' }}>
        <Table baseUrl={`${baseUrl}/ticks/list/recentlyAdded`} columns={columns} tableId="recentlyAdded" />
      </div>
    </PageBase>
  )
}

export default Recently
