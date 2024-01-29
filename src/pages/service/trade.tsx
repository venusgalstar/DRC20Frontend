import { Menu } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
//import { Timeline } from 'react-twitter-widgets'
import {useState} from 'react'

import Listings from '@/components/Listings'
import Orders from '@/components/Orders'

import TopCoinsByCategory from '../../components/TopCoinsByCategory'
import PageBase from '../_base'

const navigationItems = [
  { key: 'listings', label: 'Listings' },
  { key: 'orders', label: 'Orders' },
]
const listingsSortings = [
  { key: 1, label: 'Price: From Low to High' },
  { key: 2, label: 'Price: From High to Low' },
  { key: 3, label: 'Time: From Latest to Earliest' },
  { key: 4, label: 'Time: From Earliest to Latest' },
]
const Trade = () => {
  const [filter, setFilter] = useState<null | string>(null)
  const [listingSorting, setListingSorting] = useState<number>(1)
  let navigate = useNavigate()
  const { search: params } = useLocation()
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://thedragontest.com/api'
  //const url = `${baseUrl}/ticks/list/ranking?size=10000&page=0`

  const navigateTo = (e: any) => {
    switch (e.key) {
      case 'listings':
        navigate('/service/trade?tab=listings')
        break
      case 'orders':
        navigate('/service/trade?tab=orders')
        break
      default:
        console.error(e)
    }
  }

  return (
    <PageBase>
      <div className="flex flex-row justify-between">
        <div className="topBox hide-mobile">
          <TopCoinsByCategory
            url={`${baseUrl}/ticks/list/trending?size=3&page=0`}
            title="🔥 &nbsp; Trending"
            moreLink="/explorer/trending"
            showMoreLink={false}
            onClickTopCoin={(tick) => {
              setFilter(tick)
            }}
          />
        </div>
        <div className="topBox hide-mobile">
          <TopCoinsByCategory
            url={`${baseUrl}/ticks/list/ranking?size=3&page=0`}
            title="👑 &nbsp; Market Cap"
            moreLink="/explorer/ranking"
            showMoreLink={false}
            onClickTopCoin={(tick) => {
              setFilter(tick)
            }}
          />
        </div>
        <div className="topBox hide-mobile">
          <TopCoinsByCategory
            url={`${baseUrl}/ticks/list/recentlyAdded?size=3&page=0`}
            title="🕓 &nbsp; Deploy date"
            moreLink="/explorer/recently"
            showMoreLink={false}
            onClickTopCoin={(tick) => {
              setFilter(tick)
            }}
          />
        </div>
      </div>
      <div className="topBox show-mobile-only-flex">
        <TopCoinsByCategory
          url={`${baseUrl}/ticks/list/trending?size=3&page=0`}
          title="🔥 &nbsp; Trending"
          moreLink="/explorer/trending"
          showMoreLink={false}
          onClickTopCoin={(tick) => {
            setFilter(tick)
          }}
        />
      </div>
      <div className="mt-8" style={{ width: '100%' }}>
        <Menu
          className="ant-menu-style"
          style={{
            backgroundColor: 'transparent',
            color: '#000000',
            fontSize: '14px',
            fontWeight: 'bold',
            top: 0,
            right: '20px',
            marginLeft: '0px',
            borderBottom: 0,
            justifyContent: 'flex-start',
          }}
          mode="horizontal"
          defaultSelectedKeys={['listings']}
          items={navigationItems}
          selectedKeys={params.includes('orders') ? ['orders'] : ['listings']}
          onClick={navigateTo}
        />
        {params.includes('orders') ? (
          <Orders />
        ) : (
          <Listings
            sortingOptions={listingsSortings}
            sorting={listingSorting}
            onChangeSorting={(x) => {
              setListingSorting(x)
            }}
            filter={filter}
            onChangeFilter={(x) => {
              setFilter(x)
            }}
          />
        )}
      </div>
    </PageBase>
  )
}

export default Trade
