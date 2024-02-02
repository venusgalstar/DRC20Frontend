import { useRef, useState, useEffect } from 'react'
import { Button, Progress } from 'antd'
import Slider from 'react-slick'
import { useFetch } from 'usehooks-ts'

import AmountInput from '@/components/AmountInput'
import WalletConnect from '@/components/WalletConnect'
import { useWalletContext } from '@/WalletContext'

import Countdown from '../Countdown'
import ServiceContentContainer from '../ServiceContentContainer'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../../pages/index.css'

const SATOSHIS_PER_DOGECOIN: number = 100000000

interface Step {
  label: string
  description?: string
}

export interface LaunchpadCollectionCardProps {
  name: string
  symbol: string
  imgSrc: string
  altText: string
  mintingConfig: {
    maxMintsPerWallet: number
    dogePerMint: number
    fixedMinters: number
    showStatus: boolean
    fundingWalletAddress: string
    supply: number
    whitelistedForEarlyAccess: boolean
  }
  steps: Step[]
  isActive: boolean
  description?: string
  twitterLink?: string
  websiteLink?: string
  launchpadEndTimestamp?: number
  launchpadEarlyAccessMinutes?: number
  launchpadMintedSupply?: number
  highlightColor?: string
}

const LaunchpadCollectionCard: React.FC<LaunchpadCollectionCardProps> = ({
  name,
  symbol,
  imgSrc,
  altText,
  mintingConfig,
  steps,
  isActive,
  description,
  twitterLink,
  websiteLink,
  launchpadEndTimestamp = 0,
  launchpadEarlyAccessMinutes = 0,
  launchpadMintedSupply = 0,
  highlightColor = '#FFAE42',
}) => {
  const baseUrl = import.meta.env.VITE_API_ENDPOINT_URL || 'https://thedragontest.com/api'
  const currentDogePriceUrl = `${baseUrl}/ticks/currentDogePrice`
  const { data: currentDogePrice } = useFetch<number>(currentDogePriceUrl)

  const slider = useRef<Slider>(null)
  const doginalName = name

  const { sendDoge, address, connected, balance } = useWalletContext()

  const [activeStep, setActiveStep] = useState(0)
  const [serviceWalletAddress, setServiceWalletAddress] = useState(mintingConfig.fundingWalletAddress)
  const [enoughFunds, setEnoughFunds] = useState(false)
  const [amount, setAmount] = useState(1)
  const [dogeAmount, setDogeAmount] = useState(0)

  const twoDays = 2 * 24 * 60 * 60 * 1000
  const earlyAccessTimespan = launchpadEarlyAccessMinutes * 60 * 1000

  const earlyAccessStartTimestamp = launchpadEndTimestamp - twoDays - earlyAccessTimespan
  const publicMintingStartTimestamp = launchpadEndTimestamp - twoDays
  const isEarlyAccessMintingPhase = earlyAccessStartTimestamp < Date.now() && Date.now() < publicMintingStartTimestamp
  const isFarAway = Date.now() < publicMintingStartTimestamp - twoDays * 45

  const launchpadStartTimestamp = mintingConfig.whitelistedForEarlyAccess
    ? earlyAccessStartTimestamp
    : publicMintingStartTimestamp
  const [showCountdown, setShowCountdown] = useState(launchpadStartTimestamp && launchpadStartTimestamp > Date.now())

  useEffect(() => {
    const handleReset = async () => {
      setServiceWalletAddress(mintingConfig.fundingWalletAddress)
      setActiveStep(0)
      // @ts-ignore
      slider?.current?.slickGoTo(0)
      setAmount(1)
      setDogeAmount(0)
    }

    if (amount > mintingConfig.maxMintsPerWallet) {
      setAmount(mintingConfig.maxMintsPerWallet)
    }

    if (amount && amount > 0) {
      const calcDogeAmount = amount * mintingConfig.dogePerMint
      setDogeAmount(calcDogeAmount)
    }

    const enoughFundsToBuy = balance.total / SATOSHIS_PER_DOGECOIN > dogeAmount
    setEnoughFunds(enoughFundsToBuy)

    if (activeStep === 1) {
      setTimeout(handleReset, 3000)
    }
  }, [
    setDogeAmount,
    amount,
    activeStep,
    setEnoughFunds,
    dogeAmount,
    balance.total,
    mintingConfig.maxMintsPerWallet,
    mintingConfig.dogePerMint,
    mintingConfig.fundingWalletAddress,
  ])

  const handleInscriptionRequest = async () => {
    const fundingResult = await sendDoge(serviceWalletAddress, dogeAmount * SATOSHIS_PER_DOGECOIN)
    // increment the doginal counter
    if (doginalName && symbol && activeStep === 0) {
      const url = `${
        import.meta.env.VITE_API_ENDPOINT_URL || 'https://thedragontest.com/api'
      }/launchpad/inscribe?name=${symbol}&amount=${amount}&dogeAmount=${dogeAmount}&fundingAddress=${
        mintingConfig.fundingWalletAddress
      }&receiverAddress=${address}&txid=${fundingResult}`

      try {
        const response = await fetch(url)
        await response.json()
      } catch (error) {
        console.error(error)
      }
    }
  }

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
  }

  const soldOut = launchpadMintedSupply >= mintingConfig.supply
  const mintDisabled = !connected || !address || !amount || !enoughFunds || !isActive || !!showCountdown

  return (
    <ServiceContentContainer
      title={steps[activeStep]?.label || ''}
      description={steps[activeStep]?.description || ''}
      maxWidth={'400px'}
      minHeight={'780px'}
      showTitleBorder={activeStep !== 0}
      twitterLink={twitterLink}
      websiteLink={websiteLink}
      info={description}
      highlightColor={highlightColor}
    >
      <Slider ref={slider} {...sliderSettings}>
        <div>
          <img id={doginalName} src={imgSrc} alt={altText} height="360" width="360" style={{ borderRadius: '0px' }} />
          <div className="mt-4 flex flex-row items-center">
            <div className="flex-col flex items-start">
              <div className="flex justify-between w-32 bg-account-page-default rounded-md p-2 text-xs">
                <p>PRICE: </p>
                <span className="flex items-center gap-1">
                  {!isFarAway && <img className="w-3 rounded-full" src={'/images/dogecoin.svg'} alt="Dogecoin" />}
                  {isFarAway
                    ? 'TBA'
                    : mintingConfig.dogePerMint.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                </span>
              </div>
            </div>
            <div className="flex-col flex items-start ml-4">
              <div className="flex justify-between w-32 bg-account-page-default rounded-md p-2 text-xs">
                <p>ITEMS: </p>
                <span className="flex items-center gap-1">{mintingConfig.supply}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-between items-center">
            <div className="flex-col flex items-start">
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-xl font-bold">
                {isFarAway ? 'TBA' : `${mintingConfig.dogePerMint * amount} Doge`}
              </div>
              <div className="text-xs text-gray-500">
                {isFarAway ? '' : `~${(mintingConfig.dogePerMint * amount * (currentDogePrice || 0)).toFixed(2)}`}
              </div>
            </div>
            {!isActive && (
              <img
                id="dds"
                className="ml-2"
                src="/images/doginals/dropdownarrow.png"
                alt="dropdownshadow"
                height="10.22"
                width="15"
              />
            )}
            <div className="flex-1"></div>
            <AmountInput
              className={!isActive ? 'opacity-30' : ''}
              value={!isActive ? 1 : amount}
              onChange={setAmount}
              max={mintingConfig.maxMintsPerWallet}
            />
          </div>
          {mintingConfig.showStatus && (
            <div className="mt-4" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>Total Minted</span>
                <span>
                  <span style={{ color: highlightColor, fontWeight: 'bold' }}>
                    {Math.min(100, (launchpadMintedSupply / mintingConfig.supply) * 100).toFixed(
                      launchpadMintedSupply / mintingConfig.supply > 0.99 &&
                        launchpadMintedSupply < mintingConfig.supply
                        ? 2
                        : 0
                    )}
                    %
                  </span>{' '}
                  ({Math.min(launchpadMintedSupply, mintingConfig.supply)}/{mintingConfig.supply})
                </span>
              </div>
              <Progress
                percent={Math.min(100, (launchpadMintedSupply / mintingConfig.supply) * 100)}
                strokeColor={highlightColor}
                showInfo={false}
              />
            </div>
          )}
          {isEarlyAccessMintingPhase && launchpadEarlyAccessMinutes > 0 && <div>Early access minting started</div>}
          {!mintingConfig.showStatus && <div className={connected ? 'min-h-0' : 'min-h-3.5'} />}
          {!mintingConfig.showStatus && <div className="mt-10" style={{ width: '100%' }} />}
          {!connected && !showCountdown && (
            <div style={{ marginTop: '16px', marginBottom: '8px', textAlign: 'center' }}>
              <WalletConnect disabled={!isActive} />
            </div>
          )}
          {connected && !enoughFunds && isActive && (
            <div style={{ marginTop: '16px', marginBottom: '8px', color: 'red', textAlign: 'left' }}>
              <strong>
                Insufficient funds, please get some DOGE in order to mint {amount} {altText} here.
              </strong>
            </div>
          )}
          {connected && !enoughFunds && !isActive && <div className="min-h-10" />}
          {mintingConfig.whitelistedForEarlyAccess && (
            <div
              className="flex w-40 rounded-md p-2 text-xs text-center justify-center m-auto mt-4"
              style={{ backgroundColor: 'RGBA(35, 213, 129, 0.2)', color: '#23D581' }}
            >
              <strong>Early Access Granted</strong>
            </div>
          )}
          {soldOut && (
            <>
              <Button
                disabled={true}
                style={{
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '0px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  height: '46px',
                  marginTop: '16px',
                  marginBottom: '8px',
                  width: '100%',
                }}
              >
                SOLD OUT
              </Button>
            </>
          )}
          {connected && enoughFunds && !soldOut && !isFarAway && (
            <>
              <Button
                disabled={mintDisabled}
                style={{
                  background: mintDisabled ? '#ccc' : highlightColor,
                  border: 'none',
                  borderRadius: '0px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  height: '46px',
                  marginTop: '16px',
                  marginBottom: '8px',
                  width: '100%',
                }}
                onClick={async () => {
                  await handleInscriptionRequest()
                  slider && slider.current && slider.current.slickNext()
                  setActiveStep((prevActiveStep) => prevActiveStep + 1)
                }}
              >
                Mint
              </Button>
            </>
          )}
          {isFarAway && (
            <div className="flex flex-row mb-4 justify-start text-left">
              <Button
                disabled
                style={{
                  background: '#ccc',
                  border: 'none',
                  borderRadius: '0px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  height: '46px',
                  marginTop: '16px',
                  marginBottom: '8px',
                  width: '100%',
                }}
              >
                Coming Soon
              </Button>
            </div>
          )}
          {!soldOut && !isFarAway && (
            <div className="flex flex-row mb-4 justify-start text-left">
              {showCountdown ? (
                <div className="flex flex-row justify-center items-center text-center w-100%">
                  <span style={{ color: '#232530', fontSize: '18px', fontWeight: 'bold', marginRight: '8px' }}>
                    Starts in
                  </span>
                  <Countdown
                    value={launchpadStartTimestamp!}
                    onFinish={() => setShowCountdown(false)}
                    itemStyle={{ backgroundColor: highlightColor }}
                  />
                </div>
              ) : (
                <span className="text-xxs">
                  By clicking "Mint", you agree to the{' '}
                  <a href="/legal/terms" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>
                    Terms of use
                  </a>{' '}
                  and acknowledge that you are choosing to mint the NFT with the understanding that it may be worth less
                  than the mint price, and may end up being worth nothing at all.
                </span>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="flex flex-col justify-center items-center">
            <img id={`${doginalName}-thanks`} src="/images/doginals/thanks.png" alt="thanks" height="300" width="300" />
            <div className="mt-8 text-xl">You will receive your {name} NFTs in your wallet within 48 hours.</div>
          </div>
        </div>
      </Slider>
    </ServiceContentContainer>
  )
}

export default LaunchpadCollectionCard
