import { Timeline } from 'react-twitter-widgets'
//import { useFetch } from 'usehooks-ts'

import { BaseColumns, Table } from '@/components/ExplorerTable'
import TopCoinsByCategory from '@/components/TopCoinsByCategory'
//import { DEFAULT_PAGE_SIZE, FetchResult, PaginationData } from '@/types/IExplorer'

import PageBase from '../_base'

import '../index.css'

const Trending = () => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api-rc.dogeord.io'

  const columns = [
    BaseColumns.tick(),
    BaseColumns.limitPerMint(),
    BaseColumns.mintingTransactions(),
    BaseColumns.supply(),
    BaseColumns.holders(),
    BaseColumns.actionButtons(),
  ]

  return (
    <PageBase>
      <div className="flex flex-row justify-between space-x-8">
        <div className="topBox hide-mobile flex-grow">
          <TopCoinsByCategory
            url={`${baseUrl}/ticks/list/ranking?size=3&page=0`}
            title="👑 &nbsp; Ranking"
            moreLink="/explorer/ranking"
          />
        </div>
        {/*<div className="topBox hide-mobile flex-grow">*/}
        {/*  <TopCoinsByCategory*/}
        {/*    url={`${baseUrl}/ticks/list/recentlyAdded?size=3&page=0`}*/}
        {/*    title="🕓 &nbsp; Recently Added"*/}
        {/*    moreLink="/explorer/recently"*/}
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
        <Table baseUrl={`${baseUrl}/ticks/list/trending`} columns={columns} tableId="trending" />
      </div>
    </PageBase>
  )
}

export default Trending
