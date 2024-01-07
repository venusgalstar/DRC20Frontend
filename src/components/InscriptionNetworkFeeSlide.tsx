import { useFetch } from 'usehooks-ts'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import InfoPopover from '@/components/InfoPopover'
import usePostInscriptions from '@/hooks/usePostInscriptions'
import { InscriptionType } from '@/pages/service/inscribe'

import SliderButton from './SliderButton'

const HundredMil = 100000000

type InscriptionNetworkFeeSlideProps = {
  onClick: (option: any) => void
  contents: any[]
  pricingData: any
  type: InscriptionType
  receivingAddress: string
}
type BoxProps = {
  isActive: boolean
  onBoxClick: () => void
  title: string
  style?: React.CSSProperties
  price: number
  popOverText: string
}

export type FeeType = 'economyPricing' | 'priorityPricing'

const InscriptionNetworkFeeSlide = ({
  contents,
  onClick,
  pricingData,
  type,
  receivingAddress,
}: InscriptionNetworkFeeSlideProps) => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
  const currentDogePriceUrl = `${baseUrl}/ticks/currentDogePrice`
  const { data: currentDogePrice } = useFetch(currentDogePriceUrl)
  const makePostRequest = usePostInscriptions({
    type,
    contents,
    receivingAddress,
  })
  const [dollarPerDoge, setDollarPerDoge] = useState<number>(0.085)
  const networkFeeTypes = {
    Economy: { price: 1, chosen: false },
    Priority: { price: 2, chosen: true },
  }
  const [feeType, setFeeType] = useState<FeeType>('priorityPricing')
  const [error, setError] = useState<null | string>(null)
  //const contentAmount = contents?.length ?? 0
  const dogemapFee = useMemo(
    () => (pricingData ? (pricingData?.[feeType]?.prices?.isDogemap ? pricingData[feeType].prices.dogemapFee : 0) : 0),
    [feeType, pricingData]
  )
  const serviceFeeItems = useMemo(
    () =>
      pricingData
        ? pricingData[feeType]?.prices?.shibescriptionCostsBySize?.length > 0
          ? pricingData[feeType].prices.shibescriptionCostsBySize.filter((item: any) => item.costs > 0).length
          : 0
        : 0,
    [feeType, pricingData]
  )

  const Box = ({ isActive = false, title, price, onBoxClick, popOverText, style }: BoxProps) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        flex: '1',
        border: `2px solid ${isActive ? '#FFB627' : '#f5f5f5'}`,
        borderRadius: '16px',
        padding: '12px',
        ...style,
      }}
      onClick={onBoxClick}
    >
      <span style={{ display: 'inline-block' }}>
        {title}
        <InfoPopover content={<div style={{ maxWidth: '300px' }}>{popOverText}</div>} />
      </span>
      <span style={{ display: 'inline-block', fontSize: '16px' }}>
        <span style={{ fontWeight: 'bold', color: isActive ? '#FFB627' : '#000' }}>{price}</span>
        <span style={{ fontSize: '11px', marginInlineStart: '6px', color: '#000' }}>{'DOGE / per Item'}</span>
      </span>
    </div>
  )

  const inscribe = useCallback(async () => {
    try {
      const response = await makePostRequest(feeType === 'priorityPricing')
      const error = response?.errors?.[0]?.msg || ''
      if (error.length > 0) {
        setError(error)
      } else {
        setError(null)
        onClick({
          type: feeType,
          total: Number(pricingData[feeType]?.prices.totalFee / HundredMil),
          escrowWallet: response?.fundingAddress,
        })
      }
    } catch (e: any) {
      setError('Something went wrong.')
    }
  }, [feeType, makePostRequest, onClick, pricingData])

  useEffect(() => {
    //@ts-ignore
    currentDogePrice && setDollarPerDoge(currentDogePrice)
  }, [currentDogePrice])

  return (
    <>
      {pricingData && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginBlockEnd: '12px' }}>
            <Box
              title="Economy"
              price={networkFeeTypes.Economy.price}
              isActive={feeType === 'economyPricing'}
              onBoxClick={() => {
                setFeeType('economyPricing')
              }}
              popOverText="With 'Economy' your content will be inscribed with moderate network fees. With that you won’t get prioritized by miners in the Dogecoin network and inscribing might take a while. The duration also depends on the quantity and file sizes you wish to inscribe."
            />
            <Box
              title="Priority"
              price={networkFeeTypes.Priority.price}
              isActive={feeType === 'priorityPricing'}
              onBoxClick={() => {
                setFeeType('priorityPricing')
              }}
              style={{ marginInline: '12px' }}
              popOverText="With 'Priority' your content will be inscribed with increased network fees in order to get your shibscribtions prioritized over others. This will ensure a fast inscription process, also in times of high network usage."
            />
          </div>
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '10px 5px',
              border: '2px solid #f5f5f5',
              borderRadius: '16px',
              margin: '12px 0',
              padding: '12px 6px',
            }}
          >
            <div style={{ gridColumn: '1 / 2', textAlign: 'right', fontSize: '12.5px' }}>
              {'Network fee: '}
              <InfoPopover
                content={
                  <div
                    style={{ maxWidth: '300px' }}
                  >{`The network fee will be determined by the service level you chose (‘Economy’ = 1 DOGE / inscription, ‘Priority’ = 2 DOGE / inscription) multiplied by the number of items to be inscribed.`}</div>
                }
                style={{ margin: '0px 2px 0px 2px' }}
              />
              {': '}
            </div>
            <div
              style={{ gridColumn: '2 / 3', textAlign: 'right', fontSize: '12.5px' }}
            >{`${pricingData[feeType]?.prices?.numShibescriptions} item(s)`}</div>
            <div style={{ gridColumn: '3 / 4', textAlign: 'right', fontSize: '12.5px' }}>{`${Number(
              pricingData[feeType]?.prices?.totalShibescriptionFee / HundredMil
            )} DOGE`}</div>
            <div style={{ gridColumn: '4 / 5', textAlign: 'right', fontSize: '12.5px' }}>{`~$${Number(
              (pricingData[feeType]?.prices?.totalShibescriptionFee / HundredMil) * dollarPerDoge
            ).toFixed(2)}`}</div>

            <div style={{ gridColumn: '1 / 2', textAlign: 'right', fontSize: '12.5px' }}>
              {'+ Service fee (by size) '}
              <InfoPopover
                content={
                  <div
                    style={{ maxWidth: '300px' }}
                  >{`No service fee (by size) applies for all items ≤ 1 KB. For each file with a file size > 1 KB a service fee of 0.5 DOGE / KB will be applied, in order to cover additional network fees. There is a maximum file size of 25 KB / file.`}</div>
                }
                style={{ margin: '0px 2px 0px 2px' }}
              />
              {': '}
            </div>
            <div
              style={{ gridColumn: '2 / 3', textAlign: 'right', fontSize: '12.5px' }}
            >{`${serviceFeeItems} item(s)`}</div>
            <div style={{ gridColumn: '3 / 4', textAlign: 'right', fontSize: '12.5px' }}>{`${
              pricingData[feeType]?.prices?.totalServiceFee / HundredMil
            } DOGE`}</div>
            <div style={{ gridColumn: '4 / 5', textAlign: 'right', fontSize: '12.5px' }}>{`~$${Number(
              (pricingData[feeType]?.prices?.totalServiceFee / HundredMil) * dollarPerDoge
            ).toFixed(2)}`}</div>

            {dogemapFee > 0 && (
              <>
                <div style={{ gridColumn: '1 / 2', textAlign: 'right', fontSize: '12.5px' }}>
                  {'+ Dogemap fee '}
                  <InfoPopover
                    content={
                      <div style={{ maxWidth: '300px' }}>
                        {'This is a bot protection fee and goes directly to the miners.'}
                      </div>
                    }
                    style={{ margin: '0px 2px 0px 2px' }}
                  />
                  {': '}
                </div>
                <div style={{ gridColumn: '2 / 3', textAlign: 'right', fontSize: '12.5px' }}>{`${
                  dogemapFee / HundredMil
                } item(s)`}</div>
                <div style={{ gridColumn: '3 / 4', textAlign: 'right', fontSize: '12.5px' }}>{`${
                  pricingData[feeType]?.prices?.dogemapFee / HundredMil
                } DOGE`}</div>
                <div style={{ gridColumn: '4 / 5', textAlign: 'right', fontSize: '12.5px' }}>{`~$${Number(
                  (pricingData[feeType]?.prices?.dogemapFee / HundredMil) * dollarPerDoge
                ).toFixed(2)}`}</div>
              </>
            )}
          </div>
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gridTemplateRows: '30px auto 30px',
              gap: '15px 10px',
              fontWeight: 'bold',
              paddingRight: '6px',
            }}
          >
            <div style={{ gridColumn: '1 / 2', textAlign: 'right' }}>{'TOTAL : '}</div>
            <div
              style={{ gridColumn: '2 / 3', textAlign: 'right', fontSize: '12.5px', fontWeight: 'normal' }}
            >{`${serviceFeeItems} item(s)`}</div>
            <div style={{ gridColumn: '3 / 4', textAlign: 'right', fontSize: '12.5px' }}>{`${
              pricingData[feeType]?.prices?.totalFee / HundredMil
            } DOGE`}</div>
            <div style={{ gridColumn: '4 / 5', textAlign: 'right', fontSize: '12.5px' }}>{`~$${Number(
              (pricingData[feeType]?.prices?.totalFee / HundredMil) * dollarPerDoge
            ).toFixed(2)}`}</div>
          </div>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <SliderButton onClick={inscribe} isDisabled={!!error} />
    </>
  )
}

export default InscriptionNetworkFeeSlide
