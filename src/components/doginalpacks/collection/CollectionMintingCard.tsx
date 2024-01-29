import { Button, Progress } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import { useFetch } from 'usehooks-ts'

import AmountInput from '@/components/AmountInput'
//import DoginalInscriptionProgress from '@/components/DoginalInscriptionProgress'
import WalletConnect from '@/components/WalletConnect'
import { useWalletContext } from '@/WalletContext'

//import InputField from '../../InputField'
import ServiceContentContainer from '../../ServiceContentContainer'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../../../pages/index.css'

const SATOSHIS_PER_DOGECOIN: number = 100000000

interface Step {
  label: string
  description?: string
}

export interface CollectionMintingCardProps {
  name: string
  imgSrc: string
  altText: string
  mintingConfig: {
    maxMintsPerWallet: number
    dogePerMint: number
    fixedMinters: number
    showStatus: boolean
    fundingWalletAddress: string
    isSoldOut: boolean
    progressPercent?: number
    imgSrcSoldOut?: string
    totalSupply?: number
    currentSupply?: number
  }
  steps: Step[]
  isActive: boolean
  description?: string
}

const CollectionMintingCard: React.FC<CollectionMintingCardProps> = ({
  name,
  imgSrc,
  altText,
  mintingConfig,
  steps,
  isActive,
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
    if (doginalName && activeStep === 0) {
      const url = `${
        import.meta.env.VITE_API_ENDPOINT_URL || 'https://thedragontest.com/api'
      }/doginals/inscriptionrequest?name=${doginalName}&amount=${amount}&dogeAmount=${dogeAmount}&fundingAddress=${
        mintingConfig.fundingWalletAddress
      }&receiverAddress=${address}&txid=${fundingResult}`
      
      try {
        url;
        //const response = await fetch(url)
        //const rawData = await response.json()
        // @todo: handle error
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

  return (
    <ServiceContentContainer
      title={steps[activeStep]?.label}
      description={steps[activeStep]?.description}
      maxWidth={'400px'}
      minHeight={'730px'}
      info={steps[activeStep]?.description}
      showTitleBorder={activeStep !== 0}
    >
      <Slider ref={slider} {...sliderSettings}>
        {!mintingConfig.isSoldOut && (
          <div>
            <img id={doginalName} src={imgSrc} alt={altText} height="360" width="360" />
            <div className="mt-4 flex flex-row justify-between items-center">
              <div className="flex-col flex items-start">
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-xl font-bold">{mintingConfig.dogePerMint} Doge </div>
                <div className="text-xs text-gray-500">
                  ~${(mintingConfig.dogePerMint * (currentDogePrice || 0)).toFixed(2)}
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
                    <span style={{ color: '#FFAE42', fontWeight: 'bold' }}>
                      {Math.min(
                        100,
                        (Number(mintingConfig.currentSupply) / Number(mintingConfig.totalSupply)) * 100
                      ).toFixed(0)}
                      %
                    </span>{' '}
                    ({Math.min(Number(mintingConfig.currentSupply), Number(mintingConfig.totalSupply))}/
                    {Number(mintingConfig.totalSupply)})
                  </span>
                </div>
                <Progress
                  percent={Math.min(
                    100,
                    (Number(mintingConfig.currentSupply) / Number(mintingConfig.totalSupply)) * 100
                  )}
                  strokeColor={'#FFAE42'}
                  showInfo={false}
                />
              </div>
            )}
            {!mintingConfig.showStatus && <div className={connected ? 'min-h-0' : 'min-h-5.5'} />}
            {!mintingConfig.showStatus && <div className="mt-15" style={{ width: '100%' }} />}
            {!connected && (
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
            {connected && enoughFunds && (
              <>
                <Button
                  disabled={!connected || !address || !amount || !enoughFunds || !isActive}
                  style={{
                    background: !connected || !address || !amount || !enoughFunds || !isActive ? '#ccc' : '#feb628',
                    border: 'none',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '40px',
                    marginTop: '16px',
                    marginBottom: '8px',
                    width: '90%',
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
            <div className="flex flex-row mt-4 mb-4 text-xxs justify-start text-left">
              <span>
                By clicking "Mint", you agree to the{' '}
                <a href="/legal/terms" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>
                  Terms of use
                </a>{' '}
                and acknowledge that you are choosing to mint the NFT with the understanding that it may be worth less
                than the mint price, and may end up being worth nothing at all.
              </span>
            </div>
          </div>
        )}
        {!mintingConfig.isSoldOut && (
          <div>
            <div className="flex flex-col justify-center items-center">
              <img
                id={`${doginalName}-thanks`}
                src="/images/doginals/thanks.png"
                alt="thanks"
                height="300"
                width="300"
              />
              <div className="mt-8 text-xl">You will receive your {name} NFTs in your wallet in 24 to 48 hours.</div>
            </div>
          </div>
        )}
        {mintingConfig.isSoldOut && (
          <div>
            <img
              id={`${doginalName}-sold-out`}
              src={mintingConfig.imgSrcSoldOut || imgSrc}
              height="360"
              width="360"
              alt={`${doginalName}-sold-out`}
            />
            <div className="mt-4 flex flex-row justify-between items-center">
              <div className="flex-col flex items-start">
                <div className="text-xs text-gray-500">Price</div>
                <div className="text-xl font-bold">{mintingConfig.dogePerMint} Doge </div>
                <div className="text-xs text-gray-500">
                  ~${(mintingConfig.dogePerMint * (currentDogePrice || 0)).toFixed(2)}
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
                buttonDisabled={true}
                className={'opacity-30'}
                value={1}
                onChange={() => {}}
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
                    <span style={{ color: '#FFAE42', fontWeight: 'bold' }}>
                      {Math.min(
                        100,
                        (Number(mintingConfig.currentSupply) / Number(mintingConfig.totalSupply)) * 100
                      ).toFixed(0)}
                      %
                    </span>{' '}
                    ({Math.min(Number(mintingConfig.currentSupply), Number(mintingConfig.totalSupply))}/
                    {Number(mintingConfig.totalSupply)})
                  </span>
                </div>
                <Progress
                  percent={Math.min(
                    100,
                    (Number(mintingConfig.currentSupply) / Number(mintingConfig.totalSupply)) * 100
                  )}
                  strokeColor={'#FFAE42'}
                  showInfo={false}
                />
              </div>
            )}
            {!mintingConfig.showStatus && <div className={connected ? 'min-h-0' : 'min-h-3.5'} />}
            {!mintingConfig.showStatus && <div className="mt-10" style={{ width: '100%' }} />}
            <Button
              disabled={true}
              style={{
                background: '#ccc',
                border: 'none',
                borderRadius: '16px',
                color: 'white',
                fontWeight: 'bold',
                height: '40px',
                marginTop: '16px',
                marginBottom: '8px',
                width: '50%',
              }}
            >
              SOLD OUT
            </Button>
          </div>
        )}
      </Slider>
    </ServiceContentContainer>
  )
}

export default CollectionMintingCard
