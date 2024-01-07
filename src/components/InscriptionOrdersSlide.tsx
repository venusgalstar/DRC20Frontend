import { useCallback, useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { Popover, Tag } from 'antd'

import useInscriptionPricing from '@/hooks/useInscriptionPricing'
import { InscriptionType } from '@/pages/service/inscribe'

import CloseIconRoundBlack from './CloseIconRoundBlack'
import SliderButton from './SliderButton'

export type ConfirmType = {
  dataAccuracy: false
  termsAndConditions: false
}

type InscriptionOrdersSlideProps = {
  inscriptionType: InscriptionType
  contents: any[]
  confirm: ConfirmType
  setConfirm: (confirm: ConfirmType) => void
  setContents: (contents: any[]) => void
  goBackStep: () => void
  continueToNextStep: () => void
  setPricingData: (data: any) => void
}

const InscriptionOrdersSlide = ({
  contents,
  inscriptionType,
  confirm,
  setConfirm,
  setContents,
  setPricingData,
  goBackStep,
  continueToNextStep,
}: InscriptionOrdersSlideProps) => {
  const [prices, setPrices] = useState<null | any>(null)
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const makeInscriptionPricingRequest = useInscriptionPricing({ inscriptionType, contents })

  const fetchPrice = useCallback(async () => {
    try {
      setIsLoading(true)
      const priorityPricing = await makeInscriptionPricingRequest(true)
      const economyPricing = await makeInscriptionPricingRequest(false)
      const prices = { priorityPricing, economyPricing }
      const error = priorityPricing?.errors?.[0]?.msg || economyPricing?.errors?.[0]?.msg || ''
      if (error.length > 0) {
        setError(error)
      } else {
        setError(null)
        setPrices(prices)
      }
      setIsLoading(false)
    } catch (e: any) {
      console.log(e)
      setIsLoading(false)
      setError(e.message ?? 'Could not fetch prices.')
    }
  }, [makeInscriptionPricingRequest])

  const handleDelete = (idx: number) => {
    const newContents = [...contents]
    newContents.splice(idx, 1)
    setContents(newContents)
    // if no more orders, go back to previous step
    newContents.length < 1 && goBackStep()
  }

  useEffect(() => {
    fetchPrice()
  }, [fetchPrice, contents])

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null)
        goBackStep()
      }, 3000)
    }
  }, [error, goBackStep])

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ display: 'inline-block', marginInlineStart: '16px' }}>{contents?.length ?? 0} item(s)</span>
        <div
          style={{
            border: '2px solid #f5f5f5',
            borderRadius: '15px',
            maxWidth: '480px',
            width: '100%',
            margin: '24px auto',
            padding: '8px 16px',
            height: '170px',
            overflowY: 'scroll',
          }}
        >
          {contents?.map((content: any, idx: number) => (
            <Tag
              key={idx}
              style={{
                width: '100%',
                backgroundColor: '#EFF2F5',
                borderRadius: '5px',
                border: 'none',
                marginBlockEnd: '8px',
                padding: '6px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}
            >
              <Popover content={JSON.stringify(content)} trigger="hover" placement="right">
                <div
                  style={{
                    width: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
                  }}
                >
                  {inscriptionType === 'drc-20'
                    ? JSON.stringify(content)
                    : inscriptionType === 'Files'
                    ? content.filename
                    : inscriptionType === 'Dogemap'
                    ? content.dogemap
                    : content.text}
                </div>
              </Popover>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ color: '#FFB627' }}>{`${
                  prices?.priorityPricing?.prices?.shibescriptionCostsBySize[idx]?.size ?? 'unknown'
                } B`}</span>
                <CloseIconRoundBlack onClick={() => handleDelete(idx)} />
              </div>
            </Tag>
          ))}
        </div>
        <div className="flex-column">
          <div className="flex flex-row" style={{ textAlign: 'left' }}>
            <Checkbox
              checked={confirm.dataAccuracy}
              // @ts-ignore
              onChange={(event) => setConfirm({ ...confirm, dataAccuracy: event.target.checked })}
              sx={{
                color: '#FFAE42',
                '&.Mui-checked': {
                  color: '#FFAE42',
                },
              }}
            />
            <span style={{ marginBlockStart: '9px' }}>I confirm the accuracy of the input data.</span>
          </div>
          <div
            className="flex flex-row"
            style={{ justifyContent: 'flex-start', marginBottom: '16px', textAlign: 'left' }}
          >
            <Checkbox
              checked={confirm.termsAndConditions}
              // @ts-ignore
              onChange={(event) => setConfirm({ ...confirm, termsAndConditions: event.target.checked })}
              sx={{
                color: '#FFAE42',
                '&.Mui-checked': {
                  color: '#FFAE42',
                },
              }}
            />
            <span style={{ marginBlockStart: '18px' }}>
              {'I am using this service at my own risk and agree to the '}
              <a href="/legal/terms" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>
                Terms and Conditions.
              </a>
            </span>
          </div>
        </div>
      </div>
      {error && <span style={{ color: 'red' }}>{error || 'Could not fetch prices.'}</span>}
      <SliderButton
        text={isLoading ? 'Loading...' : 'Confirm'}
        isDisabled={!confirm.dataAccuracy || !confirm.termsAndConditions || error || !prices || isLoading}
        onClick={() => {
          setPricingData(prices)
          continueToNextStep()
        }}
      />
    </div>
  )
}

export default InscriptionOrdersSlide
