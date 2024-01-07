import { Button, Segmented } from 'antd'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import { useLocalStorage } from 'usehooks-ts'

import { CheckCircleIcon } from '@/assets/icons/checkCircle'
import { CreditIcon } from '@/assets/icons/creditcard'
//import BaseButton from '@/components/BaseButton'
import InputField from '@/components/InputField'
import InscribeActionChooser from '@/components/InscribeActionChooser'
import InscriptionNetworkFeeSlide, { FeeType } from '@/components/InscriptionNetworkFeeSlide'
import InscriptionOrdersSlide, { ConfirmType } from '@/components/InscriptionOrdersSlide'
import ServiceContentContainer from '@/components/ServiceContentContainer'
import SliderButton from '@/components/SliderButton'
import SliderDeploy from '@/components/SliderDeploy'
import SliderFileUploadForm from '@/components/SliderFileUploadForm'
import SliderHeader from '@/components/SliderHeader'
import SliderMintOrTransfer from '@/components/SliderMintOrTransfer'
import SliderTextForm from '@/components/SliderTextForm'
import SliderUploadTypeChooser from '@/components/SliderUploadTypeChooser'

import PageBase from '../_base'

const types = ['drc-20', 'Files', 'Text', '.dogemap']
const actions = ['Mint', 'Deploy', 'Transfer']
const textUpload = ['Single', 'Bulk']
const dogemapUpload = ['Selected', 'Sequence']
export type InscriptionType = typeof types[number]
export type ActionType = typeof actions[number]
export type TextUploadType = typeof textUpload[number]
export type DogemapUploadType = typeof dogemapUpload[number]
type NetworkFee = { type: FeeType; total: number; escrowWallet: string | null }

const headerTexts = [
  {
    title: 'Upload',
    description: 'Compress all your files in a single ZIP-file and upload it to get the process started.',
    explanation: `Simply compress your collection of '.jpg', '.webp', or '.png' files into a single ZIP-file for hassle-free upload. Designed to streamline your process, this feature makes handling larger collections easier than ever.`,
  },
  { title: 'Order', description: 'Please check your order and confirm it.', explanation: '' },
  {
    title: 'Shibscription Fee',
    description: 'Choose the priority to process the inscription(s). A min. transaction volume of 10 DOGE applies.',
    explanation:
      'This fee is based on the number of items you are inscribing and the file sizes. See the info boxes in the calculation table for more details.',
  },
  { title: 'Payment', description: 'Fund the service wallet to get the process started.', explanation: '' },
  {
    title: 'Track Transaction',
    description: 'With your payment the process has been started.',
    explanation: 'Lorem ipsum',
  },
  {
    title: '.dogemap',
    description:
      'Add a .dogemap Id (Block Number) per line to inscribe them. We will add .dogemap to each line automatically.',
    explanation: `Each line will be inscribed on a separate Doginal. The .dogemap Id is the block number you want to inscribe. Please make sure that the block number is not already inscribed.`,
  },
]

const sliderSettings = {
  arrows: false,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: false,
}

const Inscribe = () => {
  let { tickParam } = useParams()
  let { maxMintParam } = useParams()

  const slider = useRef<Slider>(null)
  const [recentlyUsedAddress, _setRecentlyUsedAddress] = useLocalStorage('recentlyUsedAddress', '')
  const [formError, setFormError] = useState<null | string>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [inscriptionType, setInscriptionType] = useState<InscriptionType>(types[0])
  const [actionType, setActionType] = useState<ActionType>(actions[0])
  const [textUploadType, setTextUploadType] = useState<TextUploadType>(textUpload[0])
  const [dogemapUploadType, setDogemapUploadType] = useState<DogemapUploadType>(dogemapUpload[0])

  const [recipientAddress, setRecipientAddress] = useState('')
  const [tick, setTick] = useState(tickParam || '')
  const [limitPerMint, setLimitPerMint] = useState<null | number>(Number(maxMintParam) || null)
  const [totalSupply, setTotalSupply] = useState<null | number>(null)
  const [amount, setAmount] = useState<null | number>(null)
  const [text, setText] = useState<string>('')
  const [dogemap, setDogemap] = useState<string>('')
  const [file, setFile] = useState<null | any>(null)
  const [contents, setContents] = useState<any | null>(null)
  const [confirm, setConfirm] = useState<ConfirmType>({ dataAccuracy: false, termsAndConditions: false })
  const [networkFee, setNetworkFee] = useState<NetworkFee>({
    type: 'priorityPricing',
    total: 4,
    escrowWallet: null,
  })
  const [pricingData, setPricingData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleFromToChange = (from: number, to: number) => {
    if (from > 0 && to > 0 && from < to) {
      let numberString = ''
      for (let i = from; i <= to; i++) {
        numberString += i.toString() + '\n'
      }
      setDogemap(numberString)
    }
  }

  const FirstSlideContentManager = () => {
    if (activeStep === 0) {
      switch (inscriptionType) {
        case 'drc-20':
          if (actionType === actions[0]) {
            return (
              <SliderMintOrTransfer
                actionType="Mint"
                setTick={(x) => setTick(x)}
                amount={amount}
                setAmount={(x) => setAmount(x)}
                recipientAddress={recipientAddress}
                setRecipientAddress={(x) => setRecipientAddress(x)}
                tick={tick}
              />
            )
          } else if (actionType === actions[2]) {
            return (
              <SliderMintOrTransfer
                actionType="Transfer"
                setTick={(x) => setTick(x)}
                amount={amount}
                setAmount={(x) => setAmount(x)}
                recipientAddress={recipientAddress}
                setRecipientAddress={(x) => setRecipientAddress(x)}
                tick={tick}
              />
            )
          }
          return (
            <SliderDeploy
              tick={tick}
              setTick={(x) => setTick(x)}
              totalSupply={totalSupply}
              setTotalSupply={(x) => setTotalSupply(x)}
              limitPerMint={limitPerMint}
              setLimitPerMint={(x) => setLimitPerMint(x)}
              recipientAddress={recipientAddress}
              setRecipientAddress={(x) => setRecipientAddress(x)}
              setError={(x) => setFormError(x)}
            />
          )
        case 'Files':
          return (
            <SliderFileUploadForm
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={(x) => setRecipientAddress(x)}
              onChangeFile={(y) => setFile(y)}
              file={file}
            />
          )
        case 'Text':
          if (textUploadType === 'Single')
            return (
              <SliderTextForm
                text={text}
                onChangeText={(x) => setText(x)}
                recipientAddress={recipientAddress}
                onChangeRecipientAddress={(x) => setRecipientAddress(x)}
                placeholder={'Add your text here'}
              />
            )
          return (
            <SliderTextForm
              text={text}
              onChangeText={(x) => setText(x)}
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={(x) => setRecipientAddress(x)}
              placeholder={'Hello \nDoge Labs \netc.'}
            />
          )
        case '.dogemap':
          return (
            <SliderTextForm
              text={dogemap}
              onChangeText={(x) => {
                const regex = /^\d*$/
                const lines = x.split('\n')
                const errors: string[] = []
                for (let line of lines) {
                  if (!regex.test(line)) {
                    errors.push(`Line "${line}" is ${regex.test(line)} not numeric.`)
                    break
                  }
                }

                if (errors.length > 0) {
                  setFormError(errors.join('\n'))
                } else {
                  setFormError(null)
                  setDogemap(x)
                }
              }}
              recipientAddress={recipientAddress}
              onChangeRecipientAddress={(x) => setRecipientAddress(x)}
              placeholder={'Add your .dogemap ids here \n 1 \n 2 \n 3 \n etc.'}
              onChangeFromTo={dogemapUploadType === 'Sequence' ? handleFromToChange : undefined}
            />
          )
      }
    }
  }

  const SlideHeaderManager = () => {
    if (activeStep === 0) {
      if (inscriptionType === types[0]) {
        return (
          <InscribeActionChooser
            actions={actions}
            actionType={actionType}
            onChangeActionType={(x) => {
              reset()
              setActionType(x)
            }}
          />
        )
      } else if (inscriptionType === types[1]) {
        return SliderHeader(headerTexts[0].title, headerTexts[0].description, headerTexts[0].explanation)
      } else if (inscriptionType === types[3]) {
        return (
          <>
            {SliderHeader(headerTexts[5].title, headerTexts[5].description, headerTexts[5].explanation)}
            <SliderUploadTypeChooser
              upload={dogemapUpload}
              uploadType={dogemapUploadType}
              onChange={(x) => setDogemapUploadType(x)}
            />
          </>
        )
      } else {
        return (
          <SliderUploadTypeChooser
            upload={textUpload}
            uploadType={textUploadType}
            onChange={(x) => setTextUploadType(x)}
          />
        )
      }
    } else if (activeStep === 1) {
      return SliderHeader(headerTexts[1].title, headerTexts[1].description, headerTexts[1].explanation)
    } else if (activeStep === 2) {
      return SliderHeader(headerTexts[2].title, headerTexts[2].description, headerTexts[2].explanation)
    } else if (activeStep === 3) {
      return SliderHeader(headerTexts[3].title, headerTexts[3].description, headerTexts[3].explanation)
    } else if (activeStep === 4) {
      return SliderHeader(headerTexts[4].title, headerTexts[4].description, headerTexts[4].explanation)
    } else return null
  }

  const isFirstSlideInvalid = useMemo(() => {
    if (activeStep === 0) {
      switch (inscriptionType) {
        case 'drc-20':
          if (actionType === actions[0] || actionType === actions[2]) return !tick || !amount || !recipientAddress
          return !tick || !totalSupply || !limitPerMint || !recipientAddress || !!formError
        case 'Files':
          return !file || !recipientAddress || !!formError
        case 'Text':
          return text?.length < 1 || !recipientAddress || !!formError
        case '.dogemap':
          return dogemap?.length < 1 || !recipientAddress || !!formError
        default:
          return false
      }
    }
    return false
  }, [
    actionType,
    activeStep,
    amount,
    file,
    formError,
    inscriptionType,
    limitPerMint,
    recipientAddress,
    text?.length,
    dogemap?.length,
    tick,
    totalSupply,
  ])

  const reset = () => {
    setActionType(actions[0])
    setActiveStep(0)
    setTextUploadType(textUpload[0])
    setDogemapUploadType(dogemapUpload[0])
    setRecipientAddress('')
    setTick('')
    setLimitPerMint(null)
    setNetworkFee({
      type: 'priorityPricing',
      total: 4,
      escrowWallet: null,
    })
    setTotalSupply(null)
    setAmount(null)
    setText('')
    setDogemap('')
    setFile(null)
    setContents(null)
    setConfirm({ dataAccuracy: false, termsAndConditions: false })
    setFormError(null)
    setIsLoading(false)
  }

  const loop = (times: number, callback: (x: any) => void) => {
    for (let i = 0; i < times; i++) {
      callback(i)
    }
  }

  // TODO: clean up
  // when amount exceeds maxPerMint during minting, we have to break the order down into multiple ones
  const createMintingOrderList = useCallback(
    (amount: number, maxPerMint: number) => {
      const multiplier = Math.floor(amount / maxPerMint)

      if (multiplier <= 1) {
        setContents([{ p: 'drc-20', op: 'mint', tick, amt: amount.toString() }])
      } else {
        const remainder = amount % maxPerMint
        let arr: number[] = []
        loop(multiplier, (_i) => arr.push(maxPerMint))

        remainder > 0 && arr.push(remainder)
        const newContents = arr.map((x) => ({
          p: 'drc-20',
          op: 'mint',
          tick,
          amt: x.toString(),
        }))
        setContents(newContents)
      }
    },
    [tick]
  )

  const continueToNextStep = () => {
    slider && slider.current && slider.current.slickNext()
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
    // @ts-ignore
    slider?.current?.slickGoTo(activeStep - 1)
  }

  useEffect(() => {
    if (activeStep === 4) {
      setTimeout(() => {
        reset()
        slider?.current?.slickGoTo(0)
      }, 5000)
    }
  }, [activeStep])

  const validateInput = useCallback(async () => {
    setIsLoading(true)
    if (inscriptionType === 'drc-20') {
      if (actionType === 'Mint') {
        const urlTickInfo = `${
          import.meta.env.VITE_API_ENDPOINT_URL || 'https://d20-api2.dogeord.io'
        }/ticks/byName/${tick}`
        fetch(urlTickInfo)
          .then((response) => response.json())
          .then((data) => {
            const amountLeft = data.supply - data.minted || 0
            if (amount) {
              if (amount > amountLeft) {
                setIsLoading(false)
                setFormError(`Amount too big. Max: ${amountLeft}`)
              } else {
                createMintingOrderList(amount, data?.limitPerMint)
                setIsLoading(false)
                setFormError(null)
                continueToNextStep()
              }
            } else {
              setIsLoading(false)
              setFormError('Please enter an amount.')
            }
          })
          .catch((error) => {
            console.log({ error })
            setIsLoading(false)
            setFormError('Something went wrong.')
          })
      }
      if (actionType === 'Deploy') {
        setContents([
          {
            p: 'drc-20',
            op: 'deploy',
            tick: tick.toString(),
            max: totalSupply?.toString(),
            lim: limitPerMint?.toString(),
          },
        ])
        setIsLoading(false)
        continueToNextStep()
      }
      if (actionType === 'Transfer') {
        setContents([{ p: 'drc-20', op: 'transfer', tick, amt: amount?.toString() }])
        setIsLoading(false)
        continueToNextStep()
      }
    }
    if (inscriptionType === 'Files') {
      setContents([{ filename: file?.name, data: file }])
      setIsLoading(false)
      continueToNextStep()
    }
    if (inscriptionType === 'Text') {
      textUploadType === 'Single'
        ? setContents([{ text }])
        : setContents(
            text
              .split('\n')
              .map((line) => ({ text: line }))
              .filter((x) => x.text.trim().length > 0)
          )
      setIsLoading(false)
      continueToNextStep()
    }
    if (inscriptionType === '.dogemap') {
      setContents(
        dogemap
          .split('\n')
          .map((line) => ({ dogemap: line }))
          .filter((x) => x.dogemap.trim().length > 0)
      )
      setIsLoading(false)
      continueToNextStep()
    }
  }, [
    actionType,
    amount,
    createMintingOrderList,
    file,
    inscriptionType,
    limitPerMint,
    text,
    dogemap,
    textUploadType,
    tick,
    totalSupply,
  ])

  return (
    <PageBase>
      <div className="flex-col-center">
        <div style={{ minWidth: '420px', maxWidth: '420px' }}>
          <Segmented
            options={types}
            defaultValue={types[0]}
            onChange={(x) => {
              reset()
              // @ts-ignore
              slider && slider.current && slider.current.slickGoTo(0)
              setInscriptionType(x as InscriptionType)
            }}
            size="large"
            style={{ marginBottom: '24px' }}
            block
          />
        </div>

        <ServiceContentContainer header={SlideHeaderManager()} minHeight="590px">
          <Slider ref={slider} {...sliderSettings}>
            {/* SLIDE # 1 */}
            <div>
              {FirstSlideContentManager()}
              {recentlyUsedAddress && recentlyUsedAddress.length > 10 ? (
                <div style={{ height: '50px', marginBlockStart: '16px', marginInlineStart: '8px', textAlign: 'left' }}>
                  <strong>Your recently used wallet address &nbsp;</strong>
                  <a onClick={() => setRecipientAddress(recentlyUsedAddress)} style={{ color: '#d98e29' }}>
                    {recentlyUsedAddress}
                  </a>
                </div>
              ) : (
                <div style={{ height: '50px' }}></div>
              )}
              {formError && <div style={{ color: 'red' }}>{formError}</div>}
              <SliderButton
                text={isLoading ? 'Loading...' : 'Confirm'}
                isDisabled={isFirstSlideInvalid || isLoading}
                onClick={validateInput}
              />
            </div>
            {/* SLIDE # 2 */}
            <InscriptionOrdersSlide
              inscriptionType={inscriptionType}
              setConfirm={(x) => setConfirm(x)}
              setContents={(x) => setContents(x)}
              confirm={confirm}
              contents={contents}
              continueToNextStep={continueToNextStep}
              setPricingData={(y) => setPricingData(y)}
              goBackStep={handleBack}
            />
            {/* SLIDE # 3 */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InscriptionNetworkFeeSlide
                onClick={(x: NetworkFee) => {
                  setNetworkFee(x)
                  continueToNextStep()
                }}
                contents={contents}
                pricingData={pricingData}
                type={inscriptionType}
                receivingAddress={recipientAddress}
              />
            </div>
            {/* SLIDE # 4 */}
            <div>
              <span style={{ fontSize: '18px', textAlign: 'left' }}>
                Send <span style={{ color: '#FFAE42' }}>{networkFee.total}</span> $DOGE to
              </span>
              <InputField
                label="Escrow wallet address"
                description={<div>The wallet to send the fees to.</div>}
                placeholder={networkFee.escrowWallet || 'tick'}
                value={networkFee.escrowWallet}
                disabled
                onClickCopy={() => navigator.clipboard.writeText(networkFee.escrowWallet!)}
                inputStyle={{ marginLeft: '10px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ display: 'inline-block', fontSize: '14px' }}>You can also scan the QR code instead:</p>
                <div style={{ width: 'fit-content', marginBlockEnd: '24px' }}>
                  <QRCode
                    size={140}
                    style={{ display: 'block', height: 'auto', maxWidth: '200px' }}
                    value={networkFee.escrowWallet || ''}
                    viewBox={`0 0 140 140`}
                  />
                </div>
                <Button
                  onClick={() => {
                    window.open('https://www.moonpay.com/buy/doge', '_blank')
                  }}
                  style={{
                    background: '#722bf5',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: 'bold',
                    width: '50%',
                    height: '42px',
                    margin: '0 8px 0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CreditIcon />
                  Use a credit card
                </Button>
              </div>
              {
                <SliderButton
                  text="Confirm payment"
                  isDisabled={!confirm.dataAccuracy || !confirm.termsAndConditions}
                  onClick={continueToNextStep}
                />
              }
            </div>
            {/* SLIDE # 5 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <div>
                  <CheckCircleIcon />
                </div>
                <p style={{ display: 'inline-block', width: '300px', fontSize: '18px' }}>
                  You can follow the transaction through the following link. Make sure to bookmark that link.
                </p>
              </div>

              <a
                href={`https://dogechain.info/address/${recipientAddress}`}
                target="_blank"
                style={{
                  display: 'inline-block',
                  background: '#feb628',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  height: '42px',
                  margin: '0px 0 16px 0',
                  padding: '6px 24px',
                  width: '260px',
                }}
              >
                Track transaction
              </a>
            </div>
          </Slider>
          {activeStep > 0 && activeStep < 4 && (
            <Button
              style={{
                position: 'absolute',
                border: '1px solid #f5f5f5',
                borderRadius: '16px',
                fontWeight: 'bold',
                height: '40px',
                marginTop: '0px',
                left: '16px',
                width: '100px',
              }}
              disabled={activeStep === 3}
              onClick={handleBack}
            >
              Back
            </Button>
          )}
        </ServiceContentContainer>
      </div>
    </PageBase>
  )
}

export default Inscribe
