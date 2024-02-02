import { RightOutlined } from '@ant-design/icons'
import { useFetch } from 'usehooks-ts'

import TicksVerifiedAndImageForTopCoins from '@/components/TicksVerifiedAndImageForTopCoins'
import { currencyFormatter } from '@/utils/numberFormatter'

import PercentValue from './PercentValue'

import '../pages/index.css'

type TopCoinsByCategoryProps = {
  url: string
  title: string
  moreLink: string
  showMoreLink?: boolean
  onClickTopCoin?: (tick: string) => void
}

export const TopCoinsByCategory = ({
  url,
  title,
  moreLink,
  showMoreLink = true,
  onClickTopCoin = undefined,
}: TopCoinsByCategoryProps) => {
  let { data } = useFetch<any>(url)

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        boxShadow: 'rgba(88, 102, 126, 0.08) 0px 4px 24px, rgba(88, 102, 126, 0.12) 0px 1px 2px',
        borderRadius: '0px',
        height: '200px',
        padding: '1rem',
        marginBottom: '1rem',
        width: '100%',
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="text-left font-bold" style={{ fontSize: '16px' }}>
            {title}
          </div>
        </div>
        {showMoreLink && (
          <div className="text-right text-sm" style={{ fontWeight: '600' }}>
            <a href={moreLink}>
              More <RightOutlined style={{ fontSize: '10px' }} />
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {!data && (
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <div className="text-left text-sm">Loading...</div>
            </div>
          </div>
        )}
        {data && (
          <div className="flex flex-col justify-center pt-2 pb-2">
            <span className="text-right font-bold text-#808a9d" style={{ fontSize: '12px' }}>
              {moreLink === '/explorer/trending' ? (
                <span>Volume 24h</span>
              ) : moreLink === '/explorer/recently' ? (
                <span>Minted</span>
              ) : (
                <span>Market Cap</span>
              )}
            </span>
          </div>
        )}
        {data?.data.map((item: any, index: number) => {
          return (
            <div
              key={`topCoins-${moreLink}-${index}`}
              className="flex flex-row justify-between hoverPointer"
              style={{
                lineHeight: '24px',
                marginBottom: '16px',
              }}
              onClick={onClickTopCoin ? () => onClickTopCoin(item.tick) : undefined}
            >
              <div className="flex flex-col">
                <TicksVerifiedAndImageForTopCoins row={item} index={index} />
              </div>
              <div className="flex flex-col">
                <div className="text-right text-sm">
                  {moreLink === '/explorer/trending' ? (
                    <span>{currencyFormatter(item.volume24h)}</span>
                  ) : moreLink === '/explorer/recently' ? (
                    <PercentValue value={parseFloat(((item.minted / item.supply) * 100).toFixed(2))} />
                  ) : (
                    <span>{currencyFormatter(item.marketCap)}</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopCoinsByCategory
