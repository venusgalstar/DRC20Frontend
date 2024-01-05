import { useLocation, useNavigate } from 'react-router-dom'
import { createContext, useState, useMemo } from 'react'
import BaseButton from '@/components/BaseButton'
import ErrorSection from '@/components/ErrorSection'
// import { featuredTicks } from '@/components/ExplorerTable'
import HoldersAndTransfersTable from '@/components/HoldersAndTransfersTable'
import InfoContainer from '@/components/InfoContainer'
import LoadingSection from '@/components/LoadingSection'
import Progress from '@/components/Progress'
// import TicksVerifiedAndImage from '@/components/TicksVerifiedAndImage'
import TokenNameWithTrustLevel from '@/components/TokenNameWithTrustLevel'
import useTokenInfo from '@/hooks/useTokenInfo'
import { truncateAddress } from '@/utils'

import PageBase from './_base'

const InfoItem = ({ title, value, isLast = false }: { title: string; value: any; isLast?: boolean }) => (
  <div style={{ marginBlockEnd: isLast ? '0px' : '12px' }}>
    <h4 style={{ color: '#666', fontWeight: 'bold' }}>{title}</h4>
    <span style={{ marginInlineStart: '24px', fontWeight: 'bold' }}>{value}</span>
  </div>
)

const TokenInfo = () => {
  let navigate = useNavigate()
  const { pathname } = useLocation()
  const token = decodeURIComponent(pathname.split('/')[2])
  const { data, error } = useTokenInfo({ tokenSymbol: token })

  const isLoading = useMemo(() => !error && !data, [error, data])

  return (
    <PageBase>
      {error && <ErrorSection />}
      {isLoading && <LoadingSection />}
      {!error && data && (
        <div className="flex-column">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="flex-center">
              <h1 style={{ color: '#feb628', fontSize: '36px', fontWeight: 'bold', marginBlockEnd: '0px' }}>{token}</h1>
              <TokenNameWithTrustLevel tokenName={token} width="24px" height="24px" />
              {/*<TicksVerifiedAndImage tick={token} trustLevel={1} width="24px" height="24px" />*/}
            </div>
            <span style={{ color: '#ccc', fontSize: '24px', fontWeight: 'bold', textTransform: 'capitalize' }}>
              {data.status}
            </span>
          </div>
          <Progress percent={data.percentage || 0} strokeColor="#3ac79c" />
          <InfoContainer
            head={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ display: 'inline-block', fontWeight: 'bold', marginBlockEnd: '0px' }}>Overview</h2>

                <BaseButton
                  buttonType="primary"
                  onClick={() => navigate(`/marketplace/drc20/${token}`)}
                  style={{ marginInlineStart: '24px' }}
                >
                  Trade
                </BaseButton>
              </div>
            }
            body={
              <div style={{ textAlign: 'left', paddingBlockStart: '24px' }}>
                <InfoItem
                  title="Inscription :"
                  value={
                    <a
                      href={`https://wonky-ord.dogeord.io/shibescription/${data.inscription}`}
                      target="_self"
                      rel="noopener noreferrer"
                    >
                      {data.inscription && truncateAddress(data.inscription)}
                    </a>
                  }
                />
                <InfoItem title="Supply:" value={Number(data.supply).toLocaleString()} />
                <InfoItem title="Minted:" value={Number(data.minted).toLocaleString()} />
                <InfoItem title="Limit per mint:" value={Number(data.limitPerMint).toLocaleString()} />
                <InfoItem title="Holders:" value={Number(data.holders).toLocaleString()} />
                {data?.rank && <InfoItem title="Deploy Number:" value={Number(data.rank).toLocaleString()} />}

                {/* Can be commented in once API is ready */}
                {/* <InfoItem
                  title="Deploy By :"
                  value={
                    <a
                      href={'https://unisat.io/brc20/bc1pxaneaf3w4d27hl2y93fuft2xk6m4u3wc4rafevc6slgd7f5tq2dqyfgy06'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    >
                      {data.deployBy}
                    </a>
                  }
                />
                <InfoItem title="Deploy Time :" value={formatTimestamp(data.deployTime)} />
                <InfoItem title="Completed Time :" value={formatTimestamp(data.completedTime)} />
                <InfoItem title="Inscription Number Start :" value={`#${data.inscriptionNumberStart}`} />
                <InfoItem title="Inscription Number End :" value={`#${data.inscriptionNumberEnd}`} />
                <InfoItem title="Total Transactions :" value={Number(data.totalTransactions).toLocaleString()} isLast /> */}
              </div>
            }
          />
          {/* TOOD: comment back in and plug into API, once it exists :) */}
          {/* <br />*/}
          <br />
          <HoldersAndTransfersTable tokenSymbol={token} />
        </div>
      )}
    </PageBase>
  )
}

export default TokenInfo
